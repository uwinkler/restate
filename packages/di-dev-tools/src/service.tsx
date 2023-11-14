import React from 'react'
import ReactDOM from 'react-dom/client'
import { Service } from './services/service'
import { messageDevTools } from './utils'

var backgroundPageConnection = chrome.runtime.connect({
  name: 'restate'
})

backgroundPageConnection.onMessage.addListener(function (message) {
  console.log('services.js message received:', message)
})

backgroundPageConnection.postMessage(
  messageDevTools({
    type: 'get-all-service-updates'
  })
)

ReactDOM.createRoot(document.getElementById('app')!).render(<Service />)
