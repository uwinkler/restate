// Background page -- background.js

import { messageContent } from './utils'

const devToolConnections = new Map()
const reverseMap = new Map()

const messages: any[] = []

chrome.runtime.onConnect.addListener(function (devToolsConnection) {
  // assign the listener function to a variable so we can remove it later
  const devToolsListener = function (
    message: any,
    _sender: any,
    _sendResponse: any
  ) {
    console.log('message from devTools to content script:', message)
    devToolConnections.set(message.tabId, devToolsConnection)
    reverseMap.set(devToolsConnection, message.tabId)
    chrome.tabs.sendMessage(message.tabId, message)
  }

  // add the listener
  devToolsConnection.onMessage.addListener(devToolsListener as any)

  devToolsConnection.onDisconnect.addListener(function () {
    console.log('onDisconnect')
    devToolsConnection.onMessage.removeListener(devToolsListener as any)
    let tabId = reverseMap.get(devToolsConnection)
    if (tabId) {
      devToolConnections.delete(tabId)
    }
    reverseMap.delete(devToolsConnection)
  })
})

// Receive message from content script and relay to the devTools page for the
// current tab
chrome.runtime.onMessage.addListener(function (request, sender, _sendResponse) {
  // Messages from content scripts should have sender.tab set
  console.log('background: from content script', request)
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
})
