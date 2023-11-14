import { ServiceHook, ServiceRegistry, createService } from '@restate/di'
import React from 'react'
import Odometer from 'react-odometerjs'
import { connectServiceDevTools } from './connectServiceDevTools'
import './odometer.css'

const WINNING_NUMBERS = [111, 222, 333, 444, 555, 666, 777, 888, 999]

const [useSlotMachine, SlotMachineService] = createService(
  'slot-machine',
  () => {
    const [value, setValue] = React.useState(random())

    function next() {
      const nextNumbers = random()
      setValue(nextNumbers)
      if (WINNING_NUMBERS.includes(nextNumbers)) {
        setTimeout(() => {})
      }
    }

    function random() {
      return Math.floor(Math.random() * 900) + 100
    }

    return { value, next }
  }
)

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
  const { value } = useSlotMachine()
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
    return { value: 333, next: () => {} }
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
