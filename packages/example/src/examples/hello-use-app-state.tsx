import { create } from '@restate/core'

const { useAppState } = create({
  state: {
    message: 'Hello restate'
  }
})

export function HelloUseAppState() {
  const [message, setMessage] = useAppState((state) => state.message)

  return (
    <>
      <h1>{message}!</h1>
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
    </>
  )
}
