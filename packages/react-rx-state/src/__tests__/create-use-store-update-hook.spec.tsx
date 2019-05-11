import "jsdom-global/register"
import Adapter from "enzyme-adapter-react-16"
import React from "react"
import { configure, mount } from "enzyme"
import { createProvider } from "../create-provider"
import { createStore } from "../create-store"
import { createUseStoreStateHook } from "../create-use-store-state-hook"
import { createUseStoreUpdateHook } from "../create-use-store-update-hook"

configure({ adapter: new Adapter() })

it("should update a state", () => {
  const state = { value: 1 }
  const store = createStore({ state })
  const AppStoreProvider = createProvider(store)
  const useAppStore = createUseStoreStateHook(AppStoreProvider)
  const useAppStoreUpdate = createUseStoreUpdateHook(AppStoreProvider)

  const TestComponent: React.FC = () => {
    const x = useAppStore(s => s)

    const nextStore = useAppStoreUpdate(s => s)

    function increment() {
      nextStore(s => {
        s.value = s.value + 1
      })
    }

    return (
      <button className="btn" onClick={increment}>
        {x.value}
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

  expect(store.state.value).toEqual(2)
  expect(component.html()).toMatchInlineSnapshot(
    `"<button class=\\"btn\\">2</button>"`
  )
})
