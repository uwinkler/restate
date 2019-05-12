import * as React from "react"
import Link from "gatsby-link"
import { DefaultLayout } from "../layouts"
import { Code } from "../components/code"
import { Divider, Button } from "@material-ui/core"

interface IndexPageProps {
  location: any
}

const helloJohnSnow = `
import React, { Component } from 'react';
import { render } from 'react-dom';
import Hello from './Hello';
import './style.css';
import { createStore , createProvider, createUseStoreStateHook, createUseStoreUpdateHook} from 'react-rx-state'

interface AppState {
  name: string,
}

const defaultAppState:AppState = {
  name: 'John Snow'
}

const store = createStore({state:defaultAppState})
const AppStateProvider = createProvider(store);
const useAppState = createUseStoreStateHook(AppStateProvider);
const useUpdateState = createUseStoreUpdateHook(AppStateProvider);


const App: React.FC = () => {

  const state = useAppState(state => state)
  const updateState = useUpdateState(state => state)

  function changeName(e) {
    updateState(s => {
      s.name = e.target.value
    })
  }

  return (
    <div>
      <Hello name={state.name} />
      <input value={state.name} onChange={changeName} /> 
    </div>
  );

}

render(<App />, document.getElementById('root'));
`

export default (props: IndexPageProps) => {
  return (
    <DefaultLayout title="First Store" path={props.location.pathname}>
      <Code code={helloJohnSnow} />

      <Divider style={{ marginTop: 30 }} />
      <p>
        <Button>
          <Link to="/page-2/">Next: your first store</Link>
        </Button>
      </p>
    </DefaultLayout>
  )
}
