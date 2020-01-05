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
  INIT = "Restate/Router/Init",
  POP = "Restate/Router/Pop",
  PUSH = "Restate/Router/Push"
}

interface RestateRouterInitMessage extends Message {
  type: RestateRouterMessageType.INIT
}

interface RestateRouterPopMessage extends Message {
  type: RestateRouterMessageType.POP
}

interface RestateRouterPushMessage extends Message {
  type: RestateRouterMessageType.PUSH
}

export type RestateRouterMessage =
  | RestateRouterInitMessage
  | RestateRouterPopMessage
  | RestateRouterPushMessage

const RESTATE_ROUTER_INIT_MESSAGE: RestateRouterInitMessage = {
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
  }, RESTATE_ROUTER_INIT_MESSAGE as any)

  history.listen((location, action) => {
    appStore.next(
      state => {
        state.location = Object.assign(state.location, location)
      },
      { type: "Restate/Router/" + action } as any
    )
  })
}
