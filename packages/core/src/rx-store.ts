import { Draft, createDraft, finishDraft } from 'immer'
import { BehaviorSubject, Observable, Subject, queueScheduler } from 'rxjs'
import { observeOn, takeUntil } from 'rxjs/operators'

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
  trace?: TRACE
  stack?: string
}

export class RestateStore<STATE extends Object, TRACE = any> {
  protected _state$: BehaviorSubject<StatePackage<STATE, TRACE>>
  protected _close$ = new Subject<string>()
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

  static of<S extends Object, T = any>(
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
      const isUpdateFunction = updateFunctionOrNextState instanceof Function

      function useUpdateFunction(state: STATE): Draft<STATE> {
        const ret = createDraft(state)
        if (isUpdateFunction) {
          const update: STATE | void = updateFunctionOrNextState(ret as STATE)
          return update == null ? ret : createDraft(update)
        } else {
          throw new Error('We should not be here')
        }
      }

      const nextStateDraft = isUpdateFunction
        ? useUpdateFunction(this.state)
        : createDraft(updateFunctionOrNextState)

      recursiveMiddlewareHandler<STATE>({
        middleware: this._middleware,
        nextState: nextStateDraft as STATE,
        currentState: this.state
      })

      const nextState = finishDraft(nextStateDraft) as STATE

      const nextStatePackage: StatePackage<STATE, TRACE> = {
        state: nextState,
        trace: trace
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

  close() {
    this._close$.next('closing the store')
    this._close$.complete()
  }

  get state$(): Observable<StatePackage<STATE, TRACE>> {
    return this._state$.pipe(takeUntil(this._close$), observeOn(queueScheduler))
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
