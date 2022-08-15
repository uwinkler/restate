import { useContext } from 'react'
import { Message } from './message'
import { RxStore } from './rx-store'

type AppStoreProvider<S, M extends Message> = React.Context<RxStore<S, M>>

export function createServiceFactory<S extends Object, M extends Message>(provider: AppStoreProvider<S, M>) {
  const store = useContext(provider)
}

const increment = createAction<{ type: 'Auth/Increment', value: number }>(({ msg, next , store} => {

})


