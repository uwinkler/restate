import React from 'react'
import { createAppStateHook } from './create-app-state-hook'
import { createNextHook } from './create-next-hook'
import { createProvider } from './create-provider'
import { createSelectorHook } from './create-selector-hook'
import {
  createStore,
  CreateStoreProps,
  RESTATE_STORE_DEFAULT_OPTIONS
} from './create-store'
import { createStoreHook } from './create-store-hook'

/**
 *
 * @example
 * export const { StateProvider, useAppState, useNext} = create({
 *    state: {
 *      user: {
 *        name: "John",
 *        age: 32
 *      }
 *    }
 * })
 */
export function create<STATE extends object, TRACE = any>({
  state,
  middleware = [],
  options = RESTATE_STORE_DEFAULT_OPTIONS
}: CreateStoreProps<STATE, TRACE>) {
  const store = createStore({ state, middleware, options })
  const AppStateContext = createProvider(store)
  const useSelector = createSelectorHook(AppStateContext)
  const useNext = createNextHook(AppStateContext)
  const useStore = createStoreHook(AppStateContext)
  const useAppState = createAppStateHook(AppStateContext, (s) => s)

  const StateProvider = (props: { children: React.ReactNode }) => (
    <AppStateContext.Provider value={store}>
      {props.children}
    </AppStateContext.Provider>
  )

  return {
    AppStateContext,
    StateProvider,
    useAppState,
    useSelector,
    useNext,
    store,
    useStore
  }
}
