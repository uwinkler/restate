function injectedContent() {
  console.log('Injected content script')

  window.postMessage(
    {
      greeting: 'hello there!',
      source: 'restate-di-extension'
    },
    '*'
  )
}

injectedContent()
