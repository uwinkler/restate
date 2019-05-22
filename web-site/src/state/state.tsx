import React from "react"
import {
  connectLogger,
  createProvider,
  createStore,
  createStateHook,
  createNextHook
} from "@restate/core"

interface State {
  drawerOpen: boolean
}

const defaultState: State = {
  drawerOpen: true
}

const store = createStore({ state: defaultState })
export const Provider = createProvider(store)
export const useAppState = createStateHook(Provider)
export const useUpdateAppState = createNextHook(Provider)

if (process.env.NODE_ENV === "dev") {
  connectLogger(store)
}

export const AppStateProvider: React.FC = props => {
  return <Provider.Provider value={store}>{props.children}</Provider.Provider>
}
