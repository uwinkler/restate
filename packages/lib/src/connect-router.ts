import { Location, History } from "history"
import { RxStore } from "./rx-store"

export interface WithConnectReactRouterState<LocationState> {
  router: {
    location: Location
    state: LocationState
  }
}

export const defaultRouterState = {
  location: {
    pathname: "",
    search: "",
    state: {},
    hash: ""
  },
  state: {}
}

const INIT = "HISTORY/INIT"

export function connectReactRouter<
  LocationStateType,
  S extends WithConnectReactRouterState<LocationStateType>
>(props: { appStore: RxStore<S>; history: History<any> }) {
  const { appStore, history } = props
  const currentLocation = props.history.location

  appStore.next(
    state => {
      state.router.location = currentLocation as any
    },
    { type: INIT }
  )

  history.listen((location, action) => {
    appStore.next(
      state => {
        state.router.location = Object.assign(state.router.location, location)
      },
      { type: "HISTORY/" + action }
    )
  })
}
