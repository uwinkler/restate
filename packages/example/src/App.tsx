import React from 'react'
import './App.css'
import { HelloSelectorAndNext } from './examples/hello-next'
import { MultipleStores } from './examples/multiple-stores'

function App() {
  return (
    <React.StrictMode>
      <MultipleStores />
      <HelloSelectorAndNext />
    </React.StrictMode>
  )
}

export default App
