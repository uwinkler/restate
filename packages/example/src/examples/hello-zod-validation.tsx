import { Grid } from '@mui/material'
import { Middleware, create } from '@restate/core'
import { z } from 'zod'

//
// Step 1: Define a schema for the state
//
const stateSchema = z.object({
  user: z.object({
    name: z.string(),
    age: z.number().min(0).max(150)
  })
})

//
// Step2: Infer the state type from the schema, so we can use it in the app and middleware
//
type State = z.infer<typeof stateSchema>

// Step3: Write a simple middleware that throws an ZodError if the next state is invalid.
// Throwing an exception will cancel the state update.
//
// Instead of throwing an error, you may also modify
// the `nextState` state here, if you want to.
//
const validateMiddlewareWithZod: Middleware<State> = ({ nextState }) => {
  stateSchema.parse(nextState)
}

const { useAppState, useSelector, store } = create<State>({
  state: {
    user: {
      name: 'John',
      age: 32
    }
  },
  middleware: [validateMiddlewareWithZod] // use the middleware
})

function Name() {
  const name = useSelector((state) => state.user.name)
  return <h1>Hello {name}!</h1>
}

function ChangeName() {
  const [name, setName] = useAppState((state) => state.user.name)

  return (
    <>
      <label>Name:</label>
      <input value={name} onChange={(e) => setName(e.target.value)} />
    </>
  )
}

function ChangeAge() {
  const [age, setAge] = useAppState((state) => state.user.age)

  return (
    <>
      <label>Age:</label>
      <input value={age} onChange={(e) => setAge(Number(e.target.value))} />
    </>
  )
}

export function HelloZodValidation() {
  return (
    <>
      <Name />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.5rem',
          maxWidth: '200px'
        }}
      >
        <ChangeName />
        <ChangeAge />
      </div>
    </>
  )
}
