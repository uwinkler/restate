import { isMessageContent, isMessageDevTools } from './utils'

console.log('content script')

const _window = window as any

if (!_window.__RESTATE_DEV_TOOLS__) {
  _window.__RESTATE_DEV__TOOLS = {}
}

window.addEventListener('message', function (event) {
  // Only accept messages from the same frame
  if (event.source !== window) {
    return
  }

  if (!isMessageContent(event.data)) {
    return
  }

  var message = event.data

  if (chrome.runtime?.id) {
    console.log('content.js: Sending message to dev-tools:', event.data)
    chrome.runtime.sendMessage(message)
  } else {
    console.log('content.js: Context invalidated')
  }
})

chrome.runtime.onMessage.addListener(function (request, _sender) {
  if (request && isMessageDevTools(request)) {
    console.log('content.js: message from chrome dev tools:', request)
    window.postMessage(request)
  }
})
