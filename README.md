[![CircleCI](https://circleci.com/gh/uwinkler/restate.svg?style=svg)](https://circleci.com/gh/uwinkler/restate) [![Greenkeeper badge](https://badges.greenkeeper.io/uwinkler/restate.svg)](https://greenkeeper.io/)

# Restate

_Restate_ is the application wide state management lib for React you always wanted. Easy to use, easy to integrate, reactive and typesafe.

This is what it looks like:

```tsx
const { useAppState } = create({
  state: {
    name: 'John Snow',
    age: 32
  }
})

function Name {
  const [name, setName] = useAppState((state) => state.name)
  return <input value={name} onChange={(e) => setName(e.target.value)} />
}

function Age {
  const [age, setAge] = useAppState((state) => state.age)
  return <input value={age} onChange={(e) => setAge(Number(e.target.value))} />
}
```

_Restate_ is inspired by the [principles of Redux](https://redux.js.org/introduction/three-principles):

- Single source of truth (but you can have multiple stores though)
- State is read only
- Changes are pure, but made in a convenient way using [immer.js](https://github.com/immerjs/immer)

Futhermore, Restate

- provides a nice React-Hook based API to read and update the state
- is using Typescript to make your application more robust and your development experience more enjoyable
- provide means to develop asynchronous state changes without the drama
- makes it easy integrate other components (server, logger, database, router,...) as
  the state is [reactive](https://github.com/ReactiveX/rxjs).
- provides means to validate state changes (checkout the ZOD example - you will be amazed)
- dev-tools
- easy to learn and easy to test

## What it looks like...

```ts
const { useAppState } = create({
  state: {
    name: 'John Snow',
    age: 32
  }
})

const Name = () => {
  const [name, setName] = useAppState((state) => state.name)
  return <input value={name} onChange={(e) => setName(e.target.value)} />
}

const Age = () => {
  const [(name, setName)] = useAppState((state) => state.age)
  return <input value={name} onChange={(e) => setName(Number(e.target.value))} />
}
```

Even the code above looks like JS, it is indeed Typescript. Go on [StackBlitz](https://stackblitz.com/edit/restate-hello-world) and
make some changes to the state, for example change the property `user.name` to `user.firstName`. You will see how Typescript is
able to pick up those changes and gives you nice error messages.

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

To get started, you need to create a store and a `useAppStateHook`:

```ts
import { create } from '@restate/core'

const { useAppState } = create({
  state: {
    name: 'John Snow',
    age: 32
  }
})
```

Try on [StackBlitz](https://stackblitz.com/edit/restate-hello-world)!

## Read from the state

To read from the state _Restate_ provides you `useAppState` hook.

- select properties from your state
- change the state using the setter function

```ts
const store = createStore({
  state: {
    user: { name: 'John  Snow', age: 32 },
    todos: 0
  }
})


  )
}
```

Try on [StackBlitz](https://stackblitz.com/edit/restate-hello-world)!

## Change the state - using hooks

To change the state, we use a Next-Hook.

```ts
import { createNextHook } from '@restate/core'

// create a next-hook
const useNextAppState = createNextHook(AppStoreProvider)
```

The `useNextAppState` hook takes a selector function to scope
the access to our state. In this example the scope is the `user` object.

The `useNextAppState` returns a custom`next` function, which
can be use to change the `user` object:

```ts
const NameForm = () => {
  const name = useAppState((state) => state.user.name)

  // Creates a `next` function to change the user
  const next = useNextAppState((state) => state.user)

  function setName(nextName: string) {
    // The next function provides the current user object as parameter, which we can modify.
    next((user) => (user.name = nextName))
  }

  return <input value={name} onChange={(e) => setName(e.target.value)} />
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
    next((user) => user.age++)
  },
  decrementAge() {
    next((user) => user.age--)
  },
  async fetchData(userId: string) {
    const data = await serverFetchUserData(userId)
    next((user) => (user.data = data))
  }
})
```

The _ActionFactory_ is hooked into `React` using the `createActionsHook`:

```ts
const useUserActions = createActionsHook(
  AppStoreProvider,
  (state) => state.user,
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
store.next((state) => {
  state.user.name = 'John'
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
    name: 'John Snow',
    age: 32
  },
  middleware: [ageValidator]
})

store.next((s) => (s.user.age = -1)) // will be intercepted by the ageValidator middleware.
```

Try on [StackBlitz](https://stackblitz.com/edit/restate-middleware)

## Connectors

Connectors "glue" your store to other parts of the application, for example to your server, database, ...

Connectors can

- observer the state and react to state changes using the `store.state$` observable
- change the state using the `store.next()` function
- listen to events dispatched on the `state.messageBus$` observable. The messages are similar to redux actions.
-

#### Observe `store.state$`

Here is an very simple logger example, that observes the state and logs all state changes:

```ts
function connectLogger(store: RxStore<any>) {
  store.state$.subscribe((nextState) => {
    console.log('STATE:', JSON.stringify(nextState.payload, null, 2))
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
  socket.on('chat message', (msg) => {
    store.next((state) => {
      state.messages.push(msg)
    })
  })
}

connectSocket(store)
```

#### Listen to events

Connectors can also receive messages from the application - redux style.

Here is a simple UNDO example. The undo-connector records the history of the app state using the `store.state$` observable.

The undo-connector also listens to the `UNDO` events by subscribing to `store.messageBus$`.
If the connector receives a `UNDO` event, the connector rewinds the state history by one.

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

The application uses `createDispatchHook` to create a dispatch hook. With a dispatch hook, a component can dispatch an `UNDO` event, like so:

```ts
const useDispatch = createDispatchHook(AppStoreProvider)

function useUndo() {
  const dispatch = useDispatch()
  return () => dispatch({ type: 'UNDO' })
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
yarn add @restate/dev-tools
```

#### Usage

```ts
import { connectDevTools } from '@restate/dev-tools'

const store = createStore({
  state: {
    name: 'John Snow',
    age: 32
  },
  options: {
    storeName: 'MY APP STORE' // <-- will show up in the instance selector
  }
})

connectDevTools(store)
```

## License

MIT
