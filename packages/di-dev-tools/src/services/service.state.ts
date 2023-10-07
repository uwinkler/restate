import { create } from '@restate/core'
import { z } from 'zod'

const ServiceUpdateSchema = z.object({
  id: z.string(),
  serviceId: z.string(),
  timestamp: z.number(),
  value: z.any()
})

export type ServiceUpdate = z.infer<typeof ServiceUpdateSchema>

const ServiceStateSchema = z.object({
  updates: z.array(ServiceUpdateSchema)
})

export type ServiceState = z.infer<typeof ServiceStateSchema>

export const { useAppState: useServiceState } = create<ServiceState>({
  state: { updates: [] }
})
