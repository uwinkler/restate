/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import React from 'react'
import { act } from 'react-test-renderer'
import { createNextHook } from '../create-next-hook'
import { createProvider } from '../create-provider'
import { createStateHook } from '../create-state-hook'
import { createStore } from '../create-store'

it('should update a state', async () => {
  const state = { value: 1 }
  const store = createStore({ state })
  const AppStoreProvider = createProvider(store)
  const useAppState = createStateHook(AppStoreProvider)
  const useNextAppState = createNextHook(AppStoreProvider)

  const TestComponent: React.FC = () => {
    const x = useAppState((s) => s)

    const nextAppState = useNextAppState((s) => s)

    function increment() {
      nextAppState((s) => {
        s.value = s.value + 1
      })
    }

    return (
      <button className="btn" onClick={increment}>
        {x.value}
      </button>
    )
  }

  const { container } = render(
    <AppStoreProvider.Provider value={store}>
      <TestComponent />
    </AppStoreProvider.Provider>
  )
  expect(container.firstChild).toMatchInlineSnapshot(`
    <button
      class="btn"
    >
      1
    </button>
  `)

  act(() => {
    const btn = screen.getByText('1')
    btn.click()
  })

  process.nextTick(() => {
    expect(store.state.value).toEqual(2)
    expect(container.firstChild).toMatchInlineSnapshot(`"<button class=\\"btn\\">2</button>"`)
  })
})

it('should update selected properties', () => {
  const state = { value: 1 }
  const store = createStore({ state })
  const AppStoreProvider = createProvider(store)
  const useAppStore = createStateHook(AppStoreProvider)
  const useAppStoreUpdate = createNextHook(AppStoreProvider)

  const TestComponent: React.FC = () => {
    const value = useAppStore((s) => s.value)
    const nextStore = useAppStoreUpdate((s) => s)

    function increment() {
      nextStore((s) => {
        s.value = s.value + 1
      })
    }

    return (
      <button className="btn" onClick={increment}>
        {value}
      </button>
    )
  }

  const { container } = render(
    <AppStoreProvider.Provider value={store}>
      <TestComponent />
    </AppStoreProvider.Provider>
  )

  expect(container.firstChild).toMatchInlineSnapshot(`
    <button
      class="btn"
    >
      1
    </button>
  `)

  act(() => {
    const btn = screen.getByText('1')
    btn.click()
  })

  process.nextTick(() => {
    expect(store.state.value).toEqual(2)
    expect(container.firstChild).toMatchInlineSnapshot(`"<button class=\\"btn\\">2</button>"`)
  })
})

it('should update a scoped state', () => {
  const state = { subState: { value: 1 } }
  const store = createStore({ state })
  const AppStoreProvider = createProvider(store)
  const useAppState = createStateHook(AppStoreProvider)
  const useNextAppState = createNextHook(AppStoreProvider, (state) => state.subState)

  const TestComponent: React.FC = () => {
    const x = useAppState((s) => s)

    const nextAppState = useNextAppState((s) => s)

    function increment() {
      nextAppState((s) => {
        s.value = s.value + 1
      })
    }

    return (
      <button className="btn" onClick={increment}>
        {x.subState.value}
      </button>
    )
  }

  const { container } = render(
    <AppStoreProvider.Provider value={store}>
      <TestComponent />
    </AppStoreProvider.Provider>
  )

  expect(container.firstChild).toMatchInlineSnapshot(`
    <button
      class="btn"
    >
      1
    </button>
  `)

  act(() => {
    const btn = screen.getByText('1')
    btn.click()
  })

  process.nextTick(() => {
    expect(store.state.subState.value).toEqual(2)
    expect(container.firstChild).toMatchInlineSnapshot(`"<button class=\\"btn\\">2</button>"`)
  })
})
