import { create } from '@restate/core'

// The `create` function creates the app state
//  and a hook `useAppState` to access the state:
const { useAppState } = create({
  state: {
    message: 'Hello restate'
  }
})

export function HelloRestate() {
  // Use the hook to select a property of your state.
  // The hook will return the value and a setter function.
  //
  // You know, just like the `useState` hook does. Nice, right?  🤩
  //
  const [message, setMessage] = useAppState((state) => state.message)

  return (
    <>
      <h1>Hello {message}!</h1>
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
    </>
  )
}
