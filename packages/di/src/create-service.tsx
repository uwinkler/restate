import React from 'react'

export type Service<T> = (mock?: () => T) => (props: { children?: React.ReactNode }) => JSX.Element
export type ServiceHook<T> = () => T
export type ServiceProvider<T> = (props: { children?: React.ReactNode; implementation?: () => T }) => JSX.Element

export function createService<T>(
  name: string,
  service: () => T
): [
  // The ServiceProvider
  ServiceProvider<T>,
  // The return type of the created useContext hook
  ServiceHook<T>,
  // The react context
  React.Context<T>
] {
  const Ctx = React.createContext<T>(null as unknown as T)
  Ctx.displayName = name

  function ServiceProvider(props: { children?: React.ReactNode; implementation?: () => T }) {
    const { implementation, children } = props
    const ctx = implementation ? implementation() : service()
    return <Ctx.Provider value={ctx}>{children}</Ctx.Provider>
  }

  function useService() {
    const ctx = React.useContext(Ctx)
    if (!ctx) {
      throw new Error(`:This component should be wrapped by a ${name} service provider`)
    }
    return ctx
  }

  return [ServiceProvider, useService, Ctx]
}
