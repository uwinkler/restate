console.log('content script')
window.addEventListener('message', function (event) {
  // Only accept messages from the same frame
  console.log(event)
  if (event.source !== window) {
    return
  }
  var message = event.data
  chrome.runtime.sendMessage(message)
})

chrome.runtime.onMessage.addListener(function (request, sender) {
  console.log('content.js: message from chrome dev tools:', request)
})
