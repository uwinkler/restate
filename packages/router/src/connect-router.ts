import { Location, History } from "history"
import { RxStore, Message } from "@restate/core"

export interface WithConnectReactRouterState<LocationState> {
  location: Location<LocationState>
}

export const defaultRouterState = {
  pathname: "",
  search: "",
  state: undefined as any,
  hash: ""
}

export enum RestateRouterMessageType {
  INIT = "Restate/History/Init"
}

export interface RestateRouterInitMessage extends Message {
  type: RestateRouterMessageType.INIT
}

const initMessage: RestateRouterInitMessage = {
  type: RestateRouterMessageType.INIT
}

export function connectReactRouter<
  LocationStateType,
  S extends WithConnectReactRouterState<LocationStateType>,
  M extends Message
>(props: { appStore: RxStore<S, M>; history: History<any> }) {
  const { appStore, history } = props
  const currentLocation = props.history.location

  const initState = appStore.state.location.state

  appStore.next(state => {
    state.location = currentLocation as any
    state.location.state = initState
  }, initMessage as any)

  history.listen((location, action) => {
    appStore.next(
      state => {
        state.location = Object.assign(state.location, location)
      },
      { type: "HISTORY/" + action } as any
    )
  })
}
