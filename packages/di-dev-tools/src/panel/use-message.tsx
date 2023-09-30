import { MessageDevTools, messageDevTools } from '../utils'

export function useMessage() {
  function postMessage<T>(msg: Partial<MessageDevTools<T>>) {
    const backgroundPageConnection = chrome.runtime.connect({ name: 'restate' })

    backgroundPageConnection.postMessage(
      messageDevTools({
        ...msg,
        tabId: chrome.devtools.inspectedWindow.tabId
      })
    )
  }

  return { postMessage }
}
