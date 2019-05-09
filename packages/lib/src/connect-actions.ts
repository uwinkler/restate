import produce from "immer"
import { BehaviorSubject, Observable, Subscription } from "rxjs"
import { distinctUntilChanged, map } from "rxjs/operators"
import { MetaInfo, RxStore } from "./rx-store"

const defaultMetaInfo: MetaInfo = {
  type: "@RX/ACTIONS"
}

export type ActionFactorySelectorFunction<S, T extends object> = (state: S) => T
type UpdateFunction<T> = (subState: T) => void

type IdentitySelectorFunction<S> = (state: S) => S
const identitySelectorFunction: IdentitySelectorFunction<any> = state => state

export interface ActionPropsState<STATE> {
  store: RxStore<STATE>
  subscription: Subscription
}

export interface ActionPropsSubState<SUB_STATE> {
  state$: Observable<SUB_STATE>
  meta$: Observable<MetaInfo>
  messageBus$: Observable<MetaInfo>
  next: (updateFunction: UpdateFunction<SUB_STATE>) => void
}

type ActionFactoryProps<S, T> = ActionPropsState<S> & ActionPropsSubState<T>

function createPropsForForges<S, T extends Object>(
  store: RxStore<S>,
  selectorFunction: ActionFactorySelectorFunction<S, T>
): ActionFactoryProps<S, T> {
  const selector = selectorFunction
    ? selectorFunction
    : identitySelectorFunction

  const state$ = store.state$
  const subState$ = new BehaviorSubject<T>(selectorFunction(store.state$.value))

  const subscription = store.state$
    .pipe(
      map(selectorFunction),
      distinctUntilChanged()
    )
    .subscribe(nextValue => subState$.next(nextValue))

  function next(
    updateFunction: UpdateFunction<T>,
    metaInfo: MetaInfo = defaultMetaInfo
  ) {
    const currentState = state$.value
    const nextState = produce<S>(
      currentState,
      draftState => {
        const subState = selector(draftState as any)
        updateFunction(subState)
        return draftState
      },
      (patches, inversePatches) => {
        store.patches$.next(patches)
        store.inversePatches$.next(inversePatches)
      }
    )
    state$.next(nextState)
    store.meta$.next(metaInfo)
  }

  store.messageBus$

  return {
    state$: subState$,
    meta$: store.meta$,
    messageBus$: store.messageBus$,
    next,
    store,
    subscription
  }
}

export type ActionFactory<STATE, SUB_STATE, ACTIONS> = (
  props: ActionFactoryProps<STATE, SUB_STATE>
) => ACTIONS

export function connectActions<STATE, SUB_STATE extends Object, ACTIONS>(
  store: RxStore<STATE>,
  selectorFunction: ActionFactorySelectorFunction<STATE, SUB_STATE>,
  actionFactory: ActionFactory<STATE, SUB_STATE, ACTIONS>
) {
  const props = createPropsForForges(store, selectorFunction)
  return actionFactory(props)
}
