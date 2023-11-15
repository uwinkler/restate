---
title: Store
---

# Store

The store is the central instance and keeps the immutable state in a `RxJS.BehaviourSubject`.

You can have more than one state in your application. See the chapter <Link to="/multiple-stores">Multiple Stores</Link>.

## Create a store

You create a store with the `createStore()` function:

```tsx
interface State {
  name: string
}

const store = createStore<State>({
  state: {
    name: 'John Snow'
  },
  middleware: [loggerMiddleware],
  options: {
    storeName: 'AppStore',
    freeze: true
  }
})
```

The `createStore()` function takes a property object, with

- `state`: The initial state to make sure that every store is proper initialized. The initial state is required.
- `middleware` (optional): a set of <Link to="middleware">middleware</Link> functions.
- `options` (optional):
  - `storeName`: A name for the store. Useful to identify a store if you use <Link to="/multiple-stores">multiple stores</Link>.
  - `freeze`: If set to `true` this protects against accidental modifications of the state. However, this comes with a performance impact. It is recommended to set this option to `false` in production.

## Store.state

You can read the state of the store (outside of a react component) with the `store.state` property:

```tsx
const store = createStore<State>({
  state: {
    name: 'John Snow'
  }
})
console.log(store.state.name) // logs 'John Snow'
```

## Store.next()

Use the `store.next()` function to update the store.

```tsx
store.next((state) => {
  state.name = 'John Targaryen'
})
```

The `store.next()` provides the current state, which you can modify.

Internally, <a href="https://github.com/immerjs/immer">immer.js</a> is
used and allows you to work with the immutable state in a more convenient
way. The immer rules to modify the state apply. For example, this will
throw an error:

```tsx
// Error!
store.next(s => s.name = "John Targaryen")`

```

<blockquote>
  An immer producer returned a new value *and* modified its draft.
  Either return a new value *or* modify the draft.
</blockquote>
To avoid such an error, wrap your code in curly braces or return a new
state object:

```tsx
// immer style - imperative
store.next( state => { state.name = "John Targaryen"} )

// immer style - return an object (state will be replaced, not merged)
store.next(() => ({name: "John Targaryen" , age: 32})

// or using destructing
store.next(state => ({ ...state, name: "John Targaryen"}))

// next also takes an object as argument (state will be replaced, not merged)
store.next({name: "John Targaryen", age: 32})
```

---

## Observable `store.state$`

The state is hold by an <a href="http://reactivex.io/rxjs/manual/overview.html#behaviorsubject">`RxJS.BehaviourSubject`</a>

This make it very easy for connectors to observe and react to state changes:

```tsx
// Simple logger connector
function connectLogger(store: RxStore<any>) {
  store.state$.pipe(pairwise()).subscribe((props) => {
    const [oldState, newState] = props
    console.log(
      'State:',
      JSON.stringify(oldState.payload),
      ' -> ',
      JSON.stringify(newState.payload)
    )
  })
}

connectLogger(store)

store.next((s) => {
  s.name = 'John Targaryen'
})
store.next((s) => {
  s.name = 'Bran Stark'
})

// Console output:
// State: {"name":"John Snow"} -> {"name":"John Targaryen"}
// State: {"name":"John Targaryen"} -> {"name":"Bran Stark"}
```

In this example, `connectLogger` subscribes to the `state$` observable
and takes the states in pairs (old and new) using <a href="https://rxjs-dev.firebaseapp.com/api/operators/pairwise" target="rxjs_pairwise">RxJS's pairwise operator</a>.

---

## Observable `store.messageBus$`

Sometimes it is convenient to send a message (or action in redux terms) to a connector and let the connector do all the hard work.

This is particular true with long running or complex operations, async operations or in case where several different parts
of the application have to react to a specific event.

For those use-cases the `store.messageBus$` observable comes in handy.

A good example would be the log-in/log-out of a user.

```tsx
// Connector to perform a login
function connectLoginAction(store: RxStore<State>) {
  store.messageBus$.subscribe(async msg => {
      // Note: this is an an async function and updates the state twice
    if (msg.type === 'LOGIN') {
      // Activate busy indicator
      store.next(state => { state.waiting = true })

      // Login the user. This is async operation and will take a second..
      const { user, password } = msg.payload;.
      await apiLoginUser(user, password)

      // Login done. Deactivate busy indicator and set the current user
      store.next(state => {
        state.waiting = false;
        state.user = user
      })
    }
  })
}

connectLoginAction(store)

const useDispatch = createDispatchHook(AppStoreProvider);

const Login = () => {
  const [id, setId] = React.useState('')
  const [password, setPassword] = React.useState('')
  const dispatch = useDispatch();

  function login() {
    dispatch({ type: 'LOGIN', payload: { user: id, password } })
  }

  return(
    ...
    <button onClick={login} >Log-In</button>
  )

```

---

Full example on https://stackblitz.com/edit/hello-restate
