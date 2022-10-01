import React from 'react'
import './App.css'
import { HelloSelectorAndNext } from './examples/hello-next'
import { MultipleStores } from './examples/multiple-stores'
import { HelloCounter } from './examples/services'

function App() {
  return (
    <React.StrictMode>
      <HelloCounter />
    </React.StrictMode>
  )
}

export default App
