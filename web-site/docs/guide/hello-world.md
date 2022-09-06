---
title: Hello, world!
path: /hello-world/
---

import { Code } from "../components/code"
import { MdxLayout } from "../layouts/mdx-layout"

Here is a `hello-world` app with `restate`:

```tsx src=https://stackblitz.com/edit/restate-hello-world
import React from 'react'
import { render } from 'react-dom'
import { createStore, createProvider, createStateHook, createNextHook } from '@restate/core'

const store = createStore({
  state: {
    name: 'John Snow',
    age: 32
  }
})

const AppStoreProvider = createProvider(store) // to provide the store to react
const useAppState = createStateHook(AppStoreProvider) // to select properties from the store
const useNextAppState = createNextHook(AppStoreProvider) // to update our store

const Hello = () => {
  // select a property from the state
  const name = useAppState((state) => state.name)
  return <h1>Hello {name}</h1>
}

const Age = () => {
  //  select a state property and do some basic computations/transformations
  const days = useAppState((state) => state.age * 365)
  return <div>{days} days old</div>
}

const NameForm = () => {
  const name = useAppState((state) => state.user.name)
  const next = useNextAppState((state) => state.user)

  function setName(nextName: string) {
    next((user) => (user.name = nextName))
  }

  return <input value={name} onChange={(e) => setName(e.target.value)} />
}

const App: React.FC = () => (
  <AppStoreProvider.Provider value={store}>
    <Hello />
    <Age />
    <NameForm />
  </AppStoreProvider.Provider>
)

render(<App />, document.getElementById('root'))
```

All examples - like this one - are available on StackBlitz. Click the blue StackBlitz icon in the lower right corner to edit it!
And see, how Typescript awesome type inference helps
you with code completion and gives you nice error messages - if you make any
mistakes.

export default MdxLayout
