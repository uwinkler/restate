---
title: Quick Hooks
path: /quick-hooks/
---

import { MdxLayout } from "../layouts/mdx-layout"
import { Link } from "gatsby"
import { InfoPanel, WarningPanel } from "../components/panel"
export default MdxLayout

## Hooks

`restate` provides two hooks, you will use most often:

- <Link to="/state-hook">State hooks</Link> - to select values from your store
- <Link to="/next-hook">Next hooks</Link> - to update your store

## State Hooks

State hooks are use to

- select properties from your state
- do some basic computations / transformations

```tsx lines=9,13,15 src=https://stackblitz.com/edit/restate-hello-world?file=index.tsx
const store = createStore({
  state: {
    user: { name: 'John Doe', age: 32 },
    todos: 0
  }
})
...
// create a `scoped state hook` (we select the user sub-state)
const useUserState = createStateHook(AppStoreProvider, state => state.user);

const Hello = () => {
  // select a property from the state
  const name = useUserState(user => user.name)
  // do some basic computations
  const days = useUserState(user => user.age * 365)

  return <h1>Hello {name}, you are {days} days old</h1>
}
```

See the section <Link to="/state-hook">State hook</Link> to learn more about state hooks, scoped state hooks and selector functions.

## Next Hook

<Link to="/next-hook">Next hooks</Link> are used to update your store.

```tsx lines=2,6,9
...
const useNextAppState = createNextHook(AppStoreProvider);

const NameForm = () => {
  const name = useUserState(state => state.name)
  const nextUser = useNextAppState(state => state.user)

  function setName(nextName:string) {
    nextUser(user => user.name = nextName)
  }

  return <input value={name} onChange={e => setName(e.target.value)} />
}
```

See the section <Link to="/next-hook">Next hook</Link> to learn more about next hooks, scoped next hooks and selector functions.
