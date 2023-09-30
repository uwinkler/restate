import { Middleware, create } from '@restate/core'

import { z } from 'zod'
import { connectDevTools } from './connectDevTools'

const StateSchema = z.object({
  user: z.object({
    name: z.string(),
    age: z.number().min(0).max(150)
  })
})

type State = z.infer<typeof StateSchema>

const validateMiddlewareWithZod: Middleware<State> = ({ nextState }) =>
  StateSchema.parse(nextState)

const { useAppState, useSelector, store } = create<State>({
  state: {
    user: {
      name: 'John',
      age: 32
    }
  },

  middleware: [validateMiddlewareWithZod], // use the middleware
  trace: 'Init',
  options: { storeName: 'Examples/DevTools' }
})

store.next((s) => {
  s.user.age = 33
}, 'INIT_2')

connectDevTools(store)

const { useAppState: useOtherAppState, store: otherStore } = create({
  state: { otherName: '' },
  trace: 'Init',
  options: { storeName: 'Examples/OtherStore' }
})

connectDevTools(otherStore)

function Name() {
  const name = useSelector((state) => state.user.name)
  return <h1>Hello {name}!</h1>
}

function Age() {
  const ageInDays = useSelector((state) => state.user.age * 365)
  return <div>You are {ageInDays} days old.</div>
}

function ChangeName() {
  const [name, setName] = useAppState((state) => state.user.name, {
    trace: 'ChangeName'
  })
  const handleChange = (nextName: string) => setName(nextName)

  return <input value={name} onChange={(e) => handleChange(e.target.value)} />
}

function ChangeOtherName() {
  const [name, setName] = useOtherAppState((state) => state.otherName, {
    trace: 'ChangeOtherName'
  })
  const handleChange = (nextName: string) => setName(nextName)

  return <input value={name} onChange={(e) => handleChange(e.target.value)} />
}

function ChangeAge() {
  const [age, setAge] = useAppState((state) => state.user.age, {
    trace: 'ChangeAge'
  })

  return <input value={age} onChange={(e) => setAge(Number(e.target.value))} />
}

export function DevTools() {
  return (
    <>
      <Name />
      <Age />
      <ChangeName />
      <ChangeAge />
      <hr />
      <ChangeOtherName />
    </>
  )
}
