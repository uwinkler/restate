import { RxStore } from "./rx-store"
import { useContext } from "react"
import { Message } from "./message"

type CreateUseMessageBusObservableHookProps<
  S,
  M extends Message
> = React.Context<RxStore<S, M>>

export function createDispatchHook<S extends object, M extends Message>(
  provider: CreateUseMessageBusObservableHookProps<S, M>
) {
  return function useDispatch() {
    const store = useContext(provider)

    function dispatch(message: M) {
      store.dispatch(message)
    }

    return dispatch
  }
}
