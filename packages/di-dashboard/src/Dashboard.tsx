import { useServiceRegistry } from '@restate/di'
import React from 'react'

export function Dashboard() {
  const registry = useServiceRegistry()

  React.useEffect(() => {
    return registry.getRegistryObservable().subscribe((x) => console.log(x))
  }, [registry])

  return <h1>Dashboard</h1>
}
