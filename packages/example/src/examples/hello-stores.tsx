import { create } from '@restate/core'

const { useAppState, useSelector, useNext } = create({
  state: {
    user: {
      name: 'John',
      age: 32
    }
  }
})

const { useAppState: useTodoAppState, useSelector: useTodoSelector } = create({
  state: {
    todos: [
      { id: '1', task: 'Buy milk', done: false },
      { id: '2', task: 'Buy eggs', done: true }
    ]
  }
})

function Name() {
  // We select the user name from the state
  const name = useSelector((state) => state.user.name)
  return <h1>Hello {name}!</h1>
}

function ChangeName() {
  const [name] = useAppState((state) => state.user.name)
  const next = useNext((s) => s.user.name)
  return <input value={name} onChange={(e) => next(e.target.value)} />
}

function TodoItem({ id }: { id: string }) {
  const [todo, setTodo] = useTodoAppState(
    (s) => s.todos.find((t) => t.id === id)!
  )

  return (
    <li>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={(e) =>
          setTodo((todo) => {
            todo.done = e.target.checked
          })
        }
      />
      {todo.task}
    </li>
  )
}

function Todos() {
  const [todos] = useTodoAppState((s) => s.todos)

  return (
    <>
      <h1>Todos</h1>
      <ul>
        {todos.map((todo, idx) => (
          <TodoItem key={todo.id} id={todo.id} />
        ))}
      </ul>
    </>
  )
}

export function HelloStores() {
  return (
    <div className="layout">
      <Name />
      <ChangeName />
      <Todos />
    </div>
  )
}
