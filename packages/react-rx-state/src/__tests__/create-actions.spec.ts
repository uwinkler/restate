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

const mainViewActionsFactory = (props: ActionFactoryProps<MainView>) => ({
  hello: (greetings: string) => hello(greetings, props)
})

const mainViewActions = Rx.connectActions(
  store,
  mainViewActionsFactory,
  state => state.view.main
)

it("should update store", () => {
  expect(store.state.view.main.hello).toEqual("world")
  mainViewActions.hello("rx-state")
  expect(store.state.view.main.hello).toEqual("rx-state")
  expect(myOtherStore.state.view.main.hello).toEqual("world")
})

export default {}
