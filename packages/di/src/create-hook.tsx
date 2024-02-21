import React from 'react'

export type ServiceHook<A, T> = (...args: A[]) => T
export type RegisterHook<A, T> = (name: string, hook: ServiceHook<A, T>) => void
export type RestoreHook = () => void
export type UseMock = (name: string) => void

export type Options = {
  isDev?: boolean
}

export function createHook<A, T>(
  hookToUse: ServiceHook<A, T>
): {
  hook: () => ServiceHook<A, T>
  registerMock: RegisterHook<A, T>
  useMock: UseMock
  restore: RestoreHook
} {
  let mockHook: ServiceHook<A, T> | null = null
  const id = crypto.randomUUID()
  const mocks = new Map<string, ServiceHook<A, T>>()

  function useService() {
    const [useHook, setUseHook] = React.useState<ServiceHook<A, T>>(
      mockHook || hookToUse
    )

    React.useEffect(() => {
      const listener = (event: MessageEvent<any>) => {
        if (event.data.id) {
          setUseHook(event.data.hook)
        }
      }

      window.addEventListener('message', listener)
      return () => window.removeEventListener('message', listener)
    })

    window.addEventListener('message', (msg) => {
      if (msg.data.id === id && msg.data.type === 'restate-use-mock') {
        mockHook = mocks.get(msg.data.name) || hookToUse
        setUseHook(mockHook)
      }

      if (msg.data.id === id && msg.data.type === 'restate-restore-hook') {
        mockHook = null
        setUseHook(hookToUse)
      }
    })

    return useHook
  }

  function registerMock(name: string, hook: ServiceHook<A, T>) {
    mocks.set(name, hook)
  }

  function useMock(name: string) {
    window.postMessage({
      id,
      type: 'restate-use-mock',
      name
    })
  }

  function restore() {
    window.postMessage({
      id,
      type: 'restate-restore-hook'
    })
    mockHook = null
  }

  return { hook: useService, registerMock, useMock, restore }
}
