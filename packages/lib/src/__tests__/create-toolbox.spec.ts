import * as Rx from '../index'
import { ForgeProps } from '../index'

type MainView = {
  hello: string
}

const defaultMainView = { hello: 'world' }

type AppState = {
  view: {
    main: MainView
  }
}

const defaultAppState: AppState = {
  view: {
    main: defaultMainView,
  },
}

const store = Rx.createStore({ state: defaultAppState })
const myOtherStore = Rx.createStore({ state: defaultAppState })

const forgeAppState = ({ next }: ForgeProps<MainView>) => ({
  hello(greetings: string) {
    next(state => {
      state.hello = greetings
    })
  },
})

const toolboxAppState = Rx.createToolbox(store, state => state.view.main, forgeAppState)

it('should update store', () => {
  expect(store.state.view.main.hello).toEqual('world')
  toolboxAppState.hello('rx-state')
  expect(store.state.view.main.hello).toEqual('rx-state')
  expect(myOtherStore.state.view.main.hello).toEqual('world')
})

export default {}
