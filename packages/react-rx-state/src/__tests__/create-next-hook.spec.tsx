import "jsdom-global/register"
import Adapter from "enzyme-adapter-react-16"
import React from "react"
import { configure, mount } from "enzyme"
import { createProvider } from "../create-provider"
import { createStore } from "../create-store"
import { createStateHook } from "../create-state-hook"
import { createNextHook } from "../create-next-hook"
import { act } from "react-test-renderer"

/**
 * 
 * :warning: Known issue: https://github.com/facebook/react/issues/14769
 *  
 * Warning: An update to TestComponent inside a test was not wrapped in act(...).
      
      When testing, code that causes React state updates should be wrapped into act(...):
      
      act(() => {

      });

      
      This ensures that you're testing the behavior the user would see in the browser. Learn more at https://fb.me/react-wrap-tests-with-act
          in TestComponent
          in WrapperComponent
 */

configure({ adapter: new Adapter() })

it("should update a state", async () => {
  const state = { value: 1 }
  const store = createStore({ state })
  const AppStoreProvider = createProvider(store)
  const useAppState = createStateHook(AppStoreProvider)
  const useNextAppState = createNextHook(AppStoreProvider)

  const TestComponent: React.FC = () => {
    const x = useAppState(s => s)

    const nextAppState = useNextAppState(s => s)

    function increment() {
      nextAppState(s => {
        s.value = s.value + 1
      })
    }

    return (
      <button className="btn" onClick={increment}>
        {x.value}
      </button>
    )
  }

  let component: any

  act(() => {
    component = mount(
      <AppStoreProvider.Provider value={store}>
        <TestComponent />
      </AppStoreProvider.Provider>
    )
  })

  expect(component.html()).toMatchInlineSnapshot(
    `"<button class=\\"btn\\">1</button>"`
  )

  act(() => {
    const btn = component.find(".btn")
    btn.simulate("click")
  })

  process.nextTick(() => {
    expect(store.state.value).toEqual(2)
    expect(component.html()).toMatchInlineSnapshot(
      `"<button class=\\"btn\\">2</button>"`
    )
  })
})

it("should update selected properties", () => {
  const state = { value: 1 }
  const store = createStore({ state })
  const AppStoreProvider = createProvider(store)
  const useAppStore = createStateHook(AppStoreProvider)
  const useAppStoreUpdate = createNextHook(AppStoreProvider)

  const TestComponent: React.FC = () => {
    const value = useAppStore(s => s.value)
    const nextStore = useAppStoreUpdate(s => s)

    function increment() {
      nextStore(s => {
        s.value = s.value + 1
      })
    }

    return (
      <button className="btn" onClick={increment}>
        {value}
      </button>
    )
  }

  const component = mount(
    <AppStoreProvider.Provider value={store}>
      <TestComponent />
    </AppStoreProvider.Provider>
  )

  expect(component.html()).toMatchInlineSnapshot(
    `"<button class=\\"btn\\">1</button>"`
  )

  const btn = component.find(".btn")
  btn.simulate("click")

  process.nextTick(() => {
    expect(store.state.value).toEqual(2)
    expect(component.html()).toMatchInlineSnapshot(
      `"<button class=\\"btn\\">2</button>"`
    )
  })
})

it("should update a scoped state", () => {
  const state = { subState: { value: 1 } }
  const store = createStore({ state })
  const AppStoreProvider = createProvider(store)
  const useAppState = createStateHook(AppStoreProvider)
  const useNextAppState = createNextHook(
    AppStoreProvider,
    state => state.subState
  )

  const TestComponent: React.FC = () => {
    const x = useAppState(s => s)

    const nextAppState = useNextAppState(s => s)

    function increment() {
      nextAppState(s => {
        s.value = s.value + 1
      })
    }

    return (
      <button className="btn" onClick={increment}>
        {x.subState.value}
      </button>
    )
  }

  const component = mount(
    <AppStoreProvider.Provider value={store}>
      <TestComponent />
    </AppStoreProvider.Provider>
  )

  expect(component.html()).toMatchInlineSnapshot(
    `"<button class=\\"btn\\">1</button>"`
  )

  const btn = component.find(".btn")
  btn.simulate("click")

  process.nextTick(() => {
    expect(store.state.subState.value).toEqual(2)
    expect(component.html()).toMatchInlineSnapshot(
      `"<button class=\\"btn\\">2</button>"`
    )
  })
})
