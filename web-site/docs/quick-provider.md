---
title: Store Provider
path: /quick-provider/
---

import { MdxLayout } from "../layouts/mdx-layout"
import { Link } from "gatsby"
import { InfoPanel, WarningPanel } from "../components/panel"
export default MdxLayout

To connect our store to the React component tree we need a `Provider`:

```tsx src=https://stackblitz.com/edit/restate-hello-world
import { createProvider } from 'restate'

const AppStoreProvider = createProvider(store) // to provide the store to react
```

We deploy the store at the top of our component tree:

```tsx src=https://stackblitz.com/edit/restate-hello-world
const App: React.FC = () => (
  <AppStoreProvider.Provider value={store}>
    <Hello />
    <Age />
    <NameForm />
  </AppStoreProvider.Provider>
)
```

See the section <Link to="/next-hook">Provider</Link> to learn more about the provider
and how to use multiple stores.
