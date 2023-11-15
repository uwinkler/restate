# useAppState Hook

To get started, you need to create a store:

```tsx
import { create } from '@restate/core'

const { useAppState } = create({
  state: {
    name: 'John Snow',
    age: 32
  }
})
```

The `create` function takes the initial state, so your application always starts in an specified state.

Then, you can use the `useAppState` hook to select properties from the store and get a function to update the store.

```tsx
const Hello = () => {
  const [name, setName] = useAppState((state) => state.name)

  return (
    <>
      <h1>Hello {name}</h1>
      <input value={name} onChange={(e) => setName(e.target.value)} />
    </>
  )
}
```

---

Full example on https://stackblitz.com/edit/hello-restate
