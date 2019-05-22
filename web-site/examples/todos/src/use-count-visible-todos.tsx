import { useAppState } from "./store"
import { filter } from "./filter"

export function useCountVisibleTodos() {
  return useAppState(state => {
    const visible = state.visibility
    const visibleTodos = filter(state.todos, visible)
    return visibleTodos.length
  })
}
