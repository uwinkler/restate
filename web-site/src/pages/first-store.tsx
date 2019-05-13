import * as React from "react"
import Link from "gatsby-link"
import { DefaultLayout } from "../layouts"
import { Code } from "../components/code"
import { Divider, Button } from "@material-ui/core"

interface IndexPageProps {
  location: any
}

const helloJohnSnow = `import React from 'react';
import { render } from 'react-dom';
import { 
  createStore, 
  createProvider,
  createStateHook, 
  createNextHook 
} from 'react-rx-state'

// create a store and initalize the store with a default state
const store = createStore({
  state: {
    name: 'John Snow',
  }
})

// the context provider to provide the store to components
const AppStateProvider = createProvider(store);

// the "state hook" to select values from the state 
const useAppState = createStateHook(AppStateProvider);

// the "next hook" to update our state
const useNextAppState = createNextHook(AppStateProvider);

const App: React.FC = () => {
  const name = useAppState(state => state.name)
  const next = useNextAppState(state => state)

  function changeName(nextName: string) {
    next(state => {
      state.name = nextName;
    })
  }

  return (
    <AppStateProvider.Provider value={store}>
      <h1>Hello {name}</h1>
      <input value={name} onChange={e => changeName(e.target.value)} />
    </AppStateProvider.Provider>
  );
}

render(<App />, document.getElementById('root'));`

const imports = `import { 
  createStore, 
  createProvider,
  createStateHook, 
  createNextHook 
} from 'react-rx-state'
`

const createStore = `const store = createStore({
  state: {
    name: 'John Snow',
  }
})
`

const createProvider = `const AppStateProvider = createProvider(store);`
const createStateHook = `const useAppState = createStateHook(AppStateProvider);`
const createNextHook = `const useNextAppState = createNextHook(AppStateProvider);`

export default (props: IndexPageProps) => {
  return (
    <DefaultLayout title="First Store" path={props.location.pathname}>
      <h1>Hello John Snow</h1>

      <p>
        Here is a hello world app with <i>react-rx-state:</i>
      </p>
      <Code code={helloJohnSnow} />

      <p>
        All examples - like this one - are available on &nbsp;
        <a
          href="https://stackblitz.com/edit/react-rx-state-hello-world"
          target="_blank"
        >
          stackblitz!
        </a>
      </p>

      <p>Let's have a closer look.</p>

      <h3>1. Imports</h3>

      <Code code={imports} />

      <h3>2. Create Store</h3>

      <Code code={createStore} />

      <h3>3. Create Provider</h3>

      <Code code={createProvider} />

      <h3>4. Create State Hook</h3>

      <Code code={createStateHook} />

      <h3>5. Create Next Hook</h3>

      <Code code={createNextHook} />

      <h3>6. Component</h3>

      <Code code={createNextHook} />

      <p />

      <Divider style={{ marginTop: 30 }} />
      <p>
        <Button>
          <Link to="/page-2/">Next: your first store</Link>
        </Button>
      </p>
    </DefaultLayout>
  )
}
