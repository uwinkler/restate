import React from "react"
import { useNextAppState } from "./store"

export const AddTodo: React.FC = () => {
  const next = useNextAppState(s => s.todos)
  const [title, setTitle] = React.useState("")

  function addNewTodo() {
    next(todos => {
      const nextId = todos[todos.length - 1].id + 1
      todos.push({
        id: nextId,
        title,
        done: false
      })
    })
    setTitle("")
  }

  return (
    <>
      <input value={title} onChange={e => setTitle(e.target.value)} />
      <button onClick={addNewTodo}>Add</button>
    </>
  )
}
