# Multiple Stores

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
      { todo: 'Buy Mild', done: false },
      { todo: 'Buy Eggs', done: false }
    ]
  }
})
```

# Example

<<< @/../../packages/example/src/examples/multiple-stores.tsx
