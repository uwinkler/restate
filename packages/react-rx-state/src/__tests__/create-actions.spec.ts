import * as Rx from "../index"
import { ActionFactoryProps } from "../connect-actions"

type MainView = {
  hello: string
}

const defaultMainView = { hello: "world" }

type AppState = {
  view: {
    main: MainView
  }
}

const defaultAppState: AppState = {
  view: {
    main: defaultMainView
  }
}

const store = Rx.createStore({ state: defaultAppState })
const myOtherStore = Rx.createStore({ state: defaultAppState })

function hello(greetings: string, { next }: ActionFactoryProps<MainView>) {
  next(state => (state.hello = greetings))
}

function upperCase({ next, state }: ActionFactoryProps<MainView>) {
  const nextGreetings = state().hello.toUpperCase()
  next(state => (state.hello = nextGreetings))
}

const mainViewActionsFactory = (props: ActionFactoryProps<MainView>) => ({
  hello: (greetings: string) => hello(greetings, props),
  upperCase: () => upperCase(props)
})

const mainViewActions = Rx.connectActions(
  store,
  state => state.view.main,
  mainViewActionsFactory
)

it("should update store", () => {
  expect(store.state.view.main.hello).toEqual("world")
  mainViewActions.hello("rx-state")
  expect(store.state.view.main.hello).toEqual("rx-state")
  mainViewActions.upperCase()
  expect(store.state.view.main.hello).toEqual("RX-STATE")
  expect(myOtherStore.state.view.main.hello).toEqual("world")
})
