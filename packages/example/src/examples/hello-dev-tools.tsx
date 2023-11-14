import { create } from '@restate/core'
import { connectDevTools } from './connectDevTools'

//
// 1 get the store object from the create function
//
const { useAppState, store } = create({
  state: {
    message: 'Hello restate'
  },
  options: {
    // 2: Optional: Set the store name. That makes it easier to find
    // the store in the Restate DevTools if you have multiple stores.
    storeName: 'hello-dev-tools'
  }
})

store.state$.subscribe((update) => console.log('state', update))

//
// 3: connect the store to the Restate DevTools.
//
connectDevTools(store)

export function HelloDevTools() {
  //
  // 4: Optional: you may use the trace option to give the update a name
  // in the Restate DevTools. This is optional, but it makes
  // it easier to find the update in the DevTools.
  //
  const [message, setMessage] = useAppState((state) => state.message, {
    trace: 'setMessage'
  })

  return (
    <>
      <h1>{message}!</h1>
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
    </>
  )
}
