import { create } from '@restate/core'

// We create our app state and a hook to access the state:
const { useAppState, useSelector } = create({
  state: {
    name: 'restate',
    age: 32
  }
})

function Name() {
  const nameInUpperCase = useSelector((s) => s.name.toLocaleUpperCase())
  return <h1>Hello (in uppercase): {nameInUpperCase}!</h1>
}

function Age() {
  const age = useSelector((s) =>
    s.age > 50 ? 'You are old, dude.' : 'Let`s party'
  )
  return <div>{age}</div>
}

function AgeInput() {
  const [name, setName] = useAppState((s) => s.age)
  return (
    <input
      value={name}
      type="number"
      onChange={(e) => setName(Number(e.target.value))}
    />
  )
}

function NameInput() {
  const [name, setName] = useAppState((s) => s.name)
  return <input value={name} onChange={(e) => setName(e.target.value)} />
}

export function HelloSelectorAndNext() {
  return (
    <>
      <Name />
      <Age />
      <AgeInput />
      <NameInput />
    </>
  )
}
