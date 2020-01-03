import { RxStore, Message } from "./rx-store"
import { useContext, useMemo } from "react"
import {
  ActionFactorySelectorFunction,
  connectActions,
  ActionFactoryConnectFunction
} from "./connect-actions"

export function createActionsHook<
  STATE extends object,
  MESSAGES extends Message,
  SUB_STATE extends object,
  ACTIONS
>(
  provider: React.Context<RxStore<STATE, MESSAGES>>,
  selectorFunction: ActionFactorySelectorFunction<STATE, SUB_STATE>,
  actionFactory: ActionFactoryConnectFunction<
    STATE,
    MESSAGES,
    SUB_STATE,
    ACTIONS
  >
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
