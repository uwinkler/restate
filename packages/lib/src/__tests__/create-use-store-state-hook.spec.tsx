import { createStore } from "../create-store"
import { createProvider } from "../create-provider"
import React from "react"
import renderer from "react-test-renderer"
import { createUseStoreStateHook } from "../create-use-store-state-hook"

it("should create default hook", () => {
  const state = { value: 1 }
  const store = createStore({ state })
  const AppStoreProvider = createProvider(store)
  const useAppStore = createUseStoreStateHook(AppStoreProvider)

  const TestComponent: React.FC = () => {
    const x = useAppStore(s => s)
    return <div>{x.value}</div>
  }

  const component = renderer.create(
    <AppStoreProvider.Provider value={store}>
      <TestComponent />
    </AppStoreProvider.Provider>
  )
  let tree = component.toJSON()
  expect(tree).toMatchInlineSnapshot(`
            <div>
              1
            </div>
      `)
})

it("sub-state 1", () => {
  const state = { value: 1 }
  const store = createStore({ state })
  const AppStoreProvider = createProvider(store)
  const useAppStore = createUseStoreStateHook(AppStoreProvider)

  const TestComponent: React.FC = () => {
    const value = useAppStore(s => s.value)
    return <div>{value}</div>
  }

  const component = renderer.create(
    <AppStoreProvider.Provider value={store}>
      <TestComponent />
    </AppStoreProvider.Provider>
  )
  let tree = component.toJSON()
  expect(tree).toMatchInlineSnapshot(`
        <div>
          1
        </div>
    `)
})

it("sub-state 2", () => {
  const state = { subState: { value: 1 } }
  const store = createStore({ state })
  const AppStoreProvider = createProvider(store)
  const useAppStoreSubState = createUseStoreStateHook(
    AppStoreProvider,
    s => s.subState
  )

  const TestComponent: React.FC = () => {
    const subState = useAppStoreSubState(s => s)
    return <div>{subState.value}</div>
  }

  const component = renderer.create(
    <AppStoreProvider.Provider value={store}>
      <TestComponent />
    </AppStoreProvider.Provider>
  )
  let tree = component.toJSON()
  expect(tree).toMatchInlineSnapshot(`
        <div>
          1
        </div>
    `)
})

it("sub-state 1+2", () => {
  const state = { subState: { value: 1 } }
  const store = createStore({ state })
  const AppStoreProvider = createProvider(store)
  const useAppStoreSubState = createUseStoreStateHook(
    AppStoreProvider,
    s => s.subState
  )

  const TestComponent: React.FC = () => {
    const value = useAppStoreSubState(s => s.value)
    expect(typeof value).toEqual("number")
    return <div>{value}</div>
  }

  const component = renderer.create(
    <AppStoreProvider.Provider value={store}>
      <TestComponent />
    </AppStoreProvider.Provider>
  )
  let tree = component.toJSON()

  expect(tree).toMatchInlineSnapshot(`
          <div>
            1
          </div>
      `)
})
