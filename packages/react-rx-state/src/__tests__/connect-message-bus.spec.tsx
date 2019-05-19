import { connectMessageBus, MessagesListener } from "../connect-message-bus"
import { createStore } from "../create-store"
import { Message, INIT_MESSAGE } from "../index"

it("should be able to create a message bus connector listener", () => {
  const state = { a: 1, sub: { b: 1 } }
  const store = createStore({ state })

  const handlerMock = jest.fn()

  const listener: MessagesListener<typeof state> = ({ message, store }) =>
    handlerMock(message, store)

  connectMessageBus(store, listener)

  const message: Message = { type: "TEST_MESSAGE", payload: "PAYLOAD" }
  store.dispatch(message)

  expect(handlerMock).toHaveBeenLastCalledWith(message, store)
})

it("should be able to create a message bus listener (curried version)", () => {
  const state = { a: 1, sub: { b: 1 } }
  const store = createStore({ state })

  const handlerMock = jest.fn()

  const listener: MessagesListener<typeof state> = ({ message, store }) =>
    handlerMock(message, store)

  const conenctAppStoreMessageBus = connectMessageBus(store)
  conenctAppStoreMessageBus(listener)

  const message: Message = { type: "TEST_MESSAGE", payload: "PAYLOAD" }
  store.dispatch(message)

  expect(handlerMock).toHaveBeenCalledTimes(2)
  expect(handlerMock).toHaveBeenCalledWith(INIT_MESSAGE, store)
  expect(handlerMock).toHaveBeenLastCalledWith(message, store)
})

export default {}
