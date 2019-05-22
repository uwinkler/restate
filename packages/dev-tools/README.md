# RESTATE DEV TOOLS

_Restate_ is a predictable, easy to use, easy to integrate, typesafe state container for [React](https://reactjs.org/).

Restate uses the
excellent <a href="https://github.com/zalmoxisus/redux-devtools-extension" target="https://github.com/zalmoxisus/redux-devtools-extension">ReduxDevTools</a> to provide power-ups for your development workflow.

![DevTools screenshot](https://raw.githubusercontent.com/uwinkler/restate/master/web-site/src/pages/dev-tools-screenshot.png)

#### Installation

Go and get the ReduxDevTools for your browser:

- <a href="https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd">Google Chrome</a>
- <a href="https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/">Firefox</a>

Then install the `@restate/dev-tools`

```bash
yarn install @restate/dev-tools
```

#### Usage

```ts
import { connectDevTools } from "@restate/dev-tools"

const store = createStore({
  state: {
    name: "John Snow",
    age: 32
  },
  options: {
    storeName: "MY APP STORE" // <-- will show up in the instance selector
  }
})

connectDevTools(store)
```
