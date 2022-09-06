## NextHook

NextHooks are hooks to change the state within React components.

## Basic Usage

```ts lines=5,8,11 src=https://stackblitz.com/edit/restate-hello-world
const store = createStore({
  state: { name: 'John Doe' }
})

const useNextAppState = createNextHook(AppStoreProvider)

const Hello: React.FC = () => {
  const next = useNextAppState((state) => state)

  function setName(e) {
    next((state) => (state.name = e.target.value))
  }

  return <input value={name} onChange={setName} />
}
```

If you want to simplify and unify the access to portion of your states you utilize a **scoped next state hook**.

#### Scoped NextState Hook

State hooks can be scoped in the same way as <Link to="/state-hook/">state-hooks</Link>.

::: info

The main purpose of _scoped next hooks_ and _next hooks selector functions_ are to help you to
organize and simplify the access to your application state.

There are no performance considerations - selector functions of next hooks are always efficient.

Unlike <Link to="/state-hook/">state-hooks</Link> selector functions, next hook selector functions
are not used to do some basic computations or transformations.

:::

```tsx lines=16,19,21
const store = createStore({
  state: {
    user: {
      name: 'John Doe',
      address: {
        street: 'Main Street',
        city: 'London'
      }
    }
  }
});

...

// scoped next hook
const useNextUser  = createNextHook(AppStoreProvider, state => state.user);

const Hello = () => {
  // it is OK to select the complete state / sub-state
  const nextUser = useNextUser(user => user);
  // for your convinces, selector functions may further scope your next hook
  const nextAddress = useNextUser(user => user.address);

  function setName(e) {
    // nextUser provides the `user` object
    nextUser(user => user.name = e.target.value);
  }

  function setStreet(e) {
    nextAddress(address => address.street = e.target.value)
  }
}
```
