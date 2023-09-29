import { isMessageDevTools } from './utils'

console.log('content script')

let tabId = -1

window.addEventListener('message', function (event) {
  // Only accept messages from the same frame
  if (event.source !== window) {
    return
  }

  if (!event.data || event.data.source !== 'restate-di-content') {
    return
  }

  var msg = { ...event.data, tabId }

  if (chrome.runtime?.id) {
    console.log('content.js: Sending message to dev-tools:', msg)
    chrome.runtime.sendMessage(msg)
  } else {
    console.log('content.js: Context invalidated')
  }
})

chrome.runtime.onMessage.addListener(function (msg, _sender) {
  if (msg && isMessageDevTools(msg)) {
    tabId = msg.tabId
    console.log('content.js: message from chrome dev tools:', msg)
    window.postMessage(msg)
  }
})
