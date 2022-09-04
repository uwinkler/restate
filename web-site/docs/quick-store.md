To get started, you need to create a store:

```tsx src=https://stackblitz.com/edit/restate-hello-world
import { createStore } from '@restate/core'

const store = createStore({
  state: {
    name: 'John Snow',
    age: 32
  }
})
```

The `createStore` function takes the initial state, so your application always starts in an specified state.

Learn more about <Link to="/api-create-store">createStore</Link>.
