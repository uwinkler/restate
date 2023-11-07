import { Patch, createDraft, enablePatches, finishDraft } from 'immer'
import { BehaviorSubject, queueScheduler } from 'rxjs'
import { observeOn } from 'rxjs/operators'

enablePatches()

export type UpdateFunction<S> = (subState: S) => void

interface MiddlewareProps<S> {
  nextState: S
  currentState: S
}

export type Middleware<S> = (props: MiddlewareProps<S>) => any

export interface RestateStoreOptions {
  freeze: boolean
  storeName: string
  dev: boolean
}

export interface StatePackage<STATE, TRACE> {
  state: Readonly<STATE>
  patches?: Patch[] | null
  inversePatches?: Patch[] | null
  trace?: TRACE
  stack?: string
}

export class RestateStore<STATE, TRACE = any> {
  protected _state$: BehaviorSubject<StatePackage<STATE, TRACE>>
  protected _options: RestateStoreOptions
  protected _middleware: Middleware<STATE>[] = []

  constructor(
    stateSubject: BehaviorSubject<StatePackage<STATE, TRACE>>,
    middleware: Middleware<STATE>[],
    options: RestateStoreOptions
  ) {
    this._state$ = stateSubject
    this._middleware = middleware
    this._options = options
  }

  static of<S, T = any>(
    state: BehaviorSubject<StatePackage<S, T>>,
    middleware: Middleware<S>[],
    options: RestateStoreOptions
  ) {
    return new RestateStore(state, middleware, options)
  }

  private _next(
    updateFunctionOrNextState: UpdateFunction<STATE> | STATE,
    trace?: TRACE
  ) {
    try {
      const currentStatePackage = this._state$.value
      const isUpdateFunction = updateFunctionOrNextState instanceof Function

      // we accept either a new state object or a update function
      // a) If we receive an object, we create a draft from that object. The draft will be used in the middleware
      // b) If we receive an function, we create a draft from the current state.
      let draft = isUpdateFunction
        ? (createDraft(currentStatePackage.state) as STATE)
        : (createDraft(updateFunctionOrNextState as any) as STATE)

      if (updateFunctionOrNextState instanceof Function) {
        const ret = updateFunctionOrNextState(draft)
        if (ret !== undefined) {
          draft = createDraft(ret as any) as STATE
        }
      }

      recursiveMiddlewareHandler<STATE>({
        middleware: this._middleware,
        nextState: draft,
        currentState: this.state
      })

      let _patches: Patch[] | null = null
      let _inversePatches: Patch[] | null = null

      const nextState = finishDraft(draft, (patches, inversePatches) => {
        _patches = patches
        _inversePatches = inversePatches
      }) as STATE

      const nextStatePackage: StatePackage<STATE, TRACE> = {
        state: nextState,
        patches: _patches,
        trace: trace,
        inversePatches: _inversePatches
      }

      this._state$.next(nextStatePackage)

      return nextStatePackage
    } catch (e) {
      console.error(e)
      return { state: this._state$.value }
    }
  }

  next(
    updateFunctionOrNextState: UpdateFunction<STATE> | STATE,
    trace?: TRACE
  ) {
    this._next(updateFunctionOrNextState, trace)
  }

  nextAsync(
    updateFunctionOrNextState: UpdateFunction<STATE> | STATE,
    trace?: TRACE
  ) {
    setTimeout(() => {
      this._next(updateFunctionOrNextState, trace)
    }, 0)
  }

  get state(): Readonly<STATE> {
    return this._state$.value.state
  }

  get state$() {
    return this._state$.pipe(observeOn(queueScheduler))
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
}

function recursiveMiddlewareHandler<STATE>({
  middleware,
  nextState,
  currentState
}: RecursiveMiddlewareHandlerProps<STATE>): any {
  if (middleware.length === 0) {
    return
  }

  const nextMiddleware = middleware[0]

  nextMiddleware({
    nextState,
    currentState
  })

  const remainingMiddleware = middleware.slice(1, middleware.length)

  return recursiveMiddlewareHandler({
    middleware: remainingMiddleware,
    nextState,
    currentState
  })
}
