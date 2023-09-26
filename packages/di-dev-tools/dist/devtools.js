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

chrome.devtools.panels.create('Restate', 'icon16.png', 'panel.html', () => {
  console.log('user switched to this panel')
})
