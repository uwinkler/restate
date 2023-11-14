# Using Zod validation and middleware

## About ZOD

ZOD is a TypeScript-first schema declaration and validation library. We can use ZOD to define a schema for our state and use ZOD to validate all state updates - to make sure the state is always in a good shape and valid.

This is especially useful during development, because it helps us to find bugs early. If for example, a server response is not in the expected format, we can detect invalid state updates early and fix the bug.

[https://github.com/colinhacks/zod]()

## Step 1: Define a schema for the state

First we have to define a schema for our state. We can use ZOD for that.

```tsx
import { Middleware, create } from '@restate/core'
import { connectDevTools } from '@restate/dev-tools'
import { z } from 'zod'

const stateSchema = z.object({
  user: z.object({
    name: z.string(),
    age: z.number().min(0).max(150)
  })
})
```

## Step 2: Infer the state type

We can ZOD to infer the state type from the schema, so we can use it in the app and middleware. Note that you have to set in tsconfig.json `strictNullChecks` to `false` to make it work.

```tsx
type State = z.infer<typeof stateSchema>
```

## Step 3: Validation Middlewar

We write a simple middleware that use the `stateSchema` to validate the `nextState`. `stateSchema` throws an ZodError if the next state is invalid. And if a middleware throws an exception, the state update will be canceled.

```tsx
const validateMiddlewareWithZod: Middleware<State> = ({ nextState }) =>
  stateSchema.parse(nextState)
```

Finally, we can use the middleware in our store:

```tsx
const { useAppState, useSelector, store } = create<State>({
  state: {
    user: {
      name: 'John',
      age: 32
    }
  },
  middleware: [validateMiddlewareWithZod]
})
```

# Example

See the full example here:

<<< @/../../packages/example/src/examples/zod-validation.tsx
