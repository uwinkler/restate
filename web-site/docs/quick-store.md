# The `store`

If you need to access the store outside of a React
component tree, you can use the `store` object.

The `create` function returns the store object.

```tsx
const { store } = create({
  state: {
    user: {
      name: 'John',
      age: 32
    }
  }
})
```

The store object provides the following properties:

- `state` - the current state
- `next` - the function to update the state
- `state$` - the state observable

## Reading from the store

You can read the current state from the store using the `store.state` property:

```tsx
console.log(store.state)
```

## Updating the store

You can update the state using the `store.next` function:

```tsx
store.next({
  user: {
    name: 'John',
    age: 33
  }
})
```

...or in an imperative way:

```tsx
store.next((s) => {
  s.user.age = 33
})
```

Note: the store is immutable. You can't change the state directly. So this will not work:

```tsx
🚨 WILL NOT WORK 🚨
store.state.user.age = 33
```

## Observing the store

The store holds an RxJS observable. You can subscribe to the `store.state$` observable to get state updates.

You may want to observe the store to automatically make some server calls, log some state changes or write
some data to the local storage.

Here is a simple logger that logs name changes, but in a debounced way:

```tsx
function connectNameLogger() {
  store.state$
    .pipe(
      // the update object contains the state
      map((update) => update.state.user.name),
      // only emit when the name changes
      // and we ignore other state changes
      distinctUntilChanged(),
      // debounce for 1s
      debounceTime(1000),
      // emit the previous and the next name
      pairwise()
    )
    .subscribe(([previousName, nextName]) =>
      // log the previous and the next name
      console.log(`${previousName} -> ${nextName}`)
    )
}
```

## Example

Here is an complete example:

<<< @/../../packages/example/src/examples/connectStore.tsx
