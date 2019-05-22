import { useAppState, Todo, PAGE_SIZE } from "./store"
import { filter } from "./filter"

function paginate(todos: Todo[], page: number) {
  const start = page * PAGE_SIZE
  const end = page * PAGE_SIZE + PAGE_SIZE
  return todos.slice(start, end)
}

export function useVisibleTodos() {
  return useAppState(state => {
    console.log("useVisibleTodos")
    debugger
    const visible = state.visibility
    const page = state.page
    const visibleTodos = filter(state.todos, visible)
    return paginate(visibleTodos, page)
  })
}
