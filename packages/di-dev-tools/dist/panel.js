// const port = chrome.runtime.connect({
//   name: `${chrome.devtools.inspectedWindow.tabId}`
// })

// port.onMessage.addListener((msg) => {
//   // This prints in devtools-on-devtools: https://stackoverflow.com/q/12291138
//   // To print in tab's console see `chrome.devtools.inspectedWindow.eval`
//   console.log(msg)
// })

console.log('panel.js')

var backgroundPageConnection = chrome.runtime.connect({
  name: 'restate'
})

backgroundPageConnection.onMessage.addListener(function (message) {
  console.log('panel.js message received:', message)
})

backgroundPageConnection.postMessage({ hello: 'from panel.js' })
