import { Middleware, create } from '@restate/core'
import { connectDevTools } from './examples/connectDevTools'
import { z } from 'zod'

const AppNameSchema = z.union([
  z.literal('hello-restate'),
  z.literal('hello-useAppState'),
  z.literal('hello-useSelector'),
  z.literal('hello-useNext'),
  z.literal('hello-store'),
  z.literal('hello-middleware'),
  z.literal('zod-validation')
])

type AppName = z.infer<typeof AppNameSchema>

const appStateSchema = z.object({
  exampleApp: AppNameSchema
})

export type AppState = z.infer<typeof appStateSchema>

const validateMiddlewareWithZod: Middleware<AppState> = ({ nextState }) =>
  appStateSchema.parse(nextState)

export const { useAppState, store } = create<AppState>({
  state: {
    exampleApp: 'hello-restate'
  },
  middleware: [validateMiddlewareWithZod]
})

connectDevTools(store)
