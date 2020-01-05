import { createStore } from "../create-store"
import { immerable } from "immer"
import { Middleware } from "../rx-store"
import { Message } from "../message"

it("should be able to set a next state", () => {
  const orgState = { a: 1 }

  const store = createStore({ state: orgState })

  store.next(s => {
    s.a = 2
  })

  const nextState = store.state

  expect(orgState).toEqual({ a: 1 })
  expect(nextState).toEqual({ a: 2 })
  expect(Object.isFrozen(store.state)).toBe(true)
})

it("should be able to use non-plain objects (immer style)", () => {
  class State {
    [immerable] = true
    a = 1
    aPlusOne() {
      return this.a + 1
    }
  }
  const state = new State()

  const store = createStore({ state })

  store.next(s => {
    s.a = 2
  })

  const nextState = store.state

  expect(state.a).toBe(1)
  expect(state.aPlusOne()).toEqual(2)
  expect(nextState.a).toBe(2)
  expect(nextState.aPlusOne()).toEqual(3)
})

it("should use middleware", () => {
  interface State {
    a: number
  }
  const store = createStore<State, Message>({
    state: {
      a: 1
    }
  })

  const plusOne: Middleware<State, Message> = ({ nextState }) => {
    nextState.a = nextState.a + 1
  }

  store.middleware.push(plusOne)

  store.next(s => {
    s.a = 2
  })

  expect(store.state.a).toEqual(3)
})

it("should use multiple middleware", () => {
  interface State {
    a: number
  }
  const store = createStore<State, Message>({
    state: {
      a: 1
    }
  })

  const plusOne: Middleware<State, Message> = ({ nextState }) => {
    nextState.a = nextState.a + 1
  }

  store.middleware.push(plusOne, plusOne)

  store.next(s => {
    s.a = 2
  })

  expect(store.state.a).toEqual(4)
})

it("should be able to throw within a middleware function", () => {
  interface State {
    a: number
  }

  const store = createStore<State, Message>({
    state: {
      a: 1
    }
  })

  const errorMiddleware: Middleware<State, Message> = () => {
    throw Error("error!")
  }

  store.middleware.push(errorMiddleware)

  store.next(s => {
    s.a = 2
  })

  expect(store.state.a).toEqual(1) // no update
})

it("should return default options", () => {
  const store = createStore({
    state: { value: 1 }
  })

  expect(store.options.freeze).toBeTruthy()
  expect(store.options.storeName).toEqual("STORE")
})

it("should return options", () => {
  const store = createStore({
    state: { value: 1 },
    options: { freeze: true, storeName: "TEST" }
  })

  expect(store.options.freeze).toBeTruthy()
  expect(store.options.storeName).toEqual("TEST")
})

it("freeze: should freeze the state if the freeze options is set to true", () => {
  const store = createStore({
    state: { value: 1 },
    options: { freeze: true }
  })

  store.next(s => {
    s.value = 2
  })

  function shouldThrow() {
    const state = store.state as any
    state.value = 3
  }
  expect(shouldThrow).toThrow()
})

it("freeze: should not freeze the state if the freeze options is set to false", () => {
  const store = createStore({
    state: { value: 1 },
    options: { freeze: false }
  })

  store.next(s => {
    s.value = 2
  })

  function shouldNotThrow() {
    const state = store.state as any
    state.value = 3
  }
  expect(shouldNotThrow).not.toThrow()
})

it("should be able to set the state as object, not using immer's imperative way", () => {
  const store = createStore({
    state: { value: 1 }
  })
  store.next({ value: 12 })

  expect(store.state).toEqual({ value: 12 })
})

it("should be able to set the state as object, not using immer's imperative way", () => {
  const store = createStore({
    state: { value: 1 }
  })

  store.next({ value: 12 })

  expect(store.state).toEqual({ value: 12 })
})

it("should be able to update the store using spread", () => {
  const store = createStore({
    state: { value: 1 }
  })

  store.next(state => ({ ...state, value: 12 }))
  expect(store.state).toEqual({ value: 12 })
})
