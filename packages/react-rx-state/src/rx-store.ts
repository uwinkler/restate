import isEqual from "lodash/isEqual"
import produce, { Patch } from "immer"
import { BehaviorSubject } from "rxjs"
import { distinctUntilChanged, map } from "rxjs/operators"
import { SelectorFunction } from "./subscribe"

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
  protected _options: RxStoreOptions

  constructor(x: BehaviorSubject<STATE>, options: RxStoreOptions) {
    this._state$ = x
    this._options = options
  }

  static of<S>(state: BehaviorSubject<S>, options: RxStoreOptions) {
    return new RxStore(state, options)
  }

  subStore<T extends object>(selector: SelectorFunction<STATE, T>): RxStore<T> {
    const initalState = selector(this.state$.value)
    const subStoreObservable$ = new BehaviorSubject<T>(initalState)
    const subStore = RxStore.of<T>(subStoreObservable$, this._options)

    //
    //  Upstream subscription
    //
    subStore.state$.subscribe(nextSubState => {
      const currentState = this._state$.value
      const nextState = produce(currentState, draft => {
        const subState = selector(draft as STATE)
        Object.assign(subState, nextSubState)
      })

      if (!isEqual(currentState, nextState)) {
        this.next(_ => nextState)
      }
    })

    //
    // Downstream
    //
    this.state$
      .pipe(
        map(selector),
        distinctUntilChanged()
      )
      .subscribe(nextSubState => {
        const currentSubStoreState = subStore.state
        if (!isEqual(nextSubState, currentSubStoreState)) {
          subStore.next(_ => nextSubState)
        }
      })

    //
    // Meta
    //
    // we only upstram meta information, not downstream.
    subStore.meta$
      .pipe(distinctUntilChanged())
      .subscribe(meta => this.meta$.next(meta))

    // Message Bus
    //
    // down-stream and up-stream messages, we simply share the messageBus Subject
    subStore._messageBus$ = this._messageBus$

    return subStore
  }

  next(
    updateFunction: UpdateFunction<STATE>,
    metaInfo: MetaInfo = defaultMetaInfo
  ) {
    const currentState = this.state$.value
    const nextState = produce<STATE>(
      currentState,
      draftState => {
        return updateFunction(draftState as STATE)
      },
      (patches, inversePatches) => {
        this.patches$.next(patches)
        this.inversePatches$.next(inversePatches)
      }
    )
    this.state$.next(nextState)
    this.meta$.next(metaInfo)
  }

  dispatch(message: Message) {
    this.messageBus$.next(message)
  }

  get state(): STATE {
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

  get options() {
    return this._options
  }
}
