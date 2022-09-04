---
title: Middleware
path: /quick-middleware/
---

import { MdxLayout } from "../layouts/mdx-layout"
import { Link } from "gatsby"
import { InfoPanel, WarningPanel } from "../components/panel"
export default MdxLayout

Middleware are small functions which intercept state updates. Middleware functions receiving the `currentState` as well as the `nextState`.
They can change the `nextState`, if required. If a middleware throws an exception, the state update will be canceled.

Take the `ageValidator` middleware for example.
It ensures, that the `user.age` property never gets negative.

```tsx src=https://stackblitz.com/edit/restate-middleware
// Ensures the age will never be < 0 or > 120
const ageValidator: Middleware<State> = ({ nextState, currentState }) => {
  nextState.age = nextState.user.age < 0 ? currentState.user.age : nextState.user.age
}

const store = createStore({
  state: {
    name: 'John Snow',
    age: 32
  },
  middleware: [ageValidator]
})

store.next((s) => (s.user.age = -1)) // will be intercepted by ageValidatorMin.
```

::: info

Keep in mind:

- You should use middleware wisely. Error handling of user input should be done within React components.
- Middleware state updates have to be done in a synchronously way.
- "Traditional" middleware, like loggers, are better written using connectors.

:::
