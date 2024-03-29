# Middleware

Middleware are small functions which intercept state updates. Middleware functions receiving the `currentState` as well as the `nextState`.
They can change the `nextState`, if required. If a middleware throws an exception, the state update will be canceled.

Take the `ageValidator` middleware for example.
It ensures, that the `user.age` property never gets negative.

```tsx
// Ensures the age will never be < 0
const ageValidator: Middleware<State> = ({ nextState, currentState }) => {
  nextState.user.age = nextState.user.age < 0 ? 0 : nextState.user.age
}

const store = createStore({
  state: {
    user: {
      name: 'John Snow',
      age: 32
    }
  },
  middleware: [ageValidator]
})

// will be intercepted by ageValidatorMin.
store.next((s) => {
  s.user.age = -1
})
```

Keep in mind:

- You should use middleware wisely. Error handling of user input should be done within React components.
- Middleware state updates have to be done in a synchronously way.
- "Traditional" middleware, like loggers, are better written using connectors.


---

Full example on https://stackblitz.com/edit/hello-restate
