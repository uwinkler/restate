import { createNextHook, createProvider, createStateHook, createStore } from '@restate/core'
import { connectDevTools } from '@restate/dev-tools'

export const PAGE_SIZE = 10

export interface Todo {
  id: string
  title: string
  done: boolean
}

export type Visibility = 'all' | 'done' | 'open'

interface State {
  todos: Todo[]
  visibility: Visibility
  page: number
}

export const store = createStore<State, any>({
  state: {
    todos: [],
    visibility: 'all',
    page: 0
  }
})

const manyTodos: Todo[] = []

for (let i = 0; i < 1_000_000; i++) {
  manyTodos.push({
    id: '' + i,
    title: 'Task #' + i,
    done: false
  })
}

store.next((s) => {
  s.todos = manyTodos
})

if (process.env.NODE_ENV === 'development') {
  store.state$.subscribe((s) => console.log(s.state))
  connectDevTools(store)
}

export const AppStateProvider = createProvider(store)
export const useAppState = createStateHook(AppStateProvider, (state) => state)
export const useNextAppState = createNextHook(AppStateProvider, (state) => state)

export const useTodos = createStateHook(AppStateProvider, (state) => state.todos)
