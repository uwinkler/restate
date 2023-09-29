import { RxStore } from '@restate/core'
import { MessageContent, isMessageContent } from '../utils'
import type { State } from './state'

export function contentMessageHandler(store: RxStore<State>) {
  console.log('contentMessageHandler')

  chrome.runtime.onMessage.addListener(function (msg, sender) {
    console.log('contentMessageHandler', msg)
    if (
      msg &&
      canHandle(msg) &&
      msg.type === 'store-update' &&
      sender.tab?.id === chrome.devtools.inspectedWindow.tabId
    ) {
      store.next((s) => {
        s.stores.push(msg.payload)
      })
    }

    console.log(msg)

    if (canHandle(msg) && msg.type === 'get-all-store-updates-response') {
      const storeName = msg.payload.store
      const nextStores = msg.payload.updates.map((update: any) => ({
        ...update,
        store: storeName
      }))
      store.next((s) => {
        s.stores = nextStores
      })
    }
  })
}

function canHandle(msg: any): msg is MessageContent<any> {
  return msg && isMessageContent(msg)
}
