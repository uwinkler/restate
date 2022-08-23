import { RxStore } from '@restate/core'

export function connectDevTools(store: RxStore<any, any>): () => void {
  const devToolsExtension = (window as any).__REDUX_DEVTOOLS_EXTENSION__

  if (!devToolsExtension) {
    console.warn('DevTools are not installed. For information see https://react-rx-state.netlify.com/dev-tools')

    // mock cleanup function
    return () => {}
  }

  const devTools = devToolsExtension.connect({
    name: store.options.storeName,
    trace: false,
    features: { dispatch: false, test: false, trace: false }
  })

  devTools.subscribe((msg: any) => {
    if (
      msg.type === 'DISPATCH' &&
      msg.state &&
      msg.payload &&
      (msg.payload.type === 'JUMP_TO_ACTION' || msg.payload.type === 'JUMP_TO_STATE' || msg.payload.type === 'ROLLBACK')
    ) {
      // console.log("DevTools requested to change the state to:", msg.state)
      store.next(JSON.parse(msg.state), {
        type: '@RX_DEV_TOOLS/' + msg.payload.type
      })
    }
  })

  devTools.init(store.state)

  const storeSub = store.state$.subscribe((pack) => {
    const { state, message, patches } = pack
    if (message.type.indexOf('@RX_DEV_TOOLS') === -1) {
      devTools.send({ type: message.type, payload: { patches } }, state)
    }
  })

  const messageBusSub = store.messageBus$.subscribe((msg) => {
    devTools.send({ ...msg, channel: 'messageBus' }, store.state)
  })

  const cleanup = () => {
    storeSub.unsubscribe()
    messageBusSub.unsubscribe()
    devToolsExtension.disconnect()
  }

  return cleanup
}
