import React from "react"
import { TodoListItem } from "./TodoListItem"
import { useVisibleTodos } from "./use-visible-todos"

export const TodoList: React.FC = () => {
  const todos = useVisibleTodos()

  return (
    <ul>
      {todos.map(todo => (
        <TodoListItem key={todo.id} todo={todo} />
      ))}
    </ul>
  )
}
