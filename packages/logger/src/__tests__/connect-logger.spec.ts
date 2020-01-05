import { createStore } from "@restate/core"
import { connectLogger } from ".."

it("should connect the logger", () => {
  const log = jest.spyOn(global.console, "log")
  // const groupCollapsed = jest.spyOn(global.console, "groupCollapsed")

  const store = createStore({
    state: {
      a: 1
    },
    options: { dev: true }
  })

  connectLogger(store, { printStack: true })

  store.next(s => {
    s.a = 2
  })

  //
  //
  //

  expect(log.mock.calls[0]).toEqual(["State: ", { a: 1 }])
  expect(log.mock.calls[1]).toEqual([
    "Message: ",
    { type: "@Restate/Core/Init" }
  ])
  expect(log.mock.calls[2]).toEqual(["Source :", []])

  expect(log.mock.calls[6]).toEqual(["Source :", []])
})
