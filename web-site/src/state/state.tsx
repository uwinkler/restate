import React from "react"
import {
  connectLogger,
  createProvider,
  createStore,
  createUseStoreStateHook,
  createUseStoreUpdateHook
} from "react-rx-state"

interface State {
  drawerOpen: boolean
}

const defaultState: State = {
  drawerOpen: true
}

const store = createStore({ state: defaultState })
export const Provider = createProvider(store)
export const useAppState = createUseStoreStateHook(Provider)
export const useUpdateAppState = createUseStoreUpdateHook(Provider)

if (process.env.NODE_ENV === "dev") {
  connectLogger(store)
}

export const AppStateProvider: React.FC = props => {
  return <Provider.Provider value={store}>{props.children}</Provider.Provider>
}
