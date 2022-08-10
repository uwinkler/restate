import { useAppState } from './store'
import { filter } from './filter'

export function useCountVisibleTodos() {
  return useAppState((state) => {
    const visibility = state.visibility
    const visibleTodos = filter(state.todos, visibility)
    return visibleTodos.length
  })
}
