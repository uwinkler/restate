// const port = chrome.runtime.connect({
//   name: `${chrome.devtools.inspectedWindow.tabId}`
// })

// port.onMessage.addListener((msg) => {
//   // This prints in devtools-on-devtools: https://stackoverflow.com/q/12291138
//   // To print in tab's console see `chrome.devtools.inspectedWindow.eval`
//   console.log(msg)
// })
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Panel } from './panel/Panel'
import { messageDevTools } from './utils'

var backgroundPageConnection = chrome.runtime.connect({
  name: 'restate'
})

backgroundPageConnection.onMessage.addListener(function (message) {
  console.log('panel.js message received:', message)
})

backgroundPageConnection.postMessage(
  messageDevTools({
    type: 'get-all-store-updates',
  })
)

ReactDOM.createRoot(document.getElementById('app')!).render(<Panel />)
