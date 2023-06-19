import { create } from '@restate/core'

// We create our app state and a hook to access the state:
const { useAppState } = create({
  state: {
    user: {
      name: 'Klaus',
      age: 12
    }
  }
})

export function HelloWorld() {
  const [name, setName] = useAppState((state) => state.user.name)
  const [age, setAge] = useAppState((state) => state.user.age)

  return (
    <>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <input value={age} onChange={(e) => setAge(Number(e.target.value))} />
    </>
  )
}
