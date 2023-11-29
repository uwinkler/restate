import React from 'react'
import renderer, { act } from 'react-test-renderer'
import { create } from '../create'

it('should display and  update the value', async () => {
  const state = { value: 1 }
  const { useAppState, store } = create({ state })

  const TestComponent = () => {
    const [value, setValue] = useAppState((s) => s.value)

    function increment() {
      setValue(2)
    }

    return (
      <button className="btn" onClick={increment}>
        {value}
      </button>
    )
  }

  const container = renderer.create(<TestComponent />)

  expect(container.toJSON()).toMatchInlineSnapshot(`
    <button
      className="btn"
      onClick={[Function]}
    >
      1
    </button>
  `)
  container.root.findByType('button').props.onClick()
  container.update(<TestComponent />)

  expect(store.state.value).toEqual(2)
  expect(container.toJSON()).toMatchInlineSnapshot(`
    <button
      className="btn"
      onClick={[Function]}
    >
      2
    </button>
  `)
})

it('should display and  update the nested state', async () => {
  const state = { nested: { value: 1 } }
  const { useAppState, store } = create({ state })

  const TestComponent = () => {
    const [value, setValue] = useAppState((s) => s.nested.value)

    function increment() {
      setValue(2)
    }

    return (
      <button className="btn" onClick={increment}>
        {value}
      </button>
    )
  }

  const container = renderer.create(<TestComponent />)

  expect(container.toJSON()).toMatchInlineSnapshot(`
    <button
      className="btn"
      onClick={[Function]}
    >
      1
    </button>
  `)
  container.root.findByType('button').props.onClick()
  container.update(<TestComponent />)

  expect(store.state.nested.value).toEqual(2)
  expect(container.toJSON()).toMatchInlineSnapshot(`
    <button
      className="btn"
      onClick={[Function]}
    >
      2
    </button>
  `)
})

it('should use the store directly', async () => {
  const state = { nested: { value: 1 } }
  const { useStore, StateProvider, store } = create({ state })

  const Container = (props: any) => (
    <StateProvider>{props.children}</StateProvider>
  )

  const TestComponent = () => {
    const storeInComponent = useStore()

    const [value, setValue] = React.useState(
      storeInComponent.state.nested.value
    )
    React.useEffect(() => {
      const subscription = storeInComponent.state$.subscribe((update) => {
        setValue(update.state.nested.value)
      })
      return () => subscription.unsubscribe()
    })

    function increment() {
      storeInComponent.next((s) => {
        s.nested.value = 2
      })
    }

    return (
      <button className="btn" onClick={increment}>
        {value}
      </button>
    )
  }

  const App = () => (
    <Container>
      <TestComponent />
    </Container>
  )

  const container = renderer.create(<App />)

  expect(container.toJSON()).toMatchInlineSnapshot(`
    <button
      className="btn"
      onClick={[Function]}
    >
      1
    </button>
  `)

  act(() => {
    container.root.findByType('button').props.onClick()
    container.update(<TestComponent />)
  })
  expect(store.state.nested.value).toEqual(2)
  expect(container.toJSON()).toMatchInlineSnapshot(`
    <button
      className="btn"
      onClick={[Function]}
    >
      2
    </button>
  `)
})

it('should access an array via idx', async () => {
  const state = {
    todos: [
      { task: 'milk', done: false },
      { task: 'bread', done: false }
    ]
  }
  const { useAppState, store } = create({ state })

  function TodoItem({ index }: { index: number }) {
    const [item, setItem] = useAppState((s) => s.todos[index])

    return (
      <li key={index}>
        <input
          id={`checkbox-${index}`}
          type="checkbox"
          checked={item.done}
          onChange={() =>
            setItem((item) => {
              item.done = !item.done
            })
          }
        />
        {item.task}
      </li>
    )
  }

  const TestComponent = () => {
    const [todos] = useAppState((s) => s.todos)

    return (
      <ul>
        {todos.map((_, idx) => (
          <TodoItem key={idx} index={idx} />
        ))}
      </ul>
    )
  }

  const container = renderer.create(<TestComponent />)

  expect(container.toJSON()).toMatchInlineSnapshot(`
    <ul>
      <li>
        <input
          checked={false}
          id="checkbox-0"
          onChange={[Function]}
          type="checkbox"
        />
        milk
      </li>
      <li>
        <input
          checked={false}
          id="checkbox-1"
          onChange={[Function]}
          type="checkbox"
        />
        bread
      </li>
    </ul>
  `)
  act(() => {
    container.root.findByProps({ id: 'checkbox-0' }).props.onChange()
    container.update(<TestComponent />)
  })

  expect(store.state.todos[0]).toEqual({ task: 'milk', done: true })
  expect(store.state.todos[1]).toEqual({ task: 'bread', done: false })

  expect(container.toJSON()).toMatchInlineSnapshot(`
    <ul>
      <li>
        <input
          checked={true}
          id="checkbox-0"
          onChange={[Function]}
          type="checkbox"
        />
        milk
      </li>
      <li>
        <input
          checked={false}
          id="checkbox-1"
          onChange={[Function]}
          type="checkbox"
        />
        bread
      </li>
    </ul>
  `)
})

