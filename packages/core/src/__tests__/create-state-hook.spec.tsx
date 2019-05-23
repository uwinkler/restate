import "jsdom-global/register"
import Adapter from "enzyme-adapter-react-16"

import { createStore } from "../create-store"
import { createProvider } from "../create-provider"
import React from "react"
import renderer, { act } from "react-test-renderer"
import { createStateHook } from "../create-state-hook"
import { configure, mount } from "enzyme"
import { createNextHook } from "../create-next-hook"

configure({ adapter: new Adapter() })

it("should create default hook", () => {
  const state = { value: 1 }
  const store = createStore({ state })
  const AppStoreProvider = createProvider(store)
  const useAppStore = createStateHook(AppStoreProvider)

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
  const useAppStore = createStateHook(AppStoreProvider)

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
  const useAppStoreSubState = createStateHook(AppStoreProvider, s => s.subState)

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
  const useAppStoreSubState = createStateHook(AppStoreProvider, s => s.subState)

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

it("should do some computations", () => {
  const state = { subState: { value: 1 } }
  const store = createStore({ state })
  const AppStoreProvider = createProvider(store)
  const useAppStoreSubState = createStateHook(AppStoreProvider, s => s.subState)

  const TestComponent: React.FC = () => {
    const value = useAppStoreSubState(s => s.value + 1)
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
                        2
                      </div>
            `)
})

it("should call the selector two time (initialize)", () => {
  const state = { subState: { value: 1 } }
  const store = createStore({ state })
  const AppStoreProvider = createProvider(store)
  const useAppState = createStateHook(AppStoreProvider, s => s)

  const selector = jest.fn(s => s.subState.value)

  const TestComponent: React.FC = () => {
    const value = useAppState(selector)
    return <div>{value}</div>
  }

  act(() => {
    mount(
      <AppStoreProvider.Provider value={store}>
        <TestComponent />
      </AppStoreProvider.Provider>
    )
  })

  // Two times: initial value and the first useEffect run
  expect(selector).toHaveBeenCalledTimes(2)
})

it("should unmount observables", () => {
  const state = { subState: { value: 1 } }
  const store = createStore({ state })
  const AppStoreProvider = createProvider(store)
  const useAppState = createStateHook(AppStoreProvider, s => s)

  const selector = jest.fn(s => s.subState.value)

  const TestComponent: React.FC = () => {
    const value = useAppState(selector)
    return <div>{value}</div>
  }

  let component: any

  act(() => {
    component = mount(
      <AppStoreProvider.Provider value={store}>
        <TestComponent />
      </AppStoreProvider.Provider>
    )
  })

  component.unmount()

  act(() => {
    store.next(s => {
      s.subState.value = 2
    })
  })

  // The selector should not be called anymore
  expect(selector).toHaveBeenCalledTimes(2)
})

it("should call the selector three times in total time if the state updates", () => {
  const state = { subState: { value: 1 } }
  const store = createStore({ state })
  const AppStoreProvider = createProvider(store)
  const useAppState = createStateHook(AppStoreProvider, s => s)

  const selector = jest.fn(s => s.subState.value)

  const TestComponent: React.FC = () => {
    const value = useAppState(selector)
    return <div>{value}</div>
  }

  act(() => {
    mount(
      <AppStoreProvider.Provider value={store}>
        <TestComponent />
      </AppStoreProvider.Provider>
    )
  })

  act(() => {
    store.next(s => {
      s.subState.value = 2
    })
  })

  expect(selector).toHaveBeenCalledTimes(3)
})

it("should be able to use some outer values to do some computations", done => {
  const state = { value: 1 }
  const store = createStore({ state })
  const AppStoreProvider = createProvider(store)
  const useAppState = createStateHook(AppStoreProvider, s => s)

  const TestComponent: React.FC = () => {
    const [add, setAdd] = React.useState(1)
    const value = useAppState(s => s.value + add, { deps: [add] })

    return (
      <button className="btn" onClick={() => setAdd(add + 1)}>
        {add}-{value}
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
    `"<button class=\\"btn\\">1-2</button>"`
  )

  act(() => {
    const btn = component.find(".btn")
    btn.simulate("click")
  })

  setTimeout(() => {
    expect(component.html()).toMatchInlineSnapshot(
      `"<button class=\\"btn\\">2-3</button>"`
    )
    done()
  }, 0)
})

it("should be able to use multiple app state hooks", done => {
  const state = { value: 1 }
  const store = createStore({ state })
  const AppStoreProvider = createProvider(store)
  const useAppState = createStateHook(AppStoreProvider, s => s)

  const TestComponent: React.FC = () => {
    const [add, setAdd] = React.useState(1)
    const value = useAppState(s => s.value + add, { deps: [add] })
    const value2 = useAppState(s => s.value + add * 2, { deps: [add] })

    return (
      <button className="btn" onClick={() => setAdd(add + 1)}>
        {add}-{value}-{value2}
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
    `"<button class=\\"btn\\">1-2-3</button>"`
  )

  act(() => {
    const btn = component.find(".btn")
    btn.simulate("click")
  })

  setTimeout(() => {
    expect(component.html()).toMatchInlineSnapshot(
      `"<button class=\\"btn\\">2-3-5</button>"`
    )
    done()
  }, 0)
})

it("should be able to use a custom comparator", done => {
  const state = { todos: [1] }
  const store = createStore({ state })
  const AppStoreProvider = createProvider(store)
  const useAppState = createStateHook(AppStoreProvider)
  const uesNextAppState = createNextHook(AppStoreProvider)

  const TestComponent: React.FC = () => {
    // We use a comparator, that always returns true, so we never will get an update
    const todos = useAppState(s => s.todos, { compare: () => true })
    const nextTodos = uesNextAppState(s => s.todos)

    return (
      <div>
        <div>{JSON.stringify(todos)}</div>
        <button
          className="btn"
          onClick={() => nextTodos(todos => todos.push(1))}
        />
      </div>
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

  const html1 = component.html()

  act(() => {
    const btn = component.find(".btn")
    btn.simulate("click")
  })

  setTimeout(() => {
    const html2 = component.html()
    expect(html1).toEqual(html2)
    done()
  }, 0)
})
