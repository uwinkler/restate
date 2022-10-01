import { create } from '@restate/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// We create our app state and hooks like this:

type State = {
  user: {
    name: string
    age: number
  }
  queries: {
    // todos: UseQueryResult<string[], any>
  }
}

const { useAppState, useNext, store, createActions } = create<State, any>({
  state: {
    user: {
      name: 'John',
      age: 32
    },
    queries: {
      // todos: {}
    }
  }
})

function getTodos() {
  return Promise.resolve([1, 2, 3])
}

const queryClient = new QueryClient()
const useUserActions = createActions('UserActions', (store) => {
  return {
    setName: (nextName: string) => {
      store.next((s) => {
        s.user.name = nextName
      })
    },
    setAge: (nextAge: number) => {
      store.next((s) => {
        s.user.age = nextAge
      })
    }
  }
})

export function HelloActions() {
  const [name, setName] = useAppState((s) => s.user.name)
  const [age, setAge] = useAppState((s) => s.user.age)

  return (
    <QueryClientProvider client={queryClient}>
      <h1>Hello {name}!</h1>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <input value={age} onChange={(e) => setAge(Number(e.target.value))} />
    </QueryClientProvider>
  )
}
