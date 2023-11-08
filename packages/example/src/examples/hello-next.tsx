import { create } from '@restate/core'

const { useAppState, useSelector, useNext } = create({
  state: {
    user: {
      name: 'John',
      age: 32
    }
  }
})

function Greeting() {
  const greeting = useSelector((s) =>
    s.user.age < 30 ? `Hi ${s.user.name}` : `God day Sir`
  )

  return <h1> {greeting}!</h1>
}

function AgeInput() {
  const [age, setAge] = useAppState((s) => s.user.age)
  return (
    <input
      value={age}
      type="number"
      onChange={(e) => setAge(Number(e.target.value))}
    />
  )
}

function ResetAgeButton() {
  const setAge = useNext((s) => s.user.age)
  return (
    <>
      <button onClick={() => setAge(32)}>Reset age to 32</button>
      <button onClick={() => setAge(20)}>Reset age to 20</button>
    </>
  )
}

export function HelloSelectorAndNext() {
  return (
    <div className="layout">
      <Greeting />
      <AgeInput />
      <ResetAgeButton />
    </div>
  )
}
