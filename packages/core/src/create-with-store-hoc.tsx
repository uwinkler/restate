import React from "react"
import { RxStore, Message } from "./rx-store"
import { Subtract } from "utility-types"

type WithStoreHocProps<S, M extends Message> = React.Context<RxStore<S, M>>

export interface WithRxStore<S, M extends Message> {
  rxStore: RxStore<S, M>
}

export function createWithStoreHoc<STATE, M extends Message>(
  Context: WithStoreHocProps<STATE, M>
) {
  return function withStore<P extends WithRxStore<STATE, M>>(
    Component: React.ComponentType<P>
  ) {
    type RequiredProps = Subtract<P, WithRxStore<STATE, M>>
    return function WithRxStoreHoc(props: RequiredProps) {
      return (
        <Context.Consumer>
          {store => <Component rxStore={store} {...(props as P)} />}
        </Context.Consumer>
      )
    }
  }
}
