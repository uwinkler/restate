import { create } from '@restate/core'

const { useAppState, useNext } = create({
  state: {
    user: {
      name: 'John',
      age: 32
    }
  }
})

function Name() {
  // We select the user name from the state
  const name = useAppState((state) => state.user.name)
  return <h1>Hello {name}!</h1>
}

function Age() {
  // We select the user's `age` property from the state and convert the age in days.
  const ageInDays = useAppState((state) => state.user.age * 365)
  return <div>You are {ageInDays} days old.</div>
}

function ChangeName() {
  // We select the user's `name` property from the state to bind it to the input field
  const name = useAppState((state) => state.user.name)

  // With the `next` function, we can change the state.
  // The state itself is immutable, but the next function produces the _next_ state (hence the name`next`)
  const next = useNext((state) => state.user)

  const handleChange = (name: string) =>
    next((user) => {
      user.name = name
    })

  return <input value={name} onChange={(e) => handleChange(e.target.value)} />
}

export function HelloWorld() {
  return (
    <>
      <Name />
      <Age />
      <ChangeName />
    </>
  )
}
