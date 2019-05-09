import { createStore } from '../create-store'
import { immerable } from 'immer'
import { connectMessageBus } from '../connect-message-bus'
import { Message, INIT_MESSAGAE } from '../rx-store'

it('should be able to set a next state', () => {
  const orgState = { a: 1 }

  const store = createStore({ state: orgState })
  store.next(s => {
    s.a = 2
  })

  const nextStaet = store.state

  expect(orgState).toEqual({ a: 1 })
  expect(nextStaet).toEqual({ a: 2 })
  expect(Object.isFrozen(store.state)).toBe(true)
})

it('should be able to use non-plain objects (immer style)', () => {
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

it('should be able to use sub-stores: upstream updates', () => {
  const orgState = { a: 1, sub: { b: 2 } }

  const store = createStore({ state: orgState })
  const subscriberStore = jest.fn()
  store.state$.subscribe(subscriberStore)
  expect(subscriberStore).toHaveBeenCalledTimes(1) // First subscribtion

  const subStore = store.subStore(s => s.sub)
  const subscriberSubStore = jest.fn()
  store.state$.subscribe(subscriberSubStore)
  expect(subscriberSubStore).toHaveBeenCalledTimes(1) // First subscribtion

  //
  // New state
  //
  subStore.next(subState => {
    subState.b = 3
  })

  expect(store.state).toEqual({
    a: 1,
    sub: { b: 3 },
  })
  expect(subscriberStore).toHaveBeenCalledTimes(2)

  expect(subStore.state).toEqual({ b: 3 })
  expect(subscriberSubStore).toHaveBeenCalledTimes(2)
})

it('should be able to use sub-stores: upstream updates', () => {
  const orgState = { a: 1, sub: { b: 2 } }

  const store = createStore({ state: orgState })
  const subStore = store.subStore(s => s.sub)

  store.next(s => {
    s.sub.b = 3
  })

  expect(subStore.state).toEqual({ b: 3 })
  expect(store.state).toEqual({
    a: 1,
    sub: { b: 3 },
  })
})

it('substore should NOT be notified, if we change a value outside of the sub-stores realm', () => {
  const orgState = { a: 1, sub: { b: 2 } }

  const store = createStore({ state: orgState })
  const subStore = store.subStore(s => s.sub)

  // SubState
  const subscriberSubStateMock = jest.fn()
  subStore.state$.subscribe(subscriberSubStateMock)
  expect(subscriberSubStateMock).toHaveBeenCalledTimes(1) // inital subscription

  // Meta
  const subscriberSubMetaMock = jest.fn()
  subStore.meta$.subscribe(subscriberSubMetaMock)
  expect(subscriberSubMetaMock).toHaveBeenCalledTimes(1) // inital subscription

  // Next state
  store.next(s => {
    s.a = 2
  })

  expect(subscriberSubStateMock).toHaveBeenCalledTimes(1) // still have been called only once
  expect(subscriberSubMetaMock).toHaveBeenCalledTimes(1) // still have been called only once
})

it('messages should be shared by the the parent store and sub-stores', () => {
  const orgState = { a: 1, sub: { b: 2 } }
  const rootStore = createStore({ state: orgState })
  const subStore = rootStore.subStore(s => s.sub)

  const rootStoreListener = jest.fn()
  connectMessageBus(rootStore, rootStoreListener)
  expect(rootStoreListener).toBeCalledWith({ message: INIT_MESSAGAE, store: rootStore })

  const subStoreListener = jest.fn()
  connectMessageBus(subStore, subStoreListener)
  expect(subStoreListener).toBeCalledWith({ message: INIT_MESSAGAE, store: subStore })

  const messageRoot: Message = { type: 'TEST_FROM_ROOT' }
  rootStore.dispatch(messageRoot)

  expect(rootStoreListener).toHaveBeenCalledWith({ message: messageRoot, store: rootStore })
  expect(subStoreListener).toHaveBeenCalledWith({ message: messageRoot, store: subStore })

  const messageSubStore: Message = { type: 'TEST_SUB_STORE' }
  subStore.dispatch(messageSubStore)

  expect(rootStoreListener).toHaveBeenCalledWith({ message: messageSubStore, store: rootStore })
  expect(subStoreListener).toHaveBeenCalledWith({ message: messageSubStore, store: subStore })
})

export default {}
