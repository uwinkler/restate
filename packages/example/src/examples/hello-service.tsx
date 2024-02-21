import { create } from '@restate/core'
import { ServiceRegistry, useHook } from '@restate/di'
import React from 'react'
import Odometer from 'react-odometerjs'
import { connectServiceDevTools } from './connectServiceDevTools'
import './odometer.css'

const WINNING_NUMBERS = [111, 222, 333, 444, 555, 666, 777, 888, 999]

const { useSelector, useNext } = create({
  state: {
    value: 0
  }
})

const [useSlotMachine, SlotMachineService] = useHook('slot-machine', () => {
  const setValue = useNext((state) => state.value)

  const next = React.useCallback(() => {
    setValue(Math.floor(Math.random() * 900) + 100)
  }, [])

  return { next }
})

function Layout(props: React.PropsWithChildren) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}
    >
      {props.children}
    </div>
  )
}

function SlotMachine() {
  const value = useSelector((s) => s.value)
  return (
    <Layout>
      <Odometer value={value} />
      <PlayButton />
    </Layout>
  )
}

function PlayButton() {
  const { next } = useSlotMachine()
  return (
    <button onClick={next} style={{ fontFamily: 'Rye' }}>
      Next
    </button>
  )
}

const MockSlotMachine = {
  name: 'slot-machine',
  service: () => {
    return { next: () => 333 }
  }
}

export function HelloService() {
  return (
    <ServiceRegistry name="SlotServiceRegistry" services={[SlotMachineService]}>
      <SlotMachine />
    </ServiceRegistry>
  )
}

connectServiceDevTools()
