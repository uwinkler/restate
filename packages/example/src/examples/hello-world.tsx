import { create } from '@restate/core'

// We create our app state and a hook to access the state:
const { useAppState } = create({
  state: {
    name: 'restate'
  }
})

export function HelloWorld() {
  const [name, setName] = useAppState((state) => state.name)

  return (
    <>
      <h1>Hello {name}!</h1>
      <input value={name} onChange={(e) => setName(e.target.value)} />
    </>
  )
}
