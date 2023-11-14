import React from 'react'
import ReactDOM from 'react-dom/client'
import { Panel } from './panel/panel'
import { messageDevTools } from './utils'

var backgroundPageConnection = chrome.runtime.connect({
  name: 'restate'
})

backgroundPageConnection.onMessage.addListener(function (message) {
  console.log('panel.js message received:', message)
})

backgroundPageConnection.postMessage(
  messageDevTools({
    type: 'get-all-store-updates'
  })
)

ReactDOM.createRoot(document.getElementById('app')!).render(<Panel />)
