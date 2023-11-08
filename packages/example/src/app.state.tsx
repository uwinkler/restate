import { Middleware, create } from '@restate/core'
import { z } from 'zod'
import { connectDevTools } from './examples/connectDevTools'
import { HelloSelectorAndNext } from './examples/hello-next'
import { HelloRestate } from './examples/hello-restate'
import { HelloStores } from './examples/hello-stores'
import { HelloZodValidation } from './examples/hello-zod-validation'
import React from 'react'
import { HelloUseAppState } from './examples/hello-use-app-state'
import { HelloUseSelector } from './examples/hello-use-selector'
import { HelloMiddleware } from './examples/hello-middleware'

const AppNameSchema = z.union([
  z.literal('hello-useAppState'),
  z.literal('hello-useSelector'),
  z.literal('hello-useNext'),
  z.literal('hello-stores'),
  z.literal('hello-middleware'),
  z.literal('hello-zod-validation')
])

type AppName = z.infer<typeof AppNameSchema>

export const EXAMPLES_MAP = {
  'hello-useAppState': <HelloUseAppState />,
  'hello-useSelector': <HelloUseSelector />,
  'hello-useNext': <HelloSelectorAndNext />,
  'hello-stores': <HelloStores />,
  'hello-middleware': <HelloMiddleware />,
  'hello-zod-validation': <HelloZodValidation />
}

export const EXAMPLE_NAMES = Object.keys(EXAMPLES_MAP) as AppName[]

const appStateSchema = z.object({
  exampleApp: AppNameSchema
})

export type AppState = z.infer<typeof appStateSchema>

const validateMiddlewareWithZod: Middleware<AppState> = ({ nextState }) =>
  appStateSchema.parse(nextState)

export const { useAppState, store, useSelector } = create<AppState>({
  state: {
    exampleApp: 'hello-useAppState'
  },
  middleware: [validateMiddlewareWithZod]
})

connectDevTools(store)
