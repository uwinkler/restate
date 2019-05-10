import { RxStore, Message } from './rx-store'
import { Subscription } from 'rxjs'

/**
 * Usage:
 *
 *
 */

export type MessagebusListener<S> = (props: { message: Message; store: RxStore<S> }) => void

export function connectMessageBus<S>(store: RxStore<S>): (listener: MessagebusListener<S>) => Subscription
export function connectMessageBus<S>(store: RxStore<S>, listener: MessagebusListener<S>): Subscription
export function connectMessageBus<S>(store: RxStore<S>, listener?: MessagebusListener<S>) {
  const subscribeListenerToMessageBus = (store: RxStore<S>, listener: MessagebusListener<S>) =>
    store.messageBus$.subscribe(message => listener({ message, store }))

  if (listener == null) {
    return function(listener: MessagebusListener<S>) {
      return subscribeListenerToMessageBus(store, listener)
    }
  } else {
    return subscribeListenerToMessageBus(store, listener)
  }
}
