import * as React from "react"
import Link from "gatsby-link"
import { DefaultLayout } from "../layouts"
import { Code } from "../components/code"
import { Divider, Button } from "@material-ui/core"
import { TT } from "../components/tt"

interface IndexPageProps {
  location: any
}

const helloJohnSnow = `import React from 'react';
import { render } from 'react-dom';
import { createStore, createProvider, createStateHook, createNextHook } from 'react-rx-state'

// create a store and initalize the store with a default state
const store = createStore({
  state: {
    name: 'John Snow',
    age: 32,
  }
})

const AppStoreProvider = createProvider(store);  // provides the store to the component tree
const useAppState = createStateHook(AppStoreProvider); // to pick values from the state
const useNextAppState = createNextHook(AppStoreProvider); // to update our state

//
// Components
//
const Hello = () => {
  const name = useAppState(state => state.name)
  return <h1>Hello {name}</h1>
}

const Age = () => {
  const age = useAppState(state => state.age)
  return <div>{age} years old</div>
}

const NameForm = () => {
  const name = useAppState(state => state.name)
  const next = useNextAppState(state => state)

  return <input value={name} onChange={e => next(state => state.name = e.target.value)} />
}

const App = () => (
  <AppStoreProvider.Provider value={store}>
    <Hello />
    <Age />
    <NameForm />
  </AppStoreProvider.Provider>
);


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

export default (props: IndexPageProps) => {
  return (
    <DefaultLayout title="First Store" path={props.location.pathname}>
      <p>
        Here is a complete <TT>Hello World</TT> app with <TT>react-rx-state</TT>{" "}
        (written in Typescript)
      </p>

      <Code code={helloJohnSnow} />

      <p>
        All examples - like this one - are available on &nbsp;
        <a
          href="https://stackblitz.com/edit/react-rx-state-hello-world"
          target="_blank"
        >
          Stackblitz
        </a>
        . Try to edit it! And see, how Typescript awesome type inference helps
        you with code completion and nice error messages if you make any
        mistakes.
      </p>

      <Divider style={{ marginTop: 30 }} />
      <p>
        <Button>
          <Link to="/page-2/">Next: your first store</Link>
        </Button>
      </p>
    </DefaultLayout>
  )
}
