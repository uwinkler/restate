export type SubscriptionHandler = <T>(v: T) => void

export type Observable = ReturnType<typeof createObservable>

export function createObservable<T>() {
  let _subscriptions: SubscriptionHandler[] = []
  let _value: T = null as any

  function subscribe(sub: SubscriptionHandler) {
    if (!_subscriptions.includes(sub)) {
      _subscriptions.push(sub)
    }

    // Cleanup function
    return () => {
      _subscriptions = _subscriptions.filter((s) => s !== sub)
    }
  }

  function next(nextValue: T) {
    _value = nextValue
    setTimeout(() => _subscriptions.forEach((sub) => sub(nextValue), 0))
  }

  function value() {
    return _value
  }

  return { subscribe, next, value }
}
