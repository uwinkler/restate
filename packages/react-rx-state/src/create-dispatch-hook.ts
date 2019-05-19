import { RxStore, Message } from "./rx-store"
import { useContext } from "react"

type CreateUseMessageBusObservableHookProps<S> = React.Context<RxStore<S>>

export function createDispatchHook<S extends object>(
  provider: CreateUseMessageBusObservableHookProps<S>
) {
  return function useDispatch() {
    const store = useContext(provider)

    function dispatch(message: Message) {
      store.dispatch(message)
    }

    return dispatch
  }
}
