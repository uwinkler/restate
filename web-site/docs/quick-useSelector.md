# useSelector Hook

The `create` function also returns another hook, the `useSelector` hook.

In a lot of cases you only want to display a value or you want to compute a display value from the state.
In those cases, you can use the `useSelector` hook, since it is bit more performant than the `useAppState` hook and
only re-renders when the computed value changes.

<<< @/../../packages/example/src/examples/hello-use-selector.tsx

Use `useSelector` if you only want to display the value or compute a value from the state.
