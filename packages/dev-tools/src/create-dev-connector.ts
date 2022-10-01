import { RxStore } from '@restate/core'
import produce from 'immer'
import { BehaviorSubject, Observable, Subscription } from 'rxjs'

type Disconnect = () => void
type Service = {
  ctxObservable$: Observable<any>
  displayName: string
  (): any
}

export function createDevConnector(devToolName: string) {
  const devToolsExtension = (window as any).__REDUX_DEVTOOLS_EXTENSION__

  if (!devToolsExtension) {
    console.warn('DevTools are not installed.')

    // mock function
    return {
      connectDev: () => {},
      disconnect: () => {}
    }
  }

  const state$ = new BehaviorSubject<any>({})
  const subs: Subscription[] = []

  const devTools = devToolsExtension.connect({
    name: devToolName,
    trace: false,
    features: {
      dispatch: false,
      test: false,
      trace: false,
      reorder: false,
      skip: false,
      jump: false
    }
  })

  devTools.subscribe((msg: any) => {
    console.log(msg)
  })

  function connectStore(name: string, store: RxStore<any, any>) {
    const storeSub = store.state$.subscribe((pack) => {
      const nextState = produce(state$.value, (s: any) => {
        s[name] = pack.state
      })
      state$.next(nextState)
      const { message } = pack
      if (message.type.indexOf('@RX_DEV_TOOLS') === -1) {
        devTools.send(
          {
            type: name + '@state$',
            payload: pack
          },
          state$.value
        )
      }
    })

    const messageBusSub = store.messageBus$.subscribe((msg) => {
      devTools.send({ type: name + '@messageBus$', payload: msg }, state$.value)
    })

    subs.push(storeSub, messageBusSub)

    return () => {
      storeSub.unsubscribe()
      messageBusSub.unsubscribe()
    }
  }

  function connectService(mount: string, service: Service) {
    const sub = service.ctxObservable$.subscribe((msg) => {
      const nextState = produce(state$.value, (s: any) => {
        s[mount] = msg
      })

      state$.next(nextState)

      devTools.send(
        {
          type: service.displayName,
          payload: msg
        },
        nextState
      )
    })
    subs.push(sub)

    return () => sub.unsubscribe()
  }

  function connectObservable(mount: string, observable: Observable<any>) {
    const sub = observable.subscribe((msg: any) => {
      const nextState = produce(state$.value, (s: any) => {
        s[mount] = msg
      })
      state$.next(nextState)

      devTools.send(
        {
          type: mount,
          payload: msg
        },
        nextState
      )
    })
    subs.push(sub)

    return () => sub.unsubscribe()
  }

  function connectDev(
    mount: string,
    source: RxStore<any, any> | Service | Observable<any>
  ): Disconnect {
    if (isRxStore(source)) {
      return connectStore(mount, source)
    }
    if (isService(source)) {
      return connectService(mount, source)
    }
    if (isObservable(source)) {
      return connectObservable(mount, source)
    }
    console.warn('Do not know how to observe ' + mount)
    return () => {}
  }

  function disconnect() {
    devToolsExtension.disconnect()
    subs.forEach((sub) => sub.unsubscribe())
  }

  return { connectDev, disconnect }
}

function isRxStore(obj: any): obj is RxStore<any, any> {
  return obj && obj.state$ !== undefined
}

function isService(obj: any): obj is Service {
  return obj && typeof obj === 'function' && obj.ctxObservable$ !== undefined
}

function isObservable(obj: any): obj is Observable<any> {
  return obj && obj.subscribe
}
