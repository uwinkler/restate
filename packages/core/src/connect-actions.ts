import { createDraft, finishDraft } from "immer"
import { BehaviorSubject, Observable, Subscription } from "rxjs"
import { distinctUntilChanged, map } from "rxjs/operators"
import { MetaInfo, RxStore, Message } from "./rx-store"

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
  state$: Observable<SUB_STATE>
  messageBus$: Observable<MetaInfo>
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
  const state$ = store.state$
  const subState$ = new BehaviorSubject<T>(
    selectorFunction(store.state$.value.payload)
  )

  const state = () => selectorFunction(state$.value.payload)

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
    const currentState = state$.value.payload
    const draftState = createDraft(currentState)
    const subState = selectorFunction(draftState as any)
    updateFunction(subState)
    const nextState = finishDraft(draftState) as S
    store.next(nextState, metaInfo)
  }

  function dispatch(msg: Message) {
    store.dispatch(msg)
  }

  return {
    state$: subState$,
    messageBus$: store.messageBus$,
    next,
    state,
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
