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

export const INIT_MESSAGE: Message = {
  type: "@RX/INIT"
}

export interface NextErrorMessage<STATE> {
  error: Error
  package: StatePackage<STATE>
  metaInfo: MetaInfo
}

interface MiddlewareProps<S> {
  nextState: S
  currentState: S
  metaInfo: MetaInfo
}

export type Middleware<S> = (props: MiddlewareProps<S>) => any

export interface RxStoreOptions {
  freeze: boolean
  storeName: string
}

export interface StatePackage<STATE> {
  type: string
  payload: Readonly<STATE>
  meta?: MetaInfo
  patches?: Patch[] | null
  inversePatches?: Patch[] | null
}

export class RxStore<STATE> {
  protected _state$: BehaviorSubject<StatePackage<STATE>>

  protected _messageBus$: BehaviorSubject<Message> = new BehaviorSubject(
    INIT_MESSAGE
  )

  protected _error$: BehaviorSubject<NextErrorMessage<
    STATE
  > | null> = new BehaviorSubject(null as any)

  protected _options: RxStoreOptions

  protected _middleware: Middleware<STATE>[] = []

  constructor(
    stateSubject: BehaviorSubject<StatePackage<STATE>>,
    middleware: Middleware<STATE>[],
    options: RxStoreOptions
  ) {
    this._state$ = stateSubject
    this._options = options
    this._middleware = middleware
  }

  static of<S>(
    state: BehaviorSubject<StatePackage<S>>,
    middleware: Middleware<S>[],
    options: RxStoreOptions
  ) {
    return new RxStore(state, middleware, options)
  }

  next(
    updateFunctionOrNextState: UpdateFunction<STATE> | STATE,
    metaInfo: MetaInfo = defaultMetaInfo
  ) {
    try {
      const currentStatePackage = this.state$.value
      const isUpdateFunction = updateFunctionOrNextState instanceof Function

      const draft = isUpdateFunction
        ? (createDraft(currentStatePackage.payload) as STATE)
        : (createDraft(updateFunctionOrNextState) as STATE)

      const draftMetaInfo = createDraft(metaInfo)

      if (updateFunctionOrNextState instanceof Function) {
        updateFunctionOrNextState(draft)
      }

      recursiveMiddlewareHandler<STATE>({
        middleware: this._middleware,
        nextState: draft,
        currentState: this.state,
        metaInfo: draftMetaInfo
      })

      let _patches: Patch[] | null = null
      let _inversePatches: Patch[] | null = null

      const nextState = finishDraft(draft, (patches, inversePatches) => {
        _patches = patches
        _inversePatches = inversePatches
      }) as STATE

      const nextMetaInfo = finishDraft(draftMetaInfo)

      const nextStatePackage: StatePackage<STATE> = {
        type: nextMetaInfo.type,
        payload: nextState,
        meta: nextMetaInfo.payload,
        patches: _patches,
        inversePatches: _inversePatches
      }

      this.state$.next(nextStatePackage)
      this.error$.next(null as any)

      return { state: nextState, metaInfo: nextMetaInfo }
    } catch (e) {
      this._error$.next({ error: e, package: this.state$.value, metaInfo })
      return e
    }
  }

  dispatch(message: Message) {
    this.messageBus$.next(message)
  }

  get state(): Readonly<STATE> {
    return this._state$.value.payload
  }

  get state$() {
    return this._state$
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

  get middleware() {
    return this._middleware
  }
}

interface RecursiveMiddlewareHandlerProps<STATE> {
  middleware: Middleware<STATE>[]
  nextState: STATE
  currentState: STATE
  metaInfo: MetaInfo
}

function recursiveMiddlewareHandler<STATE>({
  middleware,
  nextState,
  currentState,
  metaInfo
}: RecursiveMiddlewareHandlerProps<STATE>): any {
  if (middleware.length === 0) {
    return
  }

  const nextMiddleware = middleware[0]
  nextMiddleware({
    nextState,
    currentState,
    metaInfo
  })

  const remainingMiddleware = middleware.slice(1, middleware.length)

  return recursiveMiddlewareHandler({
    middleware: remainingMiddleware,
    nextState,
    currentState,
    metaInfo
  })
}
