import { create } from '@restate/core'

// We create our app state and a hook to access the state:
const { useAppState, useSelector, useNext } = create({
  state: {
    name: 'restate'
  }
})

export function HelloSelector() {
  const nameInUpperCase = useSelector((s) => s.name.toLocaleUpperCase())
  const [name, setName] = useAppState((s) => s.name)

  return (
    <>
      <h1>Hello {nameInUpperCase}!</h1>
      <input value={name} onChange={(e) => setName(e.target.value)} />
    </>
  )
}
