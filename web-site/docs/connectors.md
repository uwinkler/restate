---
title: Connector
---

Connectors "glues" your store to other parts of the application, for example to your server, database, ...

Connectors can receive message from the React components, actions or other connectors.

#### Read

Here is an very simple logger example, that observes the state and logs all state changes:

```tsx
function connectLogger(store: RestateStore<any>) {
  store.state$.subscribe((update) => {
    console.log('STATE:', JSON.stringify(update.state, null, 2))
  })
}

connectLogger(store)
```

#### Update

Another example of a connector could be a <a href="https://socket.io">socket.io</a> adapter, that receives chat
messages from a server and adds them to the application state:

```tsx
function connectSocket(store: RestateStore<any>) {
  socket.on('chat message', (msg) => {
    store.next((state) => {
      state.messages.push(msg)
    })
  })
}

connectSocket(store)
```

#### Messages

Connectors can also receive messages from the application.

Here is a simple UNDO example. The undo-connector records the history of the app state using the `store.state$` observable.
The connector also listens to the `UNDO` events by subscribing the `store.messageBus$`.
If it receives the `UNDO` event, it rewinds the state history by on step.

```tsx
function connectUndo(store: RxStore<any>) {
  const history = []

  // record state history
  store.state$.subscribe((nextState) => {
    history.push(nextState)
  })

  // listen to UNDO events
  store.messageBus$.subscribe((msg) => {
    if (msg.type === 'UNDO' && history.length > 1) {
      history.pop() // remove current state
      const prevState = history.pop()
      store.next(prevState)
    }
  })
}

connectUndo(store)
```
