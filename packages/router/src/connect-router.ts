import { RxStore } from '@restate/core'
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

export function connectReactRouter<
  S extends WithConnectReactRouterState
>(props: { appStore: RxStore<S>; history: History }) {
  const { appStore, history } = props
  const currentLocation = props.history.location

  const initState = appStore.state.location.state

  appStore.next((state) => {
    state.location = currentLocation as any
    state.location.state = initState
  })

  history.listen((update) => {
    const { location } = update
    appStore.next((state) => {
      state.location = Object.assign(state.location, location)
    })
  })
}
