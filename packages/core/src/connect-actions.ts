import { createDraft, finishDraft, Patch } from "immer"
import { BehaviorSubject, Subscription } from "rxjs"
import { distinctUntilChanged, map } from "rxjs/operators"
import { Message, MetaInfo, RxStore } from "./rx-store"

const defaultMetaInfo: MetaInfo = {
  type: "@RX/ACTIONS"
}

export type ActionFactorySelectorFunction<S, T extends object> = (state: S) => T
type UpdateFunction<T> = (subState: T) => void

export interface ActionPropsState<STATE> {
  store: RxStore<STATE>
  subscription: Subscription
}

export interface ActionFactoryProps<SUB_STATE> {
  state: () => SUB_STATE
  next: (updateFunction: UpdateFunction<SUB_STATE>) => void
  dispatch: (message: Message) => void
}

export type ActionFactory<SUB_STATE, T> = (
  props: ActionFactoryProps<SUB_STATE>
) => T

type ActionFactoryConnectProps<S, T> = ActionPropsState<S> &
  ActionFactoryProps<T>

function createPropsForForges<S, T extends Object>(
  store: RxStore<S>,
  selectorFunction: ActionFactorySelectorFunction<S, T>
): ActionFactoryConnectProps<S, T> {
  const subState$ = new BehaviorSubject<T>(selectorFunction(store.state))
  const state = () => selectorFunction(store.state)

  const subscription = store.state$
    .pipe(
      map(statePackage => statePackage.payload),
      map(selectorFunction),
      distinctUntilChanged()
    )
    .subscribe(nextValue => subState$.next(nextValue))

  function next(
    updateFunction: UpdateFunction<T>,
    metaInfo: MetaInfo = defaultMetaInfo
  ) {
    const currentState = store.state
    const draftState = createDraft(currentState)
    const subState = selectorFunction(draftState as any)
    updateFunction(subState)
    const patchListener = (_patches: Patch[], _inversePatches: Patch[]) => {}
    const nextState = finishDraft(draftState, patchListener) as S
    store.next(nextState, metaInfo)
  }

  function dispatch(msg: Message) {
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

export type ActionFactoryConnectFunction<STATE, SUB_STATE, ACTIONS> = (
  props: ActionFactoryConnectProps<STATE, SUB_STATE>
) => ACTIONS

export function connectActions<STATE, SUB_STATE extends Object, ACTIONS>(
  store: RxStore<STATE>,
  selectorFunction: ActionFactorySelectorFunction<STATE, SUB_STATE>,
  actionFactory: ActionFactoryConnectFunction<STATE, SUB_STATE, ACTIONS>
) {
  const props = createPropsForForges(store, selectorFunction)
  return actionFactory(props)
}
