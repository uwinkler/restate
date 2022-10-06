import { useServiceRegistry } from '@restate/di'
import React from 'react'

export function Dashboard() {
  const registry = useServiceRegistry()

  React.useEffect(() => {
    registry.getRegistryObservable().subscribe((v) => {
      console.log(v)
    })
  }, [registry])

  return <h1>Dashboard</h1>
}
