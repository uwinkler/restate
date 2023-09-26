// Background page -- background.js
console.log('Background')

var devToolConnections = new Map()
var reverseMap = new Map()

chrome.runtime.onConnect.addListener(function (devToolsConnection) {
  // assign the listener function to a variable so we can remove it later
  var devToolsListener = function (message, sender, sendResponse) {
    console.log('message from devTools:', message)

    // Inject a content script into the identified tab
    if (message.type === 'inject') {
      chrome.scripting.executeScript({
        target: { tabId: message.tabId },
        files: [message.scriptToInject]
      })

      devToolConnections.set(message.tabId, devToolsConnection)
      reverseMap.set(devToolsConnection, message.tabId)
    } else {
      // send other messages to the content.js
      console.log('Sending message to content.js', message)
      const tabId = reverseMap.get(devToolConnections)
      chrome.tabs.sendMessage(tabId, message)
    }
  }

  // add the listener
  devToolsConnection.onMessage.addListener(devToolsListener)

  devToolsConnection.onDisconnect.addListener(function () {
    console.log('onDisconnect')
    devToolsConnection.onMessage.removeListener(devToolsListener)
    let tabId = reverseMap.get(devToolsConnection)
    if (tabId) {
      devToolConnections.delete(tabId)
    }
    reverseMap.delete(devToolsConnection)
  })
})

// Receive message from content script and relay to the devTools page for the
// current tab
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // Messages from content scripts should have sender.tab set
  if (sender.tab) {
    var tabId = sender.tab.id
    const devToolsConnection = devToolConnections.get(tabId)
    if (devToolsConnection) {
      devToolsConnection.postMessage(request)
    } else {
      console.log('Tab not found in connection list.')
    }
  } else {
    console.log('sender.tab not defined.')
  }
  return true
})
