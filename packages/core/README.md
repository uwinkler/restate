# RESTATE

_Restate_ is a predictable, easy to use, easy to integrate, typesafe state container for [React](https://reactjs.org/).

_Restate_ follows the [three principles of Redux](https://redux.js.org/introduction/three-principles):

- Single source of truth
- State is read only
- Changes are pure, but made in a convenient way using [immer.js](https://github.com/immerjs/immer)

Futhermore, Restate

- provides a nice React-Hook based API to read and update the state
- is using Typescript to make your application more robust and your development experience more enjoyable
- provide means to develop asynchronous state changes without the drama
- makes it easy integrate other components (server, logger, database, router,...) as
  the state is [reactive](https://github.com/ReactiveX/rxjs).
- dev-tools
- easy to learn and easy to test

## What it looks like...

```ts
const store = createStore({
  state: {
    name: "John Snow",
    age: 32
  }
})

const AppStoreProvider = createProvider(store);
const useAppState = createStateHook(AppStoreProvider);
const useNextAppState = createNextHook(AppStoreProvider);

const Name = () => {
  const name = useAppState(state => state.user.name)
  const next = useNextAppState(state => state.user)

  function setName(nextName:string) {
    next(user => user.name = nextName)
  }

  return <input value={name} onChange={e => setName(e.target.value)} />
}
```

Try it on [StackBlitz](https://stackblitz.com/edit/restate-hello-world)!

The documentation is available on Netlify:[https://restate-state.netlify.com/](https://restate.netlify.com/).

## Installation

With NPM:

```bash
npm install @restate/core --save
```

or with YARN:

```bash
yarn add @restate/core
```

## Store

To get started, you need to create a store:

```ts
import { createStore } from "@restate/core"

const store = createStore({
  state: {
    name: "John Snow",
    age: 32
  }
})
```

Try on [StackBlitz](https://stackblitz.com/edit/restate-hello-world)!

## Provider

To connect our store to the React component tree we need a `Provider`:

```ts
import { createProvider } from "@restate/core"

const AppStoreProvider = createProvider(store) // to provide the store to react

const App: React.FC = () => (
  <AppStoreProvider.Provider value={store}>
    <Hello />
    <Age />
    <NameForm />
  </AppStoreProvider.Provider>
)
```

Try on [StackBlitz](https://stackblitz.com/edit/restate-hello-world)!

You can use [multiple stores](https://stackblitz.com/edit/restate-multiple-stores-toggle?file=index.tsx) as well.

## Read from the state

To read from the state Restate provides you _AppStateHooks_.

AppStateHooks hooks are use to

- select properties from your state
- do some basic computations / transformations

```ts
const store = createStore({
  state: {
    user: { name: "John Doe", age: 32 },
    todos: 0
  }
})

const AppStoreProvider = createProvider(store)

// create a `scoped state hook` (we select the `user` object)
const useUserState = createStateHook(AppStoreProvider, state => state.user)

const Hello = () => {
  // select a property from the state
  const name = useUserState(user => user.name)
  // do some basic views/computations/transformations
  const days = useUserState(user => user.age * 365)

  return (
    <h1>
      Hello {name}, you are {days} days old
    </h1>
  )
}
```

Try on [StackBlitz](https://stackblitz.com/edit/restate-hello-world)!

## Change the state - using hooks

To change the state, we use a Next-Hook.

```ts
import { createNextHook } from "@restate/core"

// create a next-hook
const useNextAppState = createNextHook(AppStoreProvider)
```

The `useNextAppState` hook takes a selector function to scope
the access to our state. In this example the scope is the `user` object.

The `useNextAppState` returns a custom`next` function, which
can be use to change the `user` object:

```ts
const NameForm = () => {
  const name = useAppState(state => state.user.name)

  // Creates a `next` function to change the user
  const next = useNextAppState(state => state.user)

  function setName(nextName: string) {
    // The next function provides the current user object as parameter, which we can modify.
    next(user => (user.name = nextName))
  }

  return <input value={name} onChange={e => setName(e.target.value)} />
}
```

Try on [StackBlitz](https://stackblitz.com/edit/restate-hello-world)!

## Change the state - using actions

Another way to modify your state are **Actions**.

Actions are forged in an _ActionFactory_. The _ActionFactory_ is a function that
receives - among other things - the `next()` function to update the store.

An _ActionFactory_ returns a object that holds
the all the actions to change the state. Think about actions as "member functions" of your state.

Actions can be asynchronous.

```ts
// Action factory
const userActionsFactory = ({ next }: ActionFactoryProps<User>) => ({
  incrementAge() {
    next(user => user.age++)
  },
  decrementAge() {
    next(user => user.age--)
  },
  async fetchData(userId: string) {
    const data = await serverFetchUserData(userId)
    next(user => (user.data = data))
  }
})
```

The _ActionFactory_ is hooked into `React` using the `createActionsHook`:

```ts
const useUserActions = createActionsHook(
  AppStoreProvider,
  state => state.user,
  userActionsFactory
)

const Age = () => {
  const userActions = useUserActions()
  return (
    <div>
      <button onClick={userActions.incrementAge}>+</button>
      <button onClick={userActions.decrementAge}>-</button>
    </div>
  )
}
```

Try on [StackBlitz](https://stackblitz.com/edit/restate-actions?file=index.tsx)

## Change the state - using `store.next()`

Outside of your component tree you can change the store like this:

```ts
store.next(state => {
  state.user.name = "John"
})
```

## Middleware

Middleware are small synchronous functions which intercept state updates. Middleware functions receiving the `currentState` as well as the `nextState`.
They can change the `nextState`, if required. If a middleware throws an exception, the state update will be canceled.

Take the `ageValidator` middleware for example.
It ensures, that the `user.age` property never gets negative.

```ts
// Ensures the age will never be < 0
const ageValidator: Middleware<State> = ({ nextState, currentState }) => {
  nextState.age =
    nextState.user.age < 0 ? currentState.user.age : nextState.user.age
}

const store = createStore({
  state: {
    name: "John Snow",
    age: 32
  },
  middleware: [ageValidator]
})

store.next(s => (s.user.age = -1)) // will be intercepted by the ageValidator middleware.
```

Try on [StackBlitz](https://stackblitz.com/edit/restate-middleware)

## Glue-Code

Glue-code is code that "glues" your store to other parts of the application, for example to your server, database, ...

Glue-code can

- observer the state and react to state changes using the `store.state$` observable
- change the state using the `store.next()` function
- listen to events dispatched on the `state.messageBus$` observable. The messages are similar to redux actions.

#### Observe `store.state$`

Here is an very simple logger example, that observes the state and logs all state changes:

```ts
function connectLogger(store: RxStore<any>) {
  store.state$.subscribe(nextState => {
    console.log("STATE:", JSON.stringify(nextState.payload, null, 2))
  })
}

connectLogger(store)
```

Try on [StackBlitz](https://stackblitz.com/edit/restate-hello-quick-glue?file=index.tsx)

#### Change the state with `store.next()`

Another example of glue code could be a <a href="https://socket.io">socket.io</a> adapter, that receives chat
messages from a server and adds them to the application state:

```ts
function connectSocket(store: RxStore<any>) {
  socket.on("chat message", msg => {
    store.next(state => {
      state.messages.push(msg)
    })
  })
}

connectSocket(store)
```

#### Listen to events

Glue-code can also receive messages from the application - redux style.

Here is a simple UNDO example. The glue-code records the history of the app state using the `store.state$` observable.
The glue-code also listens to the `UNDO` events by subscribing the `store.messageBus$`.
If it receives the `UNDO` event, it rewinds the state history by on step.

```ts
  const history = []

  // record state history
  store.state$.subscribe(nextState => {
    history.push(nextState);
  })

  // listen to UNDO events
  store.messageBus$.subscribe( msg => {
    if(msg.type === 'UNDO' && history.length > 1) {
      history.pop()  // remove current state
      const prevState = history.pop();
      store.next(prevState);
    }
  })
}

connectUndo(store);
```

The application uses `createDispatchHook(AppStoreProvider)` to create a `useDispatch` hook. With the dispatch hook, a component can dispatch an `UNDO` event:

```ts
const useDispatch = createMessageBusHook(AppStoreProvider)

function useUndo() {
  const dispatch = useDispatch()
  return () => dispatch({ type: "UNDO" })
}

const UndoButton = () => {
  const undo = useUndo()
  return <button onClick={undo}>UNDO</button>
}
```

Try the UNDO example on [StackBlitz!](https://stackblitz.com/edit/restate-glue-undo?file=index.tsx)

## DevTools

`restate` uses the
excellent <a href="https://github.com/zalmoxisus/redux-devtools-extension" target="https://github.com/zalmoxisus/redux-devtools-extension">ReduxDevTools</a> to provide power-ups for your development workflow.

![DevTools screenshot](https://raw.githubusercontent.com/uwinkler/restate/dev/web-site/src/pages/dev-tools-screenshot.png)

#### Installation

Go and get the ReduxDevTools for your browser:

- <a href="https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd">Google Chrome</a>
- <a href="https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/">Firefox</a>

Then install the `@restate/dev-tools`

```bash
yarn install @restate/dev-tools
```

#### Usage

```ts
import { connectDevTools } from "@restate/dev-tools"

const store = createStore({
  state: {
    name: "John Snow",
    age: 32
  },
  options: {
    storeName: "MY APP STORE" // <-- will show up in the instance selector
  }
})

connectDevTools(store)
```

## License

MIT
