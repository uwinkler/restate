import { createStore } from "../create-store"
import { immerable } from "immer"

it("should create a simple store", () => {
  const state = { a: 1 }
  const store = createStore({ state })
  expect(store.state).not.toBe(state) // Object.is equality - should not be the same object
  expect(store.state).toEqual(state) // but state should look equal
})

it("should be able to set a next state", () => {
  const orgState = { a: 1 }

  const store = createStore({ state: orgState })
  store.next(s => {
    s.a = 2
  })

  const nextStaet = store.state

  expect(orgState).toEqual({ a: 1 })
  expect(nextStaet).toEqual({ a: 2 })
})

it("should be able to freeze non-plain objects", () => {
  class State {
    [immerable] = true
    a = 1
  }
  const state = new State()

  const store = createStore({ state })

  store.next(s => {
    s.a = 2
  })

  const nextState = store.state

  expect(state.a).toBe(1)
  expect(nextState.a).toBe(2)
})

it("state should be alter after calling next", () => {
  const state = { a: 1 }
  const store = createStore({ state })
  store.next(s => {
    s.a = 2
  })
  expect(store.state.a).toBe(2)
  expect(Object.isFrozen(store.state)).toBe(true)
})

it("state should not be mutated", () => {
  const state = { a: 1 }
  const store = createStore({ state })
  expect(store.state.a).toBe(1)
  // expect(Object.isFrozen(store.state)).toBe(true)
})

export default {}
