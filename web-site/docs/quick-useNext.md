# useNext Hook

If don't need to read from the store, and you only want to modify the state, you may want to use the `useNext` hook.

```tsx
function ResetButton() {
  const setAge = useNext((s) => s.age)

  return <button onClick={() => setAge(32)}>Reset</button>
}
```

The `nextHook` does not trigger a re-renders if the state changes (but the `useAppState` hook does).

## Example

<<< @/../../packages/example/src/examples/hello-next.tsx

---

Full example on https://stackblitz.com/edit/hello-restate
