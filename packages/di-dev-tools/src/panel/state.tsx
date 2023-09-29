import { create, RxStore } from '@restate/core'
import { z } from 'zod'
import { contentMessageHandler } from './content-message-handler'

const updatesSchema = z.array(
  z.object({
    state: z.any(),
    timestamp: z.number(),
    inversePatches: z.array(z.any()),
    patches: z.array(z.any())
  })
)

const StoreEntrySchema = z.object({
  store: z.string(),
  updates: updatesSchema
})

const StateSchema = z.object({
  stores: z.array(StoreEntrySchema)
})

export type State = z.infer<typeof StateSchema>

const INITIAL_STATE: State = {
  stores: []
}

export const {
  store,
  useAppState,
  useSelector,
  StateProvider,
  AppStateContext
} = create<State>({
  state: INITIAL_STATE
})

contentMessageHandler(store)
connectLogger(store)

function connectLogger(store: RxStore<State>) {
  store.state$.subscribe((update) => {
    console.log('State:', update.state)
  })
}
