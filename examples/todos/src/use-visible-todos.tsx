import { filter } from './filter'
import { PAGE_SIZE, Todo, useAppState } from './store'

function paginate(todos: Todo[], page: number) {
  const start = page * PAGE_SIZE
  const end = page * PAGE_SIZE + PAGE_SIZE
  return todos.slice(start, end)
}

export function useVisibleTodos() {
  const todos = useAppState((state) => state.todos)
  const page = useAppState((state) => state.page)
  const visibility = useAppState((state) => state.visibility)
  const visibleTodos = filter(todos, visibility)
  return paginate(visibleTodos, page)
}
