---
title: Actions
path: /quick-actions/
---

import { MdxLayout } from "../layouts/mdx-layout"
import { Link } from "gatsby"
import { InfoPanel, WarningPanel } from "../components/panel"
export default MdxLayout

Another way to modify your state are **Actions**.

Actions are forged in an _ActionFactory_. The _ActionFactory_ is a function that
receives - among other things - the `next()` function to update the store.

An _ActionFactory_ returns a object that holds
the all the actions to change the state. Think about actions as "member functions" of your state.

```tsx src=https://stackblitz.com/edit/restate-actions?file=index.tsx
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

```tsx src=https://stackblitz.com/edit/restates?file=index.tsx
const useUserActions = createActionsHook(AppStoreProvider, (state) => state.user, userActionsFactory)

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

::: info

Keep in mind:

- Think about actions as "member functions" of your state.
- Actions keeps your React code clean and side-effect free.
- Actions can be asynchronously
- Actions can be used outside of React components as well
- Actions simplifies testing: actions can be tested outside of a React component. Action-hooks can be easily mocked.

Learn more about <Link to="/actions">Actions.</Link>

:::
