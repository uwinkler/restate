---
title: State Hooks
---

To select properties from our state, you use an **app state hook** (or state hooks for short)

First, we have to create an _app-state-hook_ using the `createStateHook` function.

```tsx lines=1 src=https://stackblitz.com/edit/restate-hello-world
const useAppState = createStateHook(AppStoreProvider)
```

The `useAppState` hook is a [React Hook](https://reactjs.org/docs/hooks-intro.html). The `useAppState` hook takes a _selector function_, to
select the property from our state, like so:

```tsx lines=2
function Age() {
  const age = useAppState((state) => state.user.age) // select the user age from the store

  return <div>You are {age} years old.</div>
}
```

Selector function can do computations and transformations as well:

```
const ageInDays = useAppState(state => state.user.age * 365);
```

Learn more about app-state-hooks in the section <Link to="/state-hook">app state hooks</Link>.

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

```tsx
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
