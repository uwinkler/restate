import produce from "immer"
import { BehaviorSubject, Observable, Subscription } from "rxjs"
import { distinctUntilChanged, map } from "rxjs/operators"
import { MetaInfo, RxStore } from "./rx-store"

const defaultMetaInfo: MetaInfo = {
  type: "@RX/TOOLBOX"
}

type SelectorFunction<S, T extends object> = (state: S) => T
type UpdateFunction<T> = (subState: T) => void

type IdentifySelectorFunction<S> = (state: S) => S
const identitySelectorFunction: IdentifySelectorFunction<any> = state => state

export interface ForgePropsStore<S> {
  store: RxStore<S>
  subscription: Subscription
}

export interface ForgeProps<SUB_STATE> {
  state$: Observable<SUB_STATE>
  meta$: Observable<MetaInfo>
  messageBus$: Observable<MetaInfo>
  next: (updateFunction: UpdateFunction<SUB_STATE>) => void
}

type CompleteForgeProps<S, T> = ForgePropsStore<S> & ForgeProps<T>

function createPropsForForges<S, T extends Object>(
  store: RxStore<S>,
  selectorFunction: SelectorFunction<S, T>
): CompleteForgeProps<S, T> {
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

export type ToolboxForge<STATE, SUB_STATE, TOOLBOX> = (
  props: CompleteForgeProps<STATE, SUB_STATE>
) => TOOLBOX

export function createToolbox<STATE, SUB_STATE extends Object, TOOLBOX>(
  store: RxStore<STATE>,
  selectorFunction: SelectorFunction<STATE, SUB_STATE>,
  forge: ToolboxForge<STATE, SUB_STATE, TOOLBOX>
) {
  const props = createPropsForForges(store, selectorFunction)
  return forge(props)
}
