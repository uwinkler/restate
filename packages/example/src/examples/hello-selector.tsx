import { create } from '@restate/core'

// We create our app state and a hook to access the state:
const { useAppState, useSelector, useNext } = create({
  state: {
    name: 'restate'
  }
})

export function HelloSelector() {
  const nameInUpperCase = useSelector((s) => s.name.toLocaleUpperCase())
  const [name, setName] = useAppState((s) => s)

  return (
    <>
      <h1>Hello {nameInUpperCase}!</h1>
      <input
        value={name.name}
        onChange={(e) =>
          setName((s) => {
            s.name = e.target.value
          })
        }
      />
    </>
  )
}
