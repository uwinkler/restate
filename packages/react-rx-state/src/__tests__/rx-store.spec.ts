import { createStore } from "../create-store"
import { immerable } from "immer"
import { Middleware } from "../rx-store"

it("should be able to set a next state", async () => {
  const orgState = { a: 1 }

  const store = createStore({ state: orgState })

  await store.next(s => {
    s.a = 2
  })

  const nextState = store.state

  expect(orgState).toEqual({ a: 1 })
  expect(nextState).toEqual({ a: 2 })
  expect(Object.isFrozen(store.state)).toBe(true)
})

it("should be able to use non-plain objects (immer style)", async () => {
  class State {
    [immerable] = true
    a = 1
    aPlusOne() {
      return this.a + 1
    }
  }
  const state = new State()

  const store = createStore({ state })

  await store.next(s => {
    s.a = 2
  })

  const nextState = store.state

  expect(state.a).toBe(1)
  expect(state.aPlusOne()).toEqual(2)
  expect(nextState.a).toBe(2)
  expect(nextState.aPlusOne()).toEqual(3)
})

it("should use middleware", async () => {
  interface State {
    a: number
  }
  const store = createStore<State>({
    state: {
      a: 1
    }
  })

  const plusOne: Middleware<State> = ({ state, next }) => {
    state.a = state.a + 1
    next()
  }

  store.middlewares.push(plusOne)

  await store.next(s => {
    s.a = 2
  })

  expect(store.state.a).toEqual(3)
})

it("should not call subsequent middlewares if next() is not called", async () => {
  interface State {
    a: number
  }
  const store = createStore<State>({
    state: {
      a: 1
    }
  })

  const doNotCallNext: Middleware<State> = () => {
    // Do not call next
  }

  const setToThree: Middleware<State> = ({ state, next }) => {
    state.a = 3
    next()
  }

  store.middlewares.push(doNotCallNext, setToThree)

  await store.next(s => {
    s.a = 2
  })

  expect(store.state.a).toEqual(2)
})

it("should not call subsequent middlewares if next() is not called", async () => {
  interface State {
    a: number
  }
  const store = createStore<State>({
    state: {
      a: 1
    }
  })

  const doNotCallNext: Middleware<State> = () => {
    // Do not call next
  }

  const setToThree: Middleware<State> = ({ state, next }) => {
    state.a = 3
    next()
  }

  store.middlewares.push(doNotCallNext, setToThree)

  await store.next(s => {
    s.a = 2
  })

  expect(store.state.a).toEqual(2)
})

it("should use multiple middleware", async () => {
  interface State {
    a: number
  }
  const store = createStore<State>({
    state: {
      a: 1
    }
  })

  const plusOne: Middleware<State> = ({ state, next }) => {
    state.a = state.a + 1
    next()
  }

  store.middlewares.push(plusOne, plusOne)

  await store.next(s => {
    s.a = 2
  })

  expect(store.state.a).toEqual(4)
})

it("should use async middleware", async () => {
  interface State {
    a: number
  }
  const store = createStore<State>({
    state: {
      a: 1
    }
  })

  const plusOne: Middleware<State> = ({ state, next }) => {
    return new Promise(resolve => {
      setTimeout(() => {
        state.a = state.a + 1
        next()
        resolve()
      }, 10)
    })
  }

  store.middlewares.push(plusOne)

  await store.next(s => {
    s.a = 2
  })

  expect(store.state.a).toEqual(3)
})

it("should be able to use middleware in reverse order", async () => {
  interface State {
    a: number
  }
  const store = createStore<State>({
    state: {
      a: 1
    }
  })

  const plusOne: Middleware<State> = ({ state, next }) => {
    state.a = state.a + 1
    next()
  }

  const logMiddleware: Middleware<State> = async ({ state, next }) => {
    const start = state.a
    await next()
    const end = state.a
    expect(start).toEqual(2) // first we get a 2
    expect(end).toEqual(3) // then plusOne should have been called
  }

  store.middlewares.push(logMiddleware, plusOne)

  await store.next(s => {
    s.a = 2
  })
})

it("should be able to throw", async () => {
  interface State {
    a: number
  }
  const store = createStore<State>({
    state: {
      a: 1
    }
  })

  const errorMiddleware: Middleware<State> = () => {
    throw Error("error!")
  }

  store.middlewares.push(errorMiddleware)

  await store.next(s => {
    s.a = 2
  })

  expect(store.state.a).toEqual(1) // no update
  expect(store.error$.value!.error).toBeDefined()
  expect(store.error$.value!.state).toEqual({
    a: 1
  })
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

it("freeze: should freeze the state if the freeze options is set to true", async () => {
  const store = createStore({
    state: { value: 1 },
    options: { freeze: true }
  })

  await store.next(s => {
    s.value = 2
  })

  function shouldThrow() {
    const state = store.state$.value as any
    state.value = 3
  }
  expect(shouldThrow).toThrow()
})

it("freeze: should not freeze the state if the freeze options is set to false", async () => {
  const store = createStore({
    state: { value: 1 },
    options: { freeze: false }
  })

  await store.next(s => {
    s.value = 2
  })

  function shouldNotThrow() {
    const state = store.state$.value as any
    state.value = 3
  }
  expect(shouldNotThrow).not.toThrow()
})
