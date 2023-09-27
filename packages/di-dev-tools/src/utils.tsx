export type MessageContent<T> = {
  source: 'restate-di-content'
  payload: T
}

export type MessageDevTools<T> = {
  source: 'restate-di-devtools'
  tabId: number
  payload: T
}

export type Message<T> = MessageContent<T> | MessageDevTools<T>

export function messageDevTools<T>(payload: T): MessageDevTools<T> {
  const tabId = chrome.devtools.inspectedWindow.tabId
  return { source: 'restate-di-devtools', payload, tabId }
}

export function messageContent<T>(payload: T): MessageContent<T> {
  return { source: 'restate-di-content', payload }
}

export function isMessageDevTools<T>(msg: any): msg is MessageDevTools<T> {
  return msg.source === 'restate-di-devtools'
}

export function isMessageContent<T>(msg: any): msg is MessageContent<T> {
  return msg.source === 'restate-di-content'
}
