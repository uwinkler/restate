import { Location, History } from "history"
import { RxStore } from "react-rx-state"

export interface WithConnectReactRouterState<LocationState> {
  location: Location<LocationState>
}

export const defaultRouterState = {
  pathname: "",
  search: "",
  state: undefined as any,
  hash: ""
}

const INIT = "HISTORY/INIT"

export function connectReactRouter<
  LocationStateType,
  S extends WithConnectReactRouterState<LocationStateType>
>(props: { appStore: RxStore<S>; history: History<any> }) {
  const { appStore, history } = props
  const currentLocation = props.history.location

  const initState = appStore.state.location.state

  appStore.next(
    state => {
      state.location = currentLocation as any
      state.location.state = initState
    },
    { type: INIT }
  )

  history.listen((location, action) => {
    appStore.next(
      state => {
        state.location = Object.assign(state.location, location)
      },
      { type: "HISTORY/" + action }
    )
  })
}
