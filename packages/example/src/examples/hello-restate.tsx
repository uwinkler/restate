import { create } from '@restate/core'

// We use the `create` function to create our app state
//  and a hook `useAppState` to access the state:
const { useAppState } = create({
  state: {
    message: 'Hello restate'
  }
})

export function HelloRestate() {
  // Use the hook to access the state and get
  // a setter function `setMessage` to update the state.
  //
  // You know, just like the `useState` hook does. Nice, right?  🤩
  const [message, setMessage] = useAppState((state) => state.message)

  return (
    <>
      <h1>Hello {message}!</h1>
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
    </>
  )
}
