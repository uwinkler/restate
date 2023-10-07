import type { MessageContent, MessageDevTools } from '@restate/di-commons'

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
    ...msg
  }
}
