import {
  createStore,
  createProvider,
  createStateHook,
  createNextHook
} from "@restate/core"
import { connectDevTools } from "@restate/dev-tools"

export const PAGE_SIZE = 10

export interface Todo {
  id: number
  title: string
  done: boolean
}

export type VisibilityFiler = "all" | "done" | "open"

interface State {
  todos: Todo[]
  visibility: VisibilityFiler
  page: number
}

export const store = createStore<State>({
  state: {
    todos: [],
    visibility: "all",
    page: 0
  },
  options: {
    freeze: false
  }
})

const manyTodos: Todo[] = []

for (let i = 0; i < 100000; i++) {
  manyTodos.push({
    id: i,
    title: "Task #" + i,
    done: false
  })
}

store.next(s => {
  s.todos = manyTodos
})

store.state$.subscribe(s => console.log(s.payload))

export const AppStateProvider = createProvider(store)
export const useAppState = createStateHook(AppStateProvider, state => state)
export const useNextAppState = createNextHook(AppStateProvider, state => state)

export const useTodos = createStateHook(AppStateProvider, state => state.todos)
