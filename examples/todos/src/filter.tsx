import { Visibility, Todo } from './store'

export function filter(todos: Todo[], visible: Visibility) {
  switch (visible) {
    case 'all':
      return todos
    case 'done':
      return todos.filter((todo) => todo.done)
    case 'open':
      return todos.filter((todo) => !todo.done)
  }
}
