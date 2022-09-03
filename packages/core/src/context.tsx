import React from 'react'

export function context<T, C>(
  contextFactory: (config?: C) => T
): [
  // The return type of the created ContextProvider
  (props: { children?: React.ReactNode; config?: C; context?: (config?: C) => T }) => JSX.Element,
  // The return type of the created useContext hook
  () => T
] {
  const Ctx = React.createContext<T>(null as unknown as T)

  function CtxProvider(props: {
    children?: React.ReactNode
    config?: C
    context?: (config?: C) => T // useful for testing
  }) {
    const { context, children, config } = props
    const ctx = context ? context(config) : contextFactory(config)
    return <Ctx.Provider value={ctx}>{children}</Ctx.Provider>
  }

  function useCtx() {
    const ctx = React.useContext(Ctx)
    if (!ctx) {
      throw new Error(
        `context: this component should be wrapped by a ContextProvider provided by: ontext(${contextFactory.name}). For more information see: https://daily.color.grld.eu/lxo-blocks-storybook/?path=/story/utilities-context--page`
      )
    }
    return ctx
  }

  return [CtxProvider, useCtx]
}
