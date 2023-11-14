import { RestateStore, StatePackage } from '@restate/core'
import { BehaviorSubject } from 'rxjs'

type CleanupFunction = () => void

export function connectDevTools<STATE extends Object, TRACE = any>(
  store: RestateStore<STATE, TRACE>
): CleanupFunction {
  const updates: StatePackage<STATE, TRACE>[] = []
  const storeId = crypto.randomUUID()

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
          storeId,
          store: store.options.storeName,
          updates
        }
      })
    }

    if (type === 'apply-state' && msg.data.payload.storeId === storeId) {
      const { nextState, trace = 'Update from devTools' } = msg.data.payload
      store.next(nextState, trace)
    }
  })

  const sub = store.state$.subscribe((s) => {
    const update = { ...s, timestamp: Date.now(), storeId }
    updates.push(update)
    window.postMessage({
      type: 'store-update',
      source: 'restate-di-content',
      payload: {
        storeId,
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
