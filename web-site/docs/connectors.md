# Connectors

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

Another example of a connector could be a <a href="https://socket.io">socket.io</a> adapter, that receives chat messages from a server and adds them to the application state:

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

---

Full example on https://stackblitz.com/edit/hello-restate
