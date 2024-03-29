console.log('devtools')

var backgroundPageConnection = chrome.runtime.connect({
  name: 'restate'
})

backgroundPageConnection.onMessage.addListener(function (message) {
  console.log('devtool.js message received:', message)
})

backgroundPageConnection.postMessage({
  type: 'inject',
  tabId: chrome.devtools.inspectedWindow.tabId,
  scriptToInject: 'injected-content.js'
})

chrome.devtools.panels.create(
  'Restate',
  'assets/icon16.png',
  'panel.html',
  () => console.log('user switched to restate panel')
)

chrome.devtools.panels.create(
  'service',
  'assets/icon16.png',
  'service.html',
  () => console.log('user switched to scenario panel')
)
