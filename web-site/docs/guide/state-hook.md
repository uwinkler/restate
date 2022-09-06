<!-- ---
title: App State Hook
---

import { MdxLayout } from "../layouts/mdx-layout"
import { InfoPanel, WarningPanel } from "../components/panel"
export default MdxLayout

## App State Hooks

App-State-Hoosks (or just state hooks for short) are functions used to:

- select values from the app state and provide them to a `React.FunctionComponent`
- performe some basic transformations and calculations using `Selector Functions`

## Basic Usage

```tsx lines=7,10,11 src=https://stackblitz.com/edit/restate-hello-selector-render?file=index.tsx
const store = createStore({
  state: {
    user: { name: 'John Doe', age: 32 },
    todos: 0
});

const useAppState = createStateHook(AppStoreProvider);

const Hello = () => {
  const name = useAppState(state => state.user.name)
  const todos = useAppState(state => state.todos)
}
```

- First, we create a state-hook named `useAppState` using the `createStateHook` factory function.
- This `useAppState` hook than can be used in all react components to pick properties from the state using a `selector function`, for example `state => state.user.name`. More about _selector functions_
  in the section Selector Function.

## Scoped State Hook

To simplify - and organise the access to various sub-states - you may utilize a _scoped app state hook_.

The `createStateHook` function takes a second parameter, a `scope function`, that narrows the state to the selected object.

```tsx src=https://stackblitz.com/edit/restate-hello-selector-render?file=index.tsx
const useUserState = createStateHook(AppStoreProvider, (state) => state.user)

const Hello = () => {
  const name = useUserState((state) => state.name)
}
```

In this example, the scope is narrowed to the user object of our app state.

## Selector Function

Selector functions are used to select "portions" of your application state and - if needed - apply some basic transformations or computations.

Depending on your needs you can choose between various selector function types:

- Property selector
- Transforming selector
- Computing selector
- Transforming + computing selectors
- Sub-State selector
- State selector

### Property Selector

Property selector select a single property (e.g the `name` property) from the app state. Property selectors are very
fine grain selectors and therefore very efficient selectors. You should use them most of the time.

```tsx
const name = useAppState((state) => state.name)
```

The app state hooks also takes an options object:

```tsx
{
  deps?: any[]
  compare?: (previous: State, next: State) => boolean
}
```

The `deps` is used for dependencies to memorizing the selector, in particular if your selector depends on values
that are not part of the app state.

```tsx
const [offset, setOffset] = React.useState()
const value = useAppState((todos) => todos[offset], { deps: [offset] })
```

The selector also takes a `compare` function. The `compare` function is used to decide
whether or not to update a selected value.

```tsx
// will never update the user name again
const value = useAppState((state) => state.user.name, { compare: () => false })
```

### Transforming Selector

Sometime your want to transform the app-state - or combine various app-state properties - into a single object. You can do so with a simple _transforming selector function_, which is a fancy name for a simple function that takes the app-state and returns the desired object.

```tsx
const compState = useAppState(state => ({
    userName: state.user.name
    todos: state.todos
  })
)
```

### Computing Selector

You can do basic computations as well:

```tsx src=https://stackblitz.com/edit/restate-hello-selector-render?file=index.tsx
const todosCount = useAppState((state) => state.todos.length)
const todosDone = useAppState((state) => state.todos.filter((todo) => todo.done))
const todosOpen = useAppState((state) => state.todos.filter((todo) => !todo.done))
```

Computing selectors look very "natural" with a scoped app state hook:

```tsx src=https://stackblitz.com/edit/restate-hello-selector-render?file=index.tsx
const useTodos = createStateHook(AppStoreProvider, state => state.todos);
...
const todosCount = useTodos(todos => todos.length)
const todosDone = useTodos(todos => todos.filter( todo => todo.done ))
const todosOpen = useTodos(todos => todos.filter( todo => !todo.done ))
```

Computing selectors are efficient. Your component will re-render only if the
result of the selector changes.

Take for example following snippet:

```tsx variant=warn title="Not efficient" src=https://stackblitz.com/edit/restate-hello-selector-render?file=index.tsx
const todos = useAppState((state) => state.todos)
const aLotOfWork = todos.length > 10
```

Your component will render every time `state.todos[]` changes, even if `aLotOfWork` does not change at all.

The next snippet - using a computing selector - is efficient as react renders the component only if the value of `aLotOfWork` toggles.

```tsx variant=ok title="Better" src=https://stackblitz.com/edit/restate-hello-selector-render?file=index.tsx
const aLotOfWork = useAppState((state) => state.todos.length > 10)
```

:::

### Transforming + Computing Selector

Of course you can also combine computing and transforming selectors:

```tsx src=https://stackblitz.com/edit/restate-hello-selector-render?file=index.tsx
const compState = useAppState(state => ({
  userName: state.user.name,
  aLotOfWork: state.todos.filter > 10
)}
```

### Working with Arrays

Select array entries by ID:

```
function useTodoWithId(id:string) {
  return useTodos( todos => todos.find( todo => todo.id === id))
}
```

or by index:

```
function useMyTodoAtIdx(idx:number) {
 return useTodos( todos => todos[idx])
}
```

### Sub-State Selector

Sometime it is handy to select an object from the application state if you plan to consume all of it's properties in your component.

```tsx src=https://stackblitz.com/edit/restate-hello-selector-render?file=index.tsx
const user = useAppState((state) => state.user)
// or
const { name, age } = useAppState((state) => state.user)
```

::: info

  <p style={{margin:0}}>
  If you use state or a sub-state selector, your component will render every time the sub-state changes,
  regardless if your component "consumes" all the properties of the selected object.
  </p>

<p>Consider to use <b>scoped state hook</b> and <b>property selector</b> instead:</p>

```tsx variant=ok title="Better" src=https://stackblitz.com/edit/restate-hello-selector-render?file=index.tsx
const useUserState = createStateHook(AppStoreProvider, state => state.user)
...
const name  = useUserState(userState => userState.name);
const age  = useUserState(userState => userState.age);
```

:::

### State Selector

The state selector function (identity selector) gives you access to the whole state object.

```tsx src=https://stackblitz.com/edit/restate-hello-selector-render?file=index.tsx
const appState = useAppState((state) => state)
```

<WarningPanel>
  Use state selector wisley! The component will render every time the state
  changes.
</WarningPanel> -->
