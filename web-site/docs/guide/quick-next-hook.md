---
title: Next Hooks
path: /quick-next-hook/
---

import { MdxLayout } from "../layouts/mdx-layout"
import { Link } from "gatsby"
import { InfoPanel, WarningPanel } from "../components/panel"
export default MdxLayout

To change our state, we use **next-hooks**.

First, we have to create a _next-hook_ for our state, using `createNextHook`:

```tsx lines=3 src=https://stackblitz.com/edit/restate-hello-world
import { createNextHook } from 'restate'

const useNextAppState = createNextHook(AppStoreProvider)
```

The `useNextAppState` hook takes a selector function to scope
the access to our state. In this example the scope is the `user` object.

The `useNextAppState` returns a custom`next` function, which
can be use to change the `user` object:

```tsx lines=4-5,8-9 src=https://stackblitz.com/edit/restate-hello-world
const NameForm = () => {
  const name = useAppState((state) => state.user.name)

  // Creates a `next` function to change the user
  const next = useNextAppState((state) => state.user)

  function setName(nextName: string) {
    // The next function provides the current user object, which we can modify.
    next((user) => (user.name = nextName))
  }

  return <input value={name} onChange={(e) => setName(e.target.value)} />
}
```

With next-hooks, you can only select objects or arrays - not single
properties of an object.

::: info

Keep in mind:

- next-hooks are great to change your state "inline"
- with next hooks, you can only select object or arrays - not individual object properties.
- you can modify the state only in a **synchronous** way. If your code to change the state
  is **asynchronous**, you need to use <Link to="/quick-actions">Actions</Link> instead.

:::
