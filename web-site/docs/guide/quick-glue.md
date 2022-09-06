---
title: Connector
path: /quick-glue/
---

import { MdxLayout } from "../layouts/mdx-layout"
import { Link } from "gatsby"
import { InfoPanel, WarningPanel } from "../components/panel"
export default MdxLayout

Connectors "glues" your store to other parts of the application, for example to your server, database, ...

Connectors can receive message from the React components, actions or other connectors.

#### Read

Here is an very simple logger example, that observes the state and logs all state changes:

```tsx src=https://stackblitz.com/edit/restate-hello-quick-glue?file=index.tsx
function connectLogger(store: RxStore<any>) {
  store.state$.subscribe((nextState) => {
    console.log('STATE:', JSON.stringify(nextState.payload, null, 2))
  })
}

connectLogger(store)
```

#### Update

Another example of a connector could be a <a href="https://socket.io">socket.io</a> adapter, that receives chat
messages from a server and adds them to the application state:

```
function connectSocket(store:RxStore<any>) {
 socket.on('chat message', msg => {
    store.next(state => {state.messages.push(msg)});
 });
}

connectSocket(store)
```

#### Messages

Connectors can also receive messages from the application.

Here is a simple UNDO example. The undo-connector records the history of the app state using the `store.state$` observable.
The connector also listens to the `UNDO` events by subscribing the `store.messageBus$`.
If it receives the `UNDO` event, it rewinds the state history by on step.

```tsx src=https://stackblitz.com/edit/restate-glue-undo?file=index.tsx
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

The application can use `createDispatchHook(AppStoreProvider)` to create a `useDispatch` hook. With this hook, a component can dispatch an `UNDO` event:

```tsx src=https://stackblitz.com/edit/restate-glue-undo?file=index.tsx
const useDispatch = createMessageBusHook(AppStoreProvider)

function useUndo() {
  const dispatch = useDispatch()
  return () => dispatch({ type: 'UNDO' })
}

const UndoButton = () => {
  const undo = useUndo()
  return <button onClick={undo}>UNDO</button>
}
```

<hr />

To learn more about _connectors_ read the <Link to="/glue-code">Connector Guide</Link>
