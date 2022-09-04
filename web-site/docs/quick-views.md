---
title: Views
path: /quick-views/
---

import { MdxLayout } from "../layouts/mdx-layout"
import { Link } from "gatsby"
import { InfoPanel, WarningPanel } from "../components/panel"
export default MdxLayout

# Views

Views (or computed values) are values that can be derived from the existing state.

Most of the time you will use <Link to="state-hook">state hooks</Link> to select properties from the state. With <Link to="/state-hook">state hooks</Link>, you can do some basic view computations as well, e.g. to compute
the age of John Snow in days:

```
  const days = useAppState(state => state.user.age * 365)
```

To re-use selector functions, you could write custom hooks:

```
// computes the age of the user in days
function useAge() {
  return useAppState(state => state.user.age * 365);
}

// counts the number of open todos
function useCountOpenTodos() {
  return useAppState(state => state.todos.filter( todo => todo.open).length);
}

const Age = () => {
  const age = useAge();
  const countOpenTodos = useCountOpenTodos()
  return <div>You are {age} days old. You have {countOpenTodos} things to do.</div>
}
```

<hr />

### Elaborated Views

However, in some situations you may want to write more elaborated views, in particular if
your view depends on an external data sources or needs to maintain some state.
In such cases you want to use the `useStore()` hook. The `useStore()` hook
gives you access to the store.

In the following example we want to count the seconds since the store has been last changed.
We use an observable `everySec` to count the seconds. We subscribe to the store using the `useStore()` hook
and re-set the counter `lastUpdate` everytime the state changes.

Try it on <a href="https://stackblitz.com/edit/restate-views?file=index.tsx" target="https://stackblitz.com/edit/react-rrestatefile=index.tsx">stackblitz</a>.

```tsx lines=4,10-13 src=https://stackblitz.com/edit/restate-views?file=index.tsx
const everySec$ = interval(1000)

function useStoreLastChanged() {
  const store = useStore()
  const [secs, setSecs] = useState(0)

  useEffect(() => {
    let lastUpdate = Date.now()

    const storeSub = store.state$.subscribe((nextState) => {
      lastUpdate = Date.now()
      setSecs(0)
    })

    const everySecSub = everySec$.subscribe((nextTick) => {
      setSecs(Math.floor((Date.now() - lastUpdate) / 1000))
    })

    const cleanup = () => {
      storeSub.unsubscribe()
      everySecSub.unsubscribe()
    }

    return cleanup
  }, [])

  return secs
}
```
