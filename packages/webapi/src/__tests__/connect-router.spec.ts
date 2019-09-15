import { createStore } from "@restate/core"
import { WithConnectReactRouterState } from ".."
import { defaultRouterState, connectReactRouter } from "../"
import { createMemoryHistory } from "history"

interface RouterState {
  routerInfo: number
}

interface AppState extends WithConnectReactRouterState<RouterState> {
  value: number
}

it("should provide history", () => {
  const defaultState: AppState = {
    value: 0,
    location: { ...defaultRouterState, state: { routerInfo: 0 } }
  }

  const store = createStore({ state: defaultState })
  const history = createMemoryHistory()

  connectReactRouter({ appStore: store, history })

  expect(store.state.location.pathname).toEqual("/")
  expect(store.state.location.state).toEqual({ routerInfo: 0 })

  history.push("/new_path", { routerInfo: 1 })
  expect(store.state.location.pathname).toEqual("/new_path")
  expect(store.state.location.state).toEqual({ routerInfo: 1 })
})