it('should access an array `find`', async () => {
  const state = {
    todos: [
      { id: 0, task: 'milk', done: false },
      { id: 1, task: 'bread', done: false }
    ]
  }
  const { useAppState, store } = create({ state })

  function TodoItem({ id }: { id: number }) {
    const [item, setItem] = useAppState(
      (s) => s.todos.find((todo) => todo.id === id)!
    )

    return (
      <li key={id}>
        <input
          id={`checkbox-${id}`}
          type="checkbox"
          checked={item.done}
          onChange={() =>
            setItem((item) => {
              item.done = !item.done
            })
          }
        />
        {item.task}
      </li>
    )
  }

  const TestComponent = () => {
    const [todos] = useAppState((s) => s.todos)

    return (
      <ul>
        {todos.map((todo) => (
          <TodoItem key={todo.id} id={todo.id} />
        ))}
      </ul>
    )
  }

  const container = renderer.create(<TestComponent />)

  expect(container.toJSON()).toMatchInlineSnapshot(`
    <ul>
      <li>
        <input
          checked={false}
          id="checkbox-0"
          onChange={[Function]}
          type="checkbox"
        />
        milk
      </li>
      <li>
        <input
          checked={false}
          id="checkbox-1"
          onChange={[Function]}
          type="checkbox"
        />
        bread
      </li>
    </ul>
  `)
  act(() => {
    container.root.findByProps({ id: 'checkbox-0' }).props.onChange()
    container.update(<TestComponent />)
  })

  expect(store.state.todos[0]).toEqual({ id: 0, task: 'milk', done: true })
  expect(store.state.todos[1]).toEqual({ id: 1, task: 'bread', done: false })

  expect(container.toJSON()).toMatchInlineSnapshot(`
    <ul>
      <li>
        <input
          checked={true}
          id="checkbox-0"
          onChange={[Function]}
          type="checkbox"
        />
        milk
      </li>
      <li>
        <input
          checked={false}
          id="checkbox-1"
          onChange={[Function]}
          type="checkbox"
        />
        bread
      </li>
    </ul>
  `)
})

it('should access items in an array deeply', async () => {
  const state = {
    todos: [
      { id: 0, task: 'milk', done: false },
      { id: 1, task: 'bread', done: false }
    ]
  }
  const { useAppState, store } = create({ state })

  function TodoItem({ id }: { id: number }) {
    const [task] = useAppState(
      (s) => s.todos.find((todo) => todo.id === id)!.task
    )

    const [done, setDone] = useAppState(
      (s) => s.todos.find((todo) => todo.id === id)!.done
    )

    return (
      <li key={id}>
        <input
          id={`checkbox-${id}`}
          type="checkbox"
          checked={done}
          onChange={() => setDone(!done)}
        />
        {task}
      </li>
    )
  }

  const TestComponent = () => {
    const [todos] = useAppState((s) => s.todos)

    return (
      <ul>
        {todos.map((todo) => (
          <TodoItem key={todo.id} id={todo.id} />
        ))}
      </ul>
    )
  }

  const container = renderer.create(<TestComponent />)

  expect(container.toJSON()).toMatchInlineSnapshot(`
    <ul>
      <li>
        <input
          checked={false}
          id="checkbox-0"
          onChange={[Function]}
          type="checkbox"
        />
        milk
      </li>
      <li>
        <input
          checked={false}
          id="checkbox-1"
          onChange={[Function]}
          type="checkbox"
        />
        bread
      </li>
    </ul>
  `)
  act(() => {
    container.root.findByProps({ id: 'checkbox-0' }).props.onChange()
    container.update(<TestComponent />)
  })

  expect(store.state.todos[0]).toEqual({ id: 0, task: 'milk', done: true })
  expect(store.state.todos[1]).toEqual({ id: 1, task: 'bread', done: false })

  expect(container.toJSON()).toMatchInlineSnapshot(`
    <ul>
      <li>
        <input
          checked={true}
          id="checkbox-0"
          onChange={[Function]}
          type="checkbox"
        />
        milk
      </li>
      <li>
        <input
          checked={false}
          id="checkbox-1"
          onChange={[Function]}
          type="checkbox"
        />
        bread
      </li>
    </ul>
  `)
})

it('should set and update objects', async () => {
  const state = {
    user: {
      name: 'John',
      age: 32
    }
  }
  const { useAppState, store } = create({ state })

  const TestComponent = () => {
    const [user, setUser] = useAppState((s) => s.user)

    return (
      <ul>
        {user.name} {user.age}
        <button id="btn" onClick={() => setUser({ name: 'Jane', age: 100 })}>
          Change
        </button>
      </ul>
    )
  }

  const container = renderer.create(<TestComponent />)

  expect(container.toJSON()).toMatchInlineSnapshot(`
    <ul>
      John
       
      32
      <button
        id="btn"
        onClick={[Function]}
      >
        Change
      </button>
    </ul>
  `)

  act(() => {
    container.root.findByType('button').props.onClick()
    container.update(<TestComponent />)
  })

  expect(store.state.user).toEqual({ name: 'Jane', age: 100 })

  expect(container.toJSON()).toMatchInlineSnapshot(`
    <ul>
      Jane
       
      100
      <button
        id="btn"
        onClick={[Function]}
      >
        Change
      </button>
    </ul>
  `)
})
