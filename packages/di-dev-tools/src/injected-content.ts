import { messageContent } from './utils'

function injectedContent() {
  console.log('Injected content script')

  window.postMessage(
    messageContent({
      greeting: 'hello from injected content script!'
    }),
    '*'
  )
}

injectedContent()
