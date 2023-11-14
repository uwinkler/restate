import { RestateStore } from '@restate/core'
import { MessageContent, isMessageContent } from '@restate/di-commons'
import type { State } from './state'

export function contentMessageHandler(store: RestateStore<State>) {
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
        s.updates.push({
          id: crypto.randomUUID(),
          store: msg.payload.store,
          ...msg.payload.update
        })
      })
    }

    if (canHandle(msg) && msg.type === 'get-all-store-updates-response') {
      const storeName = msg.payload.store
      const storeId = msg.payload.storeId

      const nextStores = msg.payload.updates.map((update: any) => ({
        id: crypto.randomUUID(),
        patches: [],
        inversePatches: [],
        ...update,
        store: storeName
      }))

      store.next((s) => {
        const nextUpdates = s.updates.filter(
          (update) => update.storeId !== storeId
        )
        nextUpdates.push(...nextStores)
        nextUpdates.sort((a, b) => a.timestamp - b.timestamp)

        s.updates = nextUpdates
      })
    }
  })
}

function canHandle(msg: any): msg is MessageContent<any> {
  return msg && isMessageContent(msg)
}
