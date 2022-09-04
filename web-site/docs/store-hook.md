---
title: Store Hook
path: /store-hook/
---

import { MdxLayout } from "../layouts/mdx-layout"
import { Link } from "gatsby"
import { InfoPanel, WarningPanel } from "../components/panel"
export default MdxLayout

A store hook - create with `createStoreHook` - gives you access to the <Link to="/store">Store.</Link>
This enables you to develop elaborated custom hooks
which go beyond <Link to="/state-hook">app-state-hooks</Link>.

In some situations you may want to write more elaborated views on your state, in particular if
your view depends on an external data sources, or need to maintain some internal state, which is not part
of the app-state.

In such cases you want to use the `useStore()` hook.

## Usage

In the following example we want display the age of the app-state since the app-state has been changed.
We use an observable `everySec` to count the seconds. We subscribe to the store using the `useStore()` hook
and re-set the counter `lastUpdate` every time the state changes.

Try it on [BlitzStack!](https://stackblitz.com/edit/restate-views?file=index.tsx)

```tsx lines=2,11-16,18-21 src=https://stackblitz.com/edit/restate-views?file=index.tsx
const everySec$ = interval(1000)
const useStore = createStoreHook(AppStoreProvider)

function useStoreLastChanged() {
  const store = useStore()
  const [secs, setSecs] = useState(0)

  useEffect(() => {
    let lastUpdate = Date.now()

    // We subscribe to the store, and reset the counter
    // if the app-state changes
    const storeSub = store.state$.subscribe((nextState) => {
      lastUpdate = Date.now()
      setSecs(0)
    })

    // On every `tick` we compute the `secs` value new
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
