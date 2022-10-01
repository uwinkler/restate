import React from 'react'
import { BehaviorSubject, Observable } from 'rxjs'
import { distinctUntilChanged } from 'rxjs/operators'

export type ServiceObservable<T> = Observable<T | null>

export type Service<T> = (
  mock?: () => T
) => (props: { children?: React.ReactNode }) => JSX.Element
export type ServiceHook<T> = () => T
export type ServiceProvider<T> = (props: {
  children?: React.ReactNode
  implementation?: () => T
}) => JSX.Element

export function createService<T>(
  name: string,
  service: () => T
): [
  // The ServiceProvider
  ServiceProvider<T>,
  // The return type of the created useContext hook
  ServiceHook<T>,
  // The observable context
  ServiceObservable<T>,
  // The react context
  React.Context<T>
] {
  const Ctx = React.createContext<T>(null as unknown as T)
  const ctxObserverInternal$ = new BehaviorSubject<T | null>(null)

  Ctx.displayName = name

  function ServiceProvider(props: {
    children?: React.ReactNode
    id?: string
    implementation?: () => T
  }) {
    const { implementation, children } = props
    const ctx = implementation ? implementation() : service()

    return <Ctx.Provider value={ctx}>{children}</Ctx.Provider>
  }

  function useService() {
    const ctx = React.useContext(Ctx)
    if (!ctx) {
      throw new Error(
        `This component should be wrapped by a ${name} service provider`
      )
    }
    ctxObserverInternal$.next({ ctx } as any)
    return ctx
  }

  const ctxObservable$ = ctxObserverInternal$.pipe(
    distinctUntilChanged(
      (oldCtx, newCtx) => JSON.stringify(oldCtx) === JSON.stringify(newCtx)
    )
  )

  // We attach the ctx observable to the ServiceProvider so
  // we can have an easy to use `connectDevTools(ServiceProvider)` API.
  //
  // We could use the exported ctxObservable$ but - you know ...
  //
  ServiceProvider.ctxObservable$ = ctxObservable$
  ServiceProvider.displayName = name

  return [ServiceProvider, useService, ctxObservable$, Ctx]
}
