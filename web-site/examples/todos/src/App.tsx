import React from "react"
import logo from "./logo.svg"
import "./App.css"
import { AppStateProvider, store } from "./store"
import { AddTodo } from "./AddTodo"
import { TodoList } from "./TodoList"
import { Footer } from "./Footer"
import { Paginator } from "./Paginator"

function App() {
  return (
    <AppStateProvider.Provider value={store}>
      <AddTodo />
      <hr />
      <Paginator />
      <TodoList />
      <Footer />
    </AppStateProvider.Provider>
  )
}

export default App
