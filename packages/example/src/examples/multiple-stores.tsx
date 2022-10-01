import { create } from '@restate/core'

const { useAppState, useSelector, store, useNext } = create({
  state: {
    user: {
      name: 'John',
      age: 32
    }
  }
})

function Name() {
  // We select the user name from the state
  const name = useSelector((state) => state.user.name)
  return <h1>Hello {name}!</h1>
}

function Age() {
  // We select the user's `age` property from the state and convert the age in days.
  const ageInDays = useSelector((state) => state.user.age * 365)
  return <div>You are {ageInDays} days old.</div>
}

function ChangeName() {
  const [name] = useAppState((state) => state.user.name)
  const next = useNext((s) => s.user.name)
  return <input value={name} onChange={(e) => next(e.target.value)} />
}

export function MultipleStores() {
  return (
    <>
      <Name />
      <Age />
      <ChangeName />
      {/* <Todos /> */}
    </>
  )
}
