import React from 'react'
import renderer, { act } from 'react-test-renderer'
import { createNextHook } from '../create-next-hook'
import { createProvider } from '../create-provider'
import { createSelectorHook } from '../create-selector-hook'
import { createStore } from '../create-store'

it('should update a state', async () => {
  const state = { value: 1 }
  const store = createStore({ state })
  const AppStoreProvider = createProvider(store)
  const useAppState = createSelectorHook(AppStoreProvider)
  const useNextAppState = createNextHook(AppStoreProvider)

  const TestComponent: React.FC = () => {
    const x = useAppState((s) => s)

    const nextAppState = useNextAppState((s) => s)

    function increment() {
      nextAppState((s) => {
        s.value = s.value + 1
      })
    }

    return (
      <button className="btn" onClick={increment}>
        {x.value}
      </button>
    )
  }

  const Component = (
    <AppStoreProvider.Provider value={store}>
      <TestComponent />
    </AppStoreProvider.Provider>
  )

  const container = renderer.create(Component)

  expect(container.toJSON()).toMatchInlineSnapshot(`
    <button
      className="btn"
      onClick={[Function]}
    >
      1
    </button>
  `)
  container.root.findByType('button').props.onClick()
  container.update(Component)

  expect(store.state.value).toEqual(2)
  expect(container.toJSON()).toMatchInlineSnapshot(`
    <button
      className="btn"
      onClick={[Function]}
    >
      2
    </button>
  `)
})

it('should update selected properties', () => {
  const state = { value: 1 }
  const store = createStore({ state })
  const AppStoreProvider = createProvider(store)
  const useAppStore = createSelectorHook(AppStoreProvider)
  const useAppStoreUpdate = createNextHook(AppStoreProvider)

  const TestComponent = () => {
    const value = useAppStore((s) => s.value)
    const nextStore = useAppStoreUpdate((s) => s)

    function increment() {
      nextStore((s) => {
        s.value = s.value + 1
      })
    }

    return (
      <button className="btn" onClick={increment}>
        {value}
      </button>
    )
  }

  const App = (
    <AppStoreProvider.Provider value={store}>
      <TestComponent />
    </AppStoreProvider.Provider>
  )

  const container = renderer.create(App)

  expect(container.toJSON()).toMatchInlineSnapshot(`
    <button
      className="btn"
      onClick={[Function]}
    >
      1
    </button>
  `)

  act(() => {
    container.root.findByType('button').props.onClick()
    container.update(App)
  })

  expect(store.state.value).toEqual(2)
  expect(container.toJSON()).toMatchInlineSnapshot(`
    <button
      className="btn"
      onClick={[Function]}
    >
      2
    </button>
  `)
})

it('should update a scoped state', () => {
  const state = { subState: { value: 1 } }
  const store = createStore({ state })
  const AppStoreProvider = createProvider(store)
  const useAppState = createSelectorHook(AppStoreProvider)
  const useNextAppState = createNextHook(
    AppStoreProvider,
    (state) => state.subState
  )

  const TestComponent = () => {
    const x = useAppState((s) => s)

    const nextAppState = useNextAppState((s) => s)

    function increment() {
      nextAppState((s) => {
        s.value = s.value + 1
      })
    }

    return (
      <button className="btn" onClick={increment}>
        {x.subState.value}
      </button>
    )
  }

  const App = (
    <AppStoreProvider.Provider value={store}>
      <TestComponent />
    </AppStoreProvider.Provider>
  )

  const container = renderer.create(App)

  expect(container.toJSON()).toMatchInlineSnapshot(`
    <button
      className="btn"
      onClick={[Function]}
    >
      1
    </button>
  `)

  act(() => {
    container.root.findByType('button').props.onClick()
    container.update(App)
  })

  expect(store.state.subState.value).toEqual(2)
  expect(container.toJSON()).toMatchInlineSnapshot(`
    <button
      className="btn"
      onClick={[Function]}
    >
      2
    </button>
  `)
})

it('should update using an object instead of an function', () => {
  const state = { subState: { value: 1 } }
  const store = createStore({ state })
  const AppStoreProvider = createProvider(store)
  const useAppState = createSelectorHook(AppStoreProvider)
  const useNextAppState = createNextHook(AppStoreProvider, (state) => state)

  const TestComponent = () => {
    const x = useAppState((s) => s)
    const nextAppState = useNextAppState((s) => s.subState.value)

    return (
      <button className="btn" onClick={() => nextAppState(10)}>
        {x.subState.value}
      </button>
    )
  }

  const App = (
    <AppStoreProvider.Provider value={store}>
      <TestComponent />
    </AppStoreProvider.Provider>
  )

  const container = renderer.create(App)

  expect(store.state.subState.value).toEqual(1)
  expect(container.toJSON()).toMatchInlineSnapshot(`
    <button
      className="btn"
      onClick={[Function]}
    >
      1
    </button>
  `)

  act(() => {
    container.root.findByType('button').props.onClick()
    container.update(App)
  })

  expect(store.state.subState.value).toEqual(10)
  expect(container.toJSON()).toMatchInlineSnapshot(`
    <button
      className="btn"
      onClick={[Function]}
    >
      10
    </button>
  `)
})
