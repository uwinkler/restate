import { RxStore, StatePackage } from '@restate/core'

type CleanupFunction = () => void

export function connectDevTools<STATE, TRACE = any>(
  store: RxStore<STATE, TRACE>
): CleanupFunction {
  const updates: StatePackage<STATE, TRACE>[] = []

  window.addEventListener('message', (msg) => {
    if (!isMessageDevTools(msg)) {
      return
    }

    const type = msg.data.type
    if (type === 'get-all-store-updates') {
      window.postMessage({
        type: 'get-all-store-updates-response',
        source: 'restate-di-content',
        payload: {
          store: store.options.storeName,
          updates
        }
      })
    }

    if (
      type === 'apply-state' &&
      msg.data.payload.store === store.options.storeName
    ) {
      const { nextState, trace = 'Update from devTools' } = msg.data.payload
      store.next(nextState, trace)
    }
  })

  const sub = store.state$.subscribe((s) => {
    const update = { ...s, timestamp: Date.now() }
    updates.push(update)
    window.postMessage({
      store: store.options.storeName,
      type: 'store-update',
      source: 'restate-di-content',
      payload: {
        store: store.options.storeName,
        update
      }
    })
  })

  return () => {
    sub.unsubscribe()
  }
}

export function isMessageDevTools(msg: any) {
  return msg?.data?.source === 'restate-di-devtools'
}
