import { create } from '@restate/core'

// We create our app state and a hook to access the state:
const { useAppState, useNext } = create({
  state: {
    name: 'restate'
  }
})

export function HelloWorld() {
  const [name, setName] = useAppState((state) => state.name)
  // useNext((s) => s.name)

  return (
    <>
      <input value={name} onChange={(e) => setName(e.target.value)} />
    </>
  )
}
