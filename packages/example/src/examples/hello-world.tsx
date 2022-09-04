import { create } from '@restate/core'

// We create our app state and state hooks like this:
const { useAppState, useNext } = create({
  state: {
    name: 'restate'
  }
})

export function HelloWorld() {
  // Select the `name` property
  // from the current state
  const name = useAppState((state) => state.name)

  // The `next` function helps to
  // produce the next state.
  const next = useNext((state) => state)

  const setName = (name: string) =>
    next((state) => {
      state.name = name
    })

  return (
    <>
      <h1>Hello {name}!</h1>
      <input value={name} onChange={(e) => setName(e.target.value)} />
    </>
  )
}
