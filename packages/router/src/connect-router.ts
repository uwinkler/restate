import { Message, RxStore } from '@restate/core'
import { History, Location } from 'history'

export interface WithConnectReactRouterState {
  location: Location
}

export const defaultRouterState = {
  key: '',
  pathname: '/',
  search: '',
  hash: '',
  state: ''
}

export enum RestateRouterMessageType {
  INIT = '@restate/router/Init',
  POP = '@restate/router/Pop',
  PUSH = '@restate/router/Push'
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

export type RestateRouterMessage = RestateRouterInitMessage | RestateRouterPopMessage | RestateRouterPushMessage

const RESTATE_ROUTER_INIT_MESSAGE: RestateRouterInitMessage = {
  type: RestateRouterMessageType.INIT
}

export function connectReactRouter<S extends WithConnectReactRouterState, M extends Message>(props: {
  appStore: RxStore<S, M>
  history: History
}) {
  const { appStore, history } = props
  const currentLocation = props.history.location

  const initState = appStore.state.location.state

  appStore.next((state) => {
    state.location = currentLocation as any
    state.location.state = initState
  }, RESTATE_ROUTER_INIT_MESSAGE as any)

  history.listen((update) => {
    const { location, action } = update
    appStore.next(
      (state) => {
        state.location = Object.assign(state.location, location)
      },
      { type: '@restate/router/' + action } as any
    )
  })
}
