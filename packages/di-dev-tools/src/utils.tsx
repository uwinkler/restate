export type MessageDevToolsType = 'get-all-store-updates'

export type MessageContentType =
  | 'get-all-store-updates-response'
  | 'store-update'

export type MessageContent<T> = {
  source: 'restate-di-content'
  tabId: number
  type: MessageContentType
  payload: T
}

export type MessageDevTools<T> = {
  source: 'restate-di-devtools'
  type: MessageDevToolsType
  tabId: number
  payload: T
}

export type Message<T> = MessageContent<T> | MessageDevTools<T>

export function messageDevTools<T>(
  msg: Partial<MessageDevTools<T>>
): MessageDevTools<T> {
  const tabId = chrome.devtools.inspectedWindow.tabId
  return {
    source: 'restate-di-devtools',
    tabId,
    type: '' as any,
    payload: {} as T,
    ...msg
  }
}

export function messageContent<T>(
  msg: Partial<MessageContent<T>>
): MessageContent<T> {
  return {
    source: 'restate-di-content',
    type: '' as any,
    payload: {} as T,
    tabId: -1, // tab id is set by the content script
    ...msg
  }
}

export function isMessageDevTools<T>(msg: any): msg is MessageDevTools<T> {
  return msg.source === 'restate-di-devtools'
}

export function isMessageContent<T>(msg: any): msg is MessageContent<T> {
  return msg.source === 'restate-di-content'
}
