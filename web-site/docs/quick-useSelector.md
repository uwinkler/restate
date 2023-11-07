# useSelector Hook

The `create` function also returns another hook, the `useSelector` hook.

In a lot of cases you want to display the value only. Or you want to compute a value from the state.
In those cases, you can use the `useSelector` hook, since it is more performant than the `useAppState` hook and
only re-renders when the computed value changes.

<<< @/../../packages/example/src/examples/hello-selector.tsx

Use `useSelector` if you only want to display the value or compute a value from the state.
