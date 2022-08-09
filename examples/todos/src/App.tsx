import { AddTodo } from './AddTodo'
import './App.css'
import { Footer } from './Footer'
import { Paginator } from './Paginator'
import { AppStateProvider, store } from './store'
import { TodoList } from './TodoList'

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
