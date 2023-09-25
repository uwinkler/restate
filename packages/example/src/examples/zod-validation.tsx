import { Middleware, create } from '@restate/core'
import { connectDevTools } from '@restate/dev-tools'
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
const validateMiddlewareWithZod: Middleware<State> = ({ nextState }) =>
  stateSchema.parse(nextState)

const { useAppState, useSelector, store } = create<State>({
  state: {
    user: {
      name: 'John',
      age: 32
    }
  },
  middleware: [validateMiddlewareWithZod] // use the middleware
})

connectDevTools(store)

function Name() {
  const name = useSelector((state) => state.user.name)
  return <h1>Hello {name}!</h1>
}

function Age() {
  const ageInDays = useSelector((state) => state.user.age * 365)
  return <div>You are {ageInDays} days old.</div>
}

function ChangeName() {
  const [name, setName] = useAppState((state) => state.user.name)
  const handleChange = (nextName: string) => setName(nextName)

  return <input value={name} onChange={(e) => handleChange(e.target.value)} />
}

function ChangeAge() {
  const [age, setAge] = useAppState((state) => state.user.age)

  return <input value={age} onChange={(e) => setAge(Number(e.target.value))} />
}

export function ZodValidation() {
  return (
    <>
      <Name />
      <Age />
      <ChangeName />
      <ChangeAge />
    </>
  )
}
