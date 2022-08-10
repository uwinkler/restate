import { createStore } from '@restate/core'
import { createMemoryHistory } from 'history'
import { WithConnectReactRouterState } from '..'
import { connectReactRouter, defaultRouterState } from '../'

interface AppState extends WithConnectReactRouterState {}

it('test history', () => {
  const history = createMemoryHistory()
  expect(history.location.pathname).toMatchInlineSnapshot(`"/"`)
})

it('should provide history', () => {
  const defaultState: AppState = {
    location: { ...defaultRouterState }
  }

  const store = createStore({ state: defaultState })
  const history = createMemoryHistory()

  connectReactRouter({ appStore: store, history })
  expect(store.state.location.pathname).toEqual('/')
  expect(store.state.location.state).toEqual('')

  history.push('/new_path', { routerInfo: 1 })
  expect(store.state.location.pathname).toEqual('/new_path')
  expect(store.state.location.state).toEqual({ routerInfo: 1 })
})
