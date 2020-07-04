import React from "react"
import renderer from "react-test-renderer"
import { Subscription } from "rxjs"
import * as Rx from ".."
import { WithRxStore } from "../create-with-store-hoc"
import { Message } from "../message"
import { subscribe } from "../subscribe"

type AppState = {
  servus: string
}

const defaultAppState: AppState = {
  servus: "rx-state",
}

interface TestComponentState {
  greetings: string
}

const appStore = Rx.createStore({ state: defaultAppState })
const TestStoreProvider = Rx.createProvider(appStore)
const withTestStore = Rx.createWithStoreHoc(TestStoreProvider)

describe("subscribe", () => {
  test("should subscribe", () => {
    class TestComponent extends React.Component<WithRxStore<AppState, Message>, TestComponentState> {
      state = {
        greetings: "",
      }

      sub: Subscription | null = null

      componentDidMount() {
        this.sub = subscribe(this.props.rxStore)
          .select((store) => store.servus)
          .mount((nextServus) => this.setState({ greetings: nextServus }))
      }

      componentWillUnmount() {
        if (this.sub) {
          this.sub.unsubscribe()
        }
      }

      render() {
        return <div>{this.state.greetings}</div>
      }
    }

    const ConnectedComponent = withTestStore(TestComponent)

    const component = renderer.create(
      <TestStoreProvider.Provider value={appStore}>
        <ConnectedComponent />
      </TestStoreProvider.Provider>
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})

export default {} // ?
