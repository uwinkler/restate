import { RxStore, Message } from "./rx-store"
import { Subscription } from "rxjs"

/**
 * Usage:
 *
 *
 */

export type MessagesListener<S> = (props: {
  message: Message
  store: RxStore<S>
}) => void

//
// Definition
//
export function connectMessageBus<S>(
  store: RxStore<S>
): (listener: MessagesListener<S>) => Subscription
export function connectMessageBus<S>(
  store: RxStore<S>,
  listener: MessagesListener<S>
): Subscription

//
// Implementation
//
export function connectMessageBus<S>(
  store: RxStore<S>,
  listener?: MessagesListener<S>
) {
  const subscribeListenerToMessageBus = (
    store: RxStore<S>,
    listener: MessagesListener<S>
  ) => store.messageBus$.subscribe(message => listener({ message, store }))

  if (listener == null) {
    return function(listener: MessagesListener<S>) {
      return subscribeListenerToMessageBus(store, listener)
    }
  } else {
    return subscribeListenerToMessageBus(store, listener)
  }
}
