import { createDraft, enableAllPlugins, finishDraft, Patch } from 'immer'
import { BehaviorSubject, queueScheduler } from 'rxjs'
import { observeOn } from 'rxjs/operators'
import { Message, RESTATE_UPDATE_MESSAGE } from './message'

enableAllPlugins()

export type UpdateFunction<S> = (subState: S) => void

interface MiddlewareProps<S, MESSAGE extends Message> {
  nextState: S
  currentState: S
  message: MESSAGE
}

export type Middleware<S, MESSAGE extends Message> = (
  props: MiddlewareProps<S, MESSAGE>
) => any

export interface RxStoreOptions {
  freeze: boolean
  storeName: string
  dev: boolean
}

export interface StatePackage<STATE, MESSAGES extends Message> {
  state: Readonly<STATE>
  message: MESSAGES
  patches?: Patch[] | null
  inversePatches?: Patch[] | null
  stack?: string
}

export class RxStore<STATE, MESSAGES extends Message> {
  protected _state$: BehaviorSubject<StatePackage<STATE, MESSAGES>>
  protected _messageBus$: BehaviorSubject<MESSAGES>

  protected _options: RxStoreOptions

  protected _middleware: Middleware<STATE, MESSAGES>[] = []

  constructor(
    stateSubject: BehaviorSubject<StatePackage<STATE, MESSAGES>>,
    messageBus: BehaviorSubject<MESSAGES>,
    middleware: Middleware<STATE, MESSAGES>[],
    options: RxStoreOptions
  ) {
    this._state$ = stateSubject
    this._messageBus$ = messageBus
    this._middleware = middleware
    this._options = options
  }

  static of<S, M extends Message>(
    state: BehaviorSubject<StatePackage<S, M>>,
    messageBus: BehaviorSubject<M>,
    middleware: Middleware<S, M>[],
    options: RxStoreOptions
  ) {
    return new RxStore(state, messageBus, middleware, options)
  }

  private _next(
    updateFunctionOrNextState: UpdateFunction<STATE> | STATE,
    message: MESSAGES = RESTATE_UPDATE_MESSAGE as any,
    stack: string | undefined
  ) {
    try {
      const currentStatePackage = this._state$.value
      const isUpdateFunction = updateFunctionOrNextState instanceof Function

      // we accept either a new state object or a update function
      // a) If we receive an object, we create a draft from that object. The draft will be used in the middleware
      // b) If we receive an function, we create a draft from the current state.
      let draft = isUpdateFunction
        ? (createDraft(currentStatePackage.state) as STATE)
        : (createDraft(updateFunctionOrNextState) as STATE)

      if (updateFunctionOrNextState instanceof Function) {
        const ret = updateFunctionOrNextState(draft)
        if (ret !== undefined) {
          draft = createDraft(ret as any) as STATE
        }
      }

      recursiveMiddlewareHandler<STATE, MESSAGES>({
        middleware: this._middleware,
        nextState: draft,
        currentState: this.state,
        message
      })

      let _patches: Patch[] | null = null
      let _inversePatches: Patch[] | null = null

      const nextState = finishDraft(draft, (patches, inversePatches) => {
        _patches = patches
        _inversePatches = inversePatches
      }) as STATE

      const nextStatePackage: StatePackage<STATE, MESSAGES> = {
        message,
        state: nextState,
        patches: _patches,
        inversePatches: _inversePatches,
        stack: this._options.dev ? stack : undefined
      }

      this._state$.next(nextStatePackage)

      return nextStatePackage
    } catch (e) {
      console.error(e)
      return { state: this._state$.value, message }
    }
  }

  next(
    updateFunctionOrNextState: UpdateFunction<STATE> | STATE,
    message: MESSAGES = RESTATE_UPDATE_MESSAGE as any
  ) {
    const stack = getStackTrace(this._options.dev)
    this._next(updateFunctionOrNextState, message, stack)
  }

  nextAsync(
    updateFunctionOrNextState: UpdateFunction<STATE> | STATE,
    message: MESSAGES = RESTATE_UPDATE_MESSAGE as any
  ) {
    const stack = getStackTrace(this._options.dev)
    setTimeout(() => {
      this._next(updateFunctionOrNextState, message, stack)
    }, 0)
  }

  dispatch(message: MESSAGES) {
    this._messageBus$.next(message)
  }

  get state(): Readonly<STATE> {
    return this._state$.value.state
  }

  get state$() {
    return this._state$.pipe(observeOn(queueScheduler))
  }

  get messageBus$() {
    return this._messageBus$.pipe(observeOn(queueScheduler))
  }

  get options() {
    return this._options
  }

  get middleware() {
    return this._middleware
  }
}

interface RecursiveMiddlewareHandlerProps<STATE, MESSAGES extends Message> {
  middleware: Middleware<STATE, MESSAGES>[]
  nextState: STATE
  currentState: STATE
  message: MESSAGES
}

function recursiveMiddlewareHandler<STATE, MESSAGES extends Message>({
  middleware,
  nextState,
  currentState,
  message
}: RecursiveMiddlewareHandlerProps<STATE, MESSAGES>): any {
  if (middleware.length === 0) {
    return
  }

  const nextMiddleware = middleware[0]

  nextMiddleware({
    nextState,
    currentState,
    message
  })

  const remainingMiddleware = middleware.slice(1, middleware.length)

  return recursiveMiddlewareHandler({
    middleware: remainingMiddleware,
    nextState,
    currentState,
    message
  })
}

function getStackTrace(dev: boolean) {
  if (dev) {
    return new Error().stack
  } else {
    return undefined
  }
}
