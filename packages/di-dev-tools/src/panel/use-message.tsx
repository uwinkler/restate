import React from 'react'
import { MessageDevTools, messageDevTools } from '../utils'

export function useMessage() {
  const backgroundPageConnection = React.useMemo(
    () =>
      chrome.runtime.connect({
        name: 'restate'
      }),
    []
  )

  function postMessage<T>(msg: Partial<MessageDevTools<T>>) {
    backgroundPageConnection.postMessage(
      messageDevTools({
        ...msg,
        tabId: chrome.devtools.inspectedWindow.tabId
      })
    )
  }

  return { postMessage }
}
