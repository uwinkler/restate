import React from 'react'
import { messageDevTools } from '../utils'

export function useMessage() {
  const backgroundPageConnection = React.useMemo(
    () =>
      chrome.runtime.connect({
        name: 'restate'
      }),
    []
  )

  function postMessage(msg: any) {
    backgroundPageConnection.postMessage(
      messageDevTools({
        hello: 'from panel.js',
        tabId: chrome.devtools.inspectedWindow.tabId
      })
    )
  }

  return { postMessage }
}
