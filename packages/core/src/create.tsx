import React from 'react'
import { createActionHooks } from './create-actions-hook'
import { createDispatchHook } from './create-dispatch-hook'
import { createNextHook } from './create-next-hook'
import { createProvider } from './create-provider'
import { createStateHook } from './create-state-hook'
import { createStore, CreateStoreProps, RESTATE_STORE_DEFAULT_OPTIONS } from './create-store'
import { Message } from './message'

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
export function create<STATE extends object, M extends Message>({
  state,
  middleware = [],
  options = RESTATE_STORE_DEFAULT_OPTIONS
}: CreateStoreProps<STATE, M>) {
  const store = createStore({ state, middleware, options })
  const AppStateContext = createProvider(store)
  const useAppState = createStateHook(AppStateContext)
  const useNext = createNextHook(AppStateContext)
  const useDispatch = createDispatchHook(AppStateContext)
  const createActions = createActionHooks(AppStateContext)

  const StateProvider = (props: { children: React.ReactNode }) => (
    <AppStateContext.Provider value={store}>{props.children}</AppStateContext.Provider>
  )

  return { AppStateContext, StateProvider, useAppState, useNext, useDispatch, createActions, store }
}
