import React from 'react'
import './App.css'
import { HelloService } from './examples/hello-service'
import { ExampleSwitch } from './example-switch'

function Layout(props: React.PropsWithChildren) {
  return <div className="layout"> {props.children}</div>
}

function App() {
  return (
    <Layout>
      <ExampleSwitch />
      <HelloService />
    </Layout>
  )
}

export default App
