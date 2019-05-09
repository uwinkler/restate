import { connectMessageBus, MessagebusListener } from '../connect-message-bus'
import { createStore } from '../create-store'
import { Message, INIT_MESSAGAE } from '../index'

it('should be able to create a message bus connector listener', () => {
  const state = { a: 1, sub: { b: 1 } }
  const store = createStore({ state })

  const handlerMock = jest.fn()

  const listener: MessagebusListener<typeof state> = ({ message, store }) => handlerMock(message, store)

  connectMessageBus(store, listener)

  const message: Message = { type: 'TEST_MESSAGE', payload: 'PAYLOAD' }
  store.dispatch(message)

  expect(handlerMock).toHaveBeenLastCalledWith(message, store)
})

it('should be able to create a message bus listener (curried version)', () => {
  const state = { a: 1, sub: { b: 1 } }
  const store = createStore({ state })

  const handlerMock = jest.fn()

  const listener: MessagebusListener<typeof state> = ({ message, store }) => handlerMock(message, store)

  const conenctAppStoreMessageBus = connectMessageBus(store)
  conenctAppStoreMessageBus(listener)

  const message: Message = { type: 'TEST_MESSAGE', payload: 'PAYLOAD' }
  store.dispatch(message)

  expect(handlerMock).toHaveBeenCalledTimes(2)
  expect(handlerMock).toHaveBeenCalledWith(INIT_MESSAGAE, store)
  expect(handlerMock).toHaveBeenLastCalledWith(message, store)
})

it('should be able to create a message bus listener using a  a sub store', () => {
  const state = { a: 1, sub: { b: 1 } }
  const store = createStore({ state })

  const subStore = store.subStore(s => s.sub)
  const subStoreMessageHandlerMock = jest.fn()

  const listener: MessagebusListener<{ b: number }> = ({ message, store }) => subStoreMessageHandlerMock(message, store)

  const conenctAppStoreMessageBus = connectMessageBus(subStore)
  conenctAppStoreMessageBus(listener)

  const message: Message = { type: 'TEST_MESSAGE', payload: 'PAYLOAD' }
  store.dispatch(message)

  expect(subStoreMessageHandlerMock).toHaveBeenCalledWith(INIT_MESSAGAE, subStore)
  expect(subStoreMessageHandlerMock).toHaveBeenLastCalledWith(message, subStore)
  expect(subStoreMessageHandlerMock).toHaveBeenCalledTimes(2)
})

export default {}
