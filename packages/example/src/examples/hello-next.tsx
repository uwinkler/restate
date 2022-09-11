import { create } from '@restate/core'

// We create our app state and a hook to access the state:
const { useAppState, useSelector } = create({
  state: {
    name: 'restate'
  }
})

function HelloUpperCase() {
  const nameInUpperCase = useSelector((s) => s.name.toLocaleUpperCase())
  return <h1>Hello {nameInUpperCase}!</h1>
}

function HelloInput() {
  const [name, setName] = useAppState((s) => s)

  const onChange = (nextName: string) =>
    setName((s) => {
      s.name = nextName
    })

  return (
    <input
      value={name.name}
      type="range"
      onChange={(e) =>
        setName((s) => {
          s.name = e.target.value
        })
      }
    />
  )
}

export function HelloSelectorAndNext() {
  return (
    <>
      <HelloUpperCase />
      <HelloInput />
    </>
  )
}
