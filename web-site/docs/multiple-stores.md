---
title: Multiple Stores
path: /multiple-stores/
---

import { Link } from "gatsby"
import { MdxLayout } from "../layouts/mdx-layout"
import { InfoPanel, WarningPanel } from "../components/panel"
export default MdxLayout

You can easily have more than one store in your application. See the multiple store example on [BlitzStack!](https://stackblitz.com/edit/restate-multiple-stores-toggle?file=index.tsx)

```tsx src=https://stackblitz.com/edit/restate-multiple-stores-toggle?file=index.tsx

const store1 = createStore<State>({
  state: {
    user: {
      name: 'John Snow',
      age: 32,
    },
  }
})

const store2 = createStore<State>({
  state: {
    user: {
      name: 'Arya Stark',
      age: 25,
    },
  }
})

const AppStoreProvider = createProvider<State>(null);
//const AppStoreProvider = createProvider<State>(store1); would also work


...

const ToggleStore = props => {
  const [store, setStore] = React.useState(store1)

  return (
    <div>
      <button onClick={() => setStore(store1)}>Store 1</button>
      <button onClick={() => setStore(store2)}>Store 2</button>
      <AppStoreProvider.Provider value={store}>
        {props.children}
      </AppStoreProvider.Provider>

    </div>
  )
}

const App: React.FC = () => (
  <ToggleStore>
    <Hello />
    <Age />
    <NameForm />
  </ToggleStore>
);


render(<App />, document.getElementById('root'));
```
