import { map } from "rxjs/operators"
import { createStore } from "../create-store"
import { Message } from "../rx-store"

interface MyMessage extends Message {
  type: "MyMessage"
  payload: number
}

interface MyOtherMessage extends Message {
  type: "MyOtherMessage"
  payload: string
}

interface State {
  a: number
  b: string
}

type AppMessages = MyMessage | MyOtherMessage

it("should be able to create typed  store", () => {
  const state: State = { a: 1, b: "Hello" }
  const store = createStore<State, AppMessages>({ state })

  store.state$
    .pipe(map(pack => pack.message))
    .subscribe((message: AppMessages) => {
      if (message.type === "MyMessage") {
        expect(message.payload == 1)
      }
    })

  store.dispatch({ type: "MyMessage", payload: 1 })
})
