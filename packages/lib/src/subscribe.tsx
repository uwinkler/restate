import { map, distinctUntilChanged } from 'rxjs/operators'
import { RxStore } from './rx-store'

export type SelectorFunction<S, T> = (state: S) => T

export type MountPointSelector<S> = (nextState: S) => void

export function subscribe<APP_STATE>(store: RxStore<APP_STATE>) {
  return {
    select: function<SUB_STATE>(selectorFunction: SelectorFunction<APP_STATE, SUB_STATE>) {
      return {
        mount: (mount: MountPointSelector<SUB_STATE>) => {
          return store.state$
            .pipe(
              map(selectorFunction),
              distinctUntilChanged(),
            )
            .subscribe(nextState => {
              mount(nextState)
            })
        },
      }
    },
  }
}
