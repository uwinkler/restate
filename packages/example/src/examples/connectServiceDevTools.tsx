import { MessageContent, isMessageDevTools } from '@restate/di-commons'
import { BehaviorSubject } from 'rxjs'
import { distinctUntilChanged } from 'rxjs/operators'

type CleanupFunction = () => void

export function connectServiceDevTools(): CleanupFunction {
  const updates: any[] = []

  const sub = getObservable()
    .pipe(
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
    )
    .subscribe((m) => {
      const id = crypto.randomUUID()
      const update = { result: m, timestamp: Date.now(), id }
      updates.push(update)
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
