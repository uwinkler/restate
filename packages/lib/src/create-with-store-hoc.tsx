import React from 'react'
import { RxStore } from './rx-store'
import { Subtract } from 'utility-types'

type WithStoreHocProps<S> = React.Context<RxStore<S>>

export interface WithRxStore<S> {
  rxStore: RxStore<S>
}

export function createWithStoreHoc<STATE>(Context: WithStoreHocProps<STATE>) {
  return function withStore<P extends WithRxStore<STATE>>(Component: React.ComponentType<P>) {
    type RequiredProps = Subtract<P, WithRxStore<STATE>>
    return function WithRxStoreHoc(props: RequiredProps) {
      return <Context.Consumer>{store => <Component rxStore={store} {...props as P} />}</Context.Consumer>
    }
  }
}
