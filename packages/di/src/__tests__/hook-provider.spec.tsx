import React from 'react'
import renderer from 'react-test-renderer'
import { HookProvider, createInjectableHook, mock } from '../hook-provider'

const useCounter = createInjectableHook(() => {
  const count = 12
  return { count }
})

const useHello = createInjectableHook(() => {
  const { count } = useCounter()
  return 'Hello World. Count is ' + count
})

function Counter() {
  const { count } = useCounter()
  return <>Count is {count}</>
}

function Hello() {
  const message = useHello()
  return <>{message}</>
}

function useMockCounterService() {
  return { count: 0 }
}

test('it should work with HookProvider', () => {
  const Component = (
    <HookProvider>
      <Counter />
      <Hello />
    </HookProvider>
  )

  const container = renderer.create(Component)

  expect(container.toJSON()).toMatchInlineSnapshot(`
    [
      "Count is ",
      "12",
      "Hello World. Count is 12",
    ]
  `)
})

test('it should work without a HookProvider', () => {
  const Component = (
    <>
      <Counter />
      <Hello />
    </>
  )

  const container = renderer.create(Component)

  expect(container.toJSON()).toMatchInlineSnapshot(`
    [
      "Count is ",
      "12",
      "Hello World. Count is 12",
    ]
  `)
})

test('it should work with a mock', () => {
  const Component = (
    <HookProvider hooks={[mock(useCounter, useMockCounterService)]}>
      <Counter />
      <Hello />
    </HookProvider>
  )

  const container = renderer.create(Component)

  expect(container.toJSON()).toMatchInlineSnapshot(`
    [
      "Count is ",
      "0",
      "Hello World. Count is 0",
    ]
  `)
})

test('it should work with scope', () => {
  const Component = (
    <>
      <HookProvider hooks={[mock(useCounter, useMockCounterService)]}>
        <Counter />
      </HookProvider>
      <Hello />
    </>
  )

  const container = renderer.create(Component)

  expect(container.toJSON()).toMatchInlineSnapshot(`
    [
      "Count is ",
      "0",
      "Hello World. Count is 12",
    ]
  `)
})

test('it should work nested provider', () => {
  const Component = (
    <HookProvider>
      <HookProvider hooks={[mock(useCounter, useMockCounterService)]}>
        <Counter />
        <Hello />
      </HookProvider>
    </HookProvider>
  )

  const container = renderer.create(Component)

  expect(container.toJSON()).toMatchInlineSnapshot(`
    [
      "Count is ",
      "0",
      "Hello World. Count is 0",
    ]
  `)
})

test('it should work nested provider', () => {
  const Component = (
    <HookProvider hooks={[mock(useCounter, useMockCounterService)]}>
      <HookProvider>
        <Counter />
        <Hello />
      </HookProvider>
    </HookProvider>
  )

  const container = renderer.create(Component)

  expect(container.toJSON()).toMatchInlineSnapshot(`
    [
      "Count is ",
      "0",
      "Hello World. Count is 0",
    ]
  `)
})

test('it should work nested provider and reset the hook to null', () => {
  const Component = (
    <HookProvider hooks={[mock(useCounter, useMockCounterService)]}>
      <HookProvider hooks={[mock(useCounter, null as any)]}>
        <Counter />
        <Hello />
      </HookProvider>
    </HookProvider>
  )

  const container = renderer.create(Component)

  expect(container.toJSON()).toMatchInlineSnapshot(`
    [
      "Count is ",
      "12",
      "Hello World. Count is 12",
    ]
  `)
})

test('it should work nested provider and reset the hook to null', () => {
  const Component = (
    <HookProvider hooks={[mock(useCounter, useMockCounterService)]}>
      <HookProvider
        hooks={[
          mock(useHello, () => {
            return 'Servus'
          })
        ]}
      >
        <Counter />
        <Hello />
      </HookProvider>
    </HookProvider>
  )

  const container = renderer.create(Component)

  expect(container.toJSON()).toMatchInlineSnapshot(`
    [
      "Count is ",
      "0",
      "Servus",
    ]
  `)
})
