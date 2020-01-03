import { createDraft, finishDraft, Patch } from "immer"
import { BehaviorSubject, Subscription } from "rxjs"
import { distinctUntilChanged, map } from "rxjs/operators"
import { defaultMetaInfo, Message, RxStore } from "./rx-store"

export type ActionFactorySelectorFunction<S, T extends object> = (state: S) => T

type UpdateFunction<T> = (subState: T) => void

export interface ActionPropsState<STATE, MESSAGES extends Message> {
  store: RxStore<STATE, MESSAGES>
  subscription: Subscription
}

export interface ActionFactoryProps<SUB_STATE, MESSAGES> {
  state: () => SUB_STATE
  next: (updateFunction: UpdateFunction<SUB_STATE>) => void
  dispatch: (message: MESSAGES) => void
}

export type ActionFactory<SUB_STATE, MESSAGES, T> = (
  props: ActionFactoryProps<SUB_STATE, MESSAGES>
) => T

type ActionFactoryConnectProps<S, M extends Message, T> = ActionPropsState<
  S,
  M
> &
  ActionFactoryProps<T, M>

function createPropsForForges<S, M extends Message, T extends Object>(
  store: RxStore<S, M>,
  selectorFunction: ActionFactorySelectorFunction<S, T>
): ActionFactoryConnectProps<S, M, T> {
  const subState$ = new BehaviorSubject<T>(selectorFunction(store.state))
  const state = () => selectorFunction(store.state)

  const subscription = store.state$
    .pipe(
      map(statePackage => statePackage.state),
      map(selectorFunction),
      distinctUntilChanged()
    )
    .subscribe(nextValue => subState$.next(nextValue))

  function next(
    updateFunction: UpdateFunction<T>,
    message: M = defaultMetaInfo as any
  ) {
    const currentState = store.state
    const draftState = createDraft(currentState)
    const subState = selectorFunction(draftState as any)
    updateFunction(subState)
    const patchListener = (_patches: Patch[], _inversePatches: Patch[]) => {}
    const nextState = finishDraft(draftState, patchListener) as S
    store.next(nextState, message)
  }

  function dispatch(msg: M) {
    store.dispatch(msg)
  }

  return {
    next,
    state, // SubState
    dispatch,
    store,
    subscription
  }
}

export type ActionFactoryConnectFunction<
  STATE,
  MESSAGES extends Message,
  SUB_STATE,
  ACTIONS
> = (props: ActionFactoryConnectProps<STATE, MESSAGES, SUB_STATE>) => ACTIONS

export function connectActions<
  STATE,
  MESSAGES extends Message,
  SUB_STATE extends Object,
  ACTIONS
>(
  store: RxStore<STATE, MESSAGES>,
  selectorFunction: ActionFactorySelectorFunction<STATE, SUB_STATE>,
  actionFactory: ActionFactoryConnectFunction<
    STATE,
    MESSAGES,
    SUB_STATE,
    ACTIONS
  >
) {
  const props = createPropsForForges(store, selectorFunction)
  return actionFactory(props)
}
