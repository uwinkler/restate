import {
  MessageContent,
  ServiceUpdateMessage,
  ServiceUpdatePayload,
  isMessageDevTools
} from '@restate/di-commons'
import { BehaviorSubject } from 'rxjs'
import { distinctUntilChanged } from 'rxjs/operators'

type CleanupFunction = () => void

function connectServiceDevTools(): CleanupFunction {
  const updates: ServiceUpdatePayload[] = []

  const sub = getObservable()
    .pipe(
      distinctUntilChanged(
        (a, b) =>
          JSON.stringify(deepCleanObject(a)) ===
          JSON.stringify(deepCleanObject(b))
      )
    )
    .subscribe((m) => {
      const id = crypto.randomUUID()
      const payload: ServiceUpdatePayload = { ...m, timestamp: Date.now(), id }
      updates.push(payload)

      if (updates.length > 3) {
        reset(updates[3])
      }

      postMessage({
        type: 'service-update',
        source: 'restate-di-content',
        payload: deepCleanObject(payload)
      })
    })

  window.addEventListener('message', (msg) => {
    if (!isMessageDevTools(msg)) {
      return
    }

    const type = msg.data.type
    if (type === 'get-all-services-updates') {
      postMessage({
        type: 'get-all-services-updates-response',
        source: 'restate-di-content',
        payload: {
          updates
        }
      })
    }
  })

  return () => {
    sub.unsubscribe()
  }
}

function getObservable() {
  if (!(window as any).__RESTATE_SERVICE_REGISTRY__) {
    ;(window as any).__RESTATE_SERVICE_REGISTRY__ = new BehaviorSubject({
      name: 'init',
      value: {}
    })
  }
  return (window as any).__RESTATE_SERVICE_REGISTRY__ as BehaviorSubject<any>
}

function postMessage<T>(msg: MessageContent<T>) {
  window.postMessage(msg)
}

function reset(msg: ServiceUpdatePayload) {
  console.log('reset', msg)
  window.dispatchEvent(new CustomEvent('restate-di-reset', { msg } as any))
}

function deepCleanObject(obj: any) {
  const newObj: any = {}
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      newObj[key] = deepCleanObject(obj[key])
    } else if (typeof obj[key] === 'function') {
      // newObj[key] = obj[key].name
    } else if (typeof obj[key] !== 'function') {
      newObj[key] = obj[key]
    }
  }
  return newObj
}

// A function that clones an object with all functions
function deepClone(obj: any) {}
export { connectServiceDevTools }
