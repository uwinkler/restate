import React from "react"
import { Todo, useNextAppState } from "./store"

interface TodoListItemProps {
  todo: Todo
}
export const TodoListItem: React.FC<TodoListItemProps> = ({ todo }) => {
  const next = useNextAppState(state => state.todos)

  function toggleDone() {
    next(todos => {
      // find our todo in the future state
      const todoToChange = todos.find(t => t.id === todo.id)
      if (todoToChange) {
        todoToChange.done = !todoToChange.done
      }
    })
  }

  return (
    <li
      onClick={toggleDone}
      style={{
        textDecoration: todo.done ? "line-through" : "none"
      }}
    >
      {todo.title}
    </li>
  )
}
