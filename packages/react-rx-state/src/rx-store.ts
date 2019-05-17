import { BehaviorSubject } from "rxjs"
import { createDraft, finishDraft, Patch } from "immer"

export type UpdateFunction<S> = (subState: S) => void

export interface Message {
  type: string
  payload?: any
}

export interface MetaInfo extends Message {
  // nothing here
}

export const UPDATE = "@RX/UPDATE"

const defaultMetaInfo = {
  type: UPDATE
}

export const INIT_MESSAGAE: Message = {
  type: "@RX/INIT"
}

interface MiddlewareProps<S> {
  state: S
  metaInfo: MetaInfo
  next(): any
}

export interface NextErrorMessage<STATE> {
  error: Error
  state: STATE
  metaInfo: MetaInfo
}

export type Middleware<S> = (props: MiddlewareProps<S>) => any

export interface RxStoreOptions {
  freeze: boolean
  storeName: string
}

export class RxStore<STATE> {
  protected _state$: BehaviorSubject<STATE>
  protected _meta$: BehaviorSubject<MetaInfo> = new BehaviorSubject(
    INIT_MESSAGAE
  )
  protected _patches$: BehaviorSubject<Patch[]> = new BehaviorSubject([] as any)
  protected _inversePatches$: BehaviorSubject<Patch[]> = new BehaviorSubject(
    [] as any
  )
  protected _messageBus$: BehaviorSubject<Message> = new BehaviorSubject(
    INIT_MESSAGAE
  )
  protected _error$: BehaviorSubject<NextErrorMessage<
    STATE
  > | null> = new BehaviorSubject(null as any)

  protected _options: RxStoreOptions

  protected _middlewares: Middleware<STATE>[] = []

  constructor(x: BehaviorSubject<STATE>, options: RxStoreOptions) {
    this._state$ = x
    this._options = options
  }

  static of<S>(state: BehaviorSubject<S>, options: RxStoreOptions) {
    return new RxStore(state, options)
  }

  async next(
    updateFunction: UpdateFunction<STATE>,
    metaInfo: MetaInfo = defaultMetaInfo
  ) {
    try {
      const currentState = this.state$.value
      const draft = createDraft(currentState) as STATE
      const draftMetaInfos = createDraft(metaInfo)

      await updateFunction(draft)
      await recursiveMiddleareHandler(this._middlewares, draft, draftMetaInfos)

      const nextState = finishDraft(draft, (patches, inversePatches) => {
        this.patches$.next(patches)
        this.inversePatches$.next(inversePatches)
      }) as STATE

      const nextMetaInfo = finishDraft(draftMetaInfos)

      this.state$.next(nextState)
      this.meta$.next(nextMetaInfo)
      this.error$.next(null as any)

      return { state: nextState, metaInfo: nextMetaInfo }
    } catch (e) {
      this._error$.next({ error: e, state: this.state$.value, metaInfo })
      return e
    }
  }

  dispatch(message: Message) {
    this.messageBus$.next(message)
  }

  get state(): Readonly<STATE> {
    return this._state$.value
  }

  get state$() {
    return this._state$
  }

  get patches$() {
    return this._patches$
  }

  get inversePatches$() {
    return this._inversePatches$
  }

  get meta$() {
    return this._meta$
  }

  get messageBus$() {
    return this._messageBus$
  }

  get error$() {
    return this._error$
  }

  get options() {
    return this._options
  }

  get middlewares() {
    return this._middlewares
  }
}

async function recursiveMiddleareHandler<STATE>(
  middlewares: Middleware<STATE>[],
  state: STATE,
  metaInfo: MetaInfo
) {
  if (middlewares.length === 0) {
    return {
      state,
      metaInfo
    }
  }

  const nextCall = middlewares[0]
  const rest = middlewares.slice(1, middlewares.length)
  const nextFunction = async () => {
    await recursiveMiddleareHandler(rest, state, metaInfo)
  }

  return await nextCall({
    state,
    metaInfo,
    next: nextFunction
  })
}