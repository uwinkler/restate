[![Greenkeeper badge](https://badges.greenkeeper.io/uwinkler/restate.svg)](https://greenkeeper.io/)

# Restate

_Restate_ is the React state management library you've always desired: user-friendly, seamlessly integratable, reactive, and typesafe.

Here's a glimpse of its simplicity:

```tsx
const { useAppState } = create({
  state: {
    user: {
      name: 'John Snow',
      age: 32
    }
  }
})

function NameInput() {
  const [name, setName] = useAppState((state) => state.user.name)
  return <input value={name} onChange={(e) => setName(e.target.value)} />
}

function Age {
  const [age, setAge] = useAppState((state) => state.user.age)
  return <input value={age} onChange={(e) => setAge(Number(e.target.value))} />
}
```

Even if the code above looks like plain Javascript, it is indeed Typescript. The `setAge` function
is typed and will only accept a number. The `setName` function will only accept a string.

There is a full example on [StackBlitz](https://stackblitz.com/edit/hello-restate?file=src%2FApp.tsx) you can play with.

The documentation is also available [here](https://master--restate.netlify.app/).

# About

_Restate_ is inspired by the [principles of Redux](https://redux.js.org/introduction/three-principles):

- State is read only
- Changes are pure, but made in a convenient way using [immer.js](https://github.com/immerjs/immer)

Futhermore, Restate

- provides a nice React-Hook based API to read and update the state
- is using Typescript to make your application more robust and your development experience more enjoyable
- provide means to develop asynchronous state changes without the drama
- multiple stores
- makes it easy integrate other components (server, logger, database, router,...) as
  the state is [reactive](https://github.com/ReactiveX/rxjs).
- provides means to validate state changes (checkout the ZOD example - you will be amazed)
- dev-tools
- easy to learn and easy to test

## Installation

With NPM:

```bash
npm install @restate/core immer rxjs --save
```

or with YARN:

```bash
yarn add @restate/core immer rxjs
```

`rxjs` and `immer` are peer dependencies of `@restate/core`.

## useAppState Hook

To read and write your state can use the `useAppState` hook.

```ts
const { useAppState } = create({
  state: {
    user: { name: 'John  Snow', age: 32 },
    todos: []
  }
})

function Hello() {
  const [name, setName] = useAppState((state) => state.user.name)

  return (
    <>
      <h1>Hello {name}</h1>
      <input value={name} onChange={(e) => setName(e.target.value)} />
    </>
  )
}
```

Try on a full example on [StackBlitz](https://stackblitz.com/edit/hello-restate?file=src%2FApp.tsx)!

## useSelector

The create function not only generates the `useAppState` hook but also provides access to another hook: the `useSelector` hook.

In various scenarios, the primary requirement often revolves around displaying a specific value or deriving a display value based on the current state. In such cases, leveraging the `useSelector` hook is recommended. The `useSelector` hook triggers a re-render only when there's a change in the computed value, optimizing efficiency in your application.

```ts
import { create } from '@restate/core'

// We create our app state hook as well as a "read-only" selector hook to access the state:
const { useAppState, useSelector } = create({
  state: {
    user: {
      name: 'John',
      age: 32
    }
  }
})

function Greeting() {
  // With the useSelect hook we can compute a value from the state and only
  // re-render when the computed value changes.
  const greeting = useSelector((s) =>
    s.user.age > 30 ? 'Good day Sir!' : `Hey there, ${s.user.name}!`
  )
  return <h1>{greeting}!</h1>
}

function AgeInput() {
  const [age, setAge] = useAppState((s) => s.user.age)
  return <input value={age} onChange={(e) => setAge(Number(e.target.value))} />
}

export function HelloUseSelector() {
  return (
    <div className="layout">
      <Greeting />
      <AgeInput />
      <Hint />
    </div>
  )
}
```

Try on [StackBlitz](https://stackblitz.com/edit/hello-restate?file=src%2FApp.tsx)!

## useNext

If your goal is to exclusively modify the state without the necessity to read from the store, consider using the `useNext` hook.

```ts
const { useNext } = create({
  state: {
    user: {
      name: 'John',
      age: 32
    }
  }
})

function ResetButton() {
  const setAge = useNext((s) => s.user.age)
  return <button onClick={() => setAge(32)}>Reset</button>
}
```

## The `store` object

If you need to access the store outside of a React
component tree, you can use the `store` object.

The `create` function returns the store object.

```tsx
const { store } = create({
  state: {
    user: {
      name: 'John',
      age: 32
    }
  }
})
```

The store object provides the following properties and methods:

- `state` - the current state
- `next` - a method to update the state
- `state$` - the state observable

### Reading from the store

You can read the current state from the store using the `store.state` property:

```tsx
console.log(store.state)
```

### Updating the store

You can update the state using the `store.next` function:

```tsx
store.next({
  user: {
    name: 'John',
    age: 33
  }
})
```

...or in an imperative way:

```tsx
store.next((s) => {
  s.user.age = 33
})
```

Note: the store is immutable. You can't change the state directly. So this will not work:

```tsx
🚨 WILL NOT WORK 🚨
store.state.user.age = 33
```

### Observing the store

The store holds an RxJS observable. You can subscribe to the `store.state$` observable to get state updates.

You may want to observe the store to reactively execute some effects, such as: make some server calls, log some state changes, or write
some data to the local storage.

Here is a simple logger that logs name changes, but in a debounced way:

```tsx
function connectNameLogger() {
  store.state$
    .pipe(
      // the update object contains the state
      map((update) => update.state.user.name),
      // only emit when the name changes
      // and we ignore other state changes
      distinctUntilChanged(),
      // debounce for 1s
      debounceTime(1000),
      // emit the previous and the next name together
      pairwise()
    )
    .subscribe(([previousName, nextName]) =>
      // log the previous and the next name, so
      // we can see the change
      console.log(`${previousName} -> ${nextName}`)
    )
}
```

## Using Zod validation and middleware

### About ZOD

ZOD is a TypeScript-first schema declaration and validation library. We can use ZOD to define a schema for our state and use ZOD to validate all state updates - to make sure the state is always in a good shape and valid.

This is especially useful during development, because it helps us to find bugs early. If for example, a server response is not in the expected format, we can detect invalid state updates early and fix the bug.

[https://github.com/colinhacks/zod]()

### Step 1: Define a schema for the state

First we have to define a schema for our state using ZOD:

```tsx
import { Middleware, create } from '@restate/core'
import { z } from 'zod'

const stateSchema = z.object({
  user: z.object({
    name: z.string(),
    age: z.number().min(0).max(150)
  })
})
```

### Step 2: Infer the state type

We can use ZOD to infer the state type from the schema:

```tsx
type State = z.infer<typeof stateSchema>
```

### Step 3: Validation Middleware

We write a simple middleware that use the `stateSchema` to validate the `nextState`. `stateSchema` throws an ZodError if the next state is invalid. If a middleware throws an exception, the state update will be canceled.

```tsx
const validateMiddlewareWithZod: Middleware<State> = ({ nextState }) =>
  stateSchema.parse(nextState)
```

Finally, we can use this ZOD middleware in our store:

```tsx
const { useAppState, useSelector, store } = create<State>({
  state: {
    user: {
      name: 'John',
      age: 32
    }
  },
  middleware: [validateMiddlewareWithZod]
})
```

## Redux-DevTools

`restate` uses the
excellent <a href="https://github.com/zalmoxisus/redux-devtools-extension" target="https://github.com/zalmoxisus/redux-devtools-extension">ReduxDevTools</a> to provide power-ups for your development workflow.

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

## Multiple Stores

You can easily have more than one store in your application by calling `create` multiple times and renaming the `useAppState` hook.

```tsx
import { create } from '@restate/core'

const { useAppState: useUserAppState } = create({
  state: {
    name: 'John Snow',
    age: 32
  }
})

const { useAppState: useTodoAppState } = create({
  state: {
    todos: [
      { todo: 'Buy Milk', done: false },
      { todo: 'Buy Eggs', done: false }
    ]
  }
})
```

## License

MIT
