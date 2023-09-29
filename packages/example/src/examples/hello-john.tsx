import { Middleware, create } from '@restate/core'

const { useAppState, useSelector, store } = create({
  state: {
    user: {
      name: 'John',
      age: 32
    }
  }
})

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

export function HelloJohn() {
  return (
    <>
      <Name />
      <Age />
      <ChangeName />
      <ChangeAge />
    </>
  )
}
