import { create, Middleware, RxStore } from '@restate/core'
import { z } from 'zod'
import { contentMessageHandler } from './content-message-handler'

const StateUpdatesSchema = z.object({
  id: z.string(),
  state: z.any(),
  store: z.string(),
  storeId: z.string(),
  trace: z.any(),
  patches: z.optional(z.array(z.any())),
  inversePatches: z.any(),
  timestamp: z.number()
})

export type Update = z.infer<typeof StateUpdatesSchema>

export const NO_UPDATE_SELECTED = 'NO_UPDATE_SELECTED'

const StateSchema = z.object({
  updates: z.array(StateUpdatesSchema),
  selectedUpdateId: z.string().default(NO_UPDATE_SELECTED),
  diffUpdateId: z.string().default(NO_UPDATE_SELECTED),
  diffMode: z.boolean()
})

export type State = z.infer<typeof StateSchema>

const INITIAL_STATE: State = {
  updates: [],
  selectedUpdateId: NO_UPDATE_SELECTED,
  diffUpdateId: NO_UPDATE_SELECTED,
  diffMode: false
}

const validationMiddleware: Middleware<State> = (update) => {
  StateSchema.parse(update.nextState)
}

export const {
  store,
  useAppState,
  useSelector,
  StateProvider,
  AppStateContext
} = create<State>({
  state: INITIAL_STATE,
  middleware: [validationMiddleware]
})

contentMessageHandler(store)
connectLogger(store)

function connectLogger(store: RxStore<State>) {
  store.state$.subscribe((update) => {
    console.log('State:', update.state)
  })
}
