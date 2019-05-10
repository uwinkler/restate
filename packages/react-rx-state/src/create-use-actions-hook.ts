import { RxStore } from "./rx-store"
import { useContext, useMemo } from "react"
import {
  ActionFactorySelectorFunction,
  connectActions,
  ActionFactoryConnectFunction
} from "./connect-actions"

export function createUseActionsHook<
  STATE extends object,
  SUB_STATE extends object,
  ACTIONS
>(
  provider: React.Context<RxStore<STATE>>,
  selectorFunction: ActionFactorySelectorFunction<STATE, SUB_STATE>,
  actionFactory: ActionFactoryConnectFunction<STATE, SUB_STATE, ACTIONS>
) {
  return function useActions() {
    const store = useContext(provider)
    const actions = useMemo(
      () => connectActions(store, selectorFunction, actionFactory),
      [store]
    )
    return actions
  }
}
