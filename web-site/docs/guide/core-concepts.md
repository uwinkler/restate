# Core Concepts

ReState follows the three principles of [Redux](https://redux.js.org/introduction/three-principles):

- Single source of truth
- State is read only
- Changes are made with pure functions

#### Single source of truth

Just like `redux` the state of your whole application is stored in an object tree within a single store.

What Dan Abramov statet for `redux` holds true for restate` as well:

<blockquote>
  The state of your whole application is stored in an object tree within a
  single store. This makes it easy to create universal apps, as the state from
  your server can be serialized and hydrated into the client with no extra
  coding effort. A single state tree also makes it easier to debug or inspect an
  application; it also enables you to persist your app's state in development,
  for a faster development cycle. Some functionality which has been
  traditionally difficult to implement - Undo/Redo, for example - can suddenly
  become trivial to implement, if all of your state is stored in a single tree.
</blockquote>

#### State is read-only

The state is immutable. You will get an exception if you try to bypass `next` and modify
the state directly.

From `redux`:

<blockquote>

The only way to change the state is to emit an action, an object describing what happened.

This ensures that neither the views nor the network callbacks will ever write directly to the state.
Instead, they express an intent to transform the state. Because all changes are centralized and happen one by one
in a strict order, there are no subtle race conditions to watch out for. As actions are just plain objects,
they can be logged, serialized, stored, and later replayed for debugging or testing purposes.

</blockquote>

In `restate` you don't write actions yourself. You create actions with the `next` function.
You express the intent how you want to transform the state in an imperative way by
modifying a copy (draft) of the current state. Using immer.js, the `next` function figures how to patch
the current state.

If you want, `store.state$` is nothing else than a stream of those actions containing the patches,
which created the current state.

Of course you can write actions in a more `redux` like fashion. You can do so using
the `messageBus$` and <Link to="/glue-code">glue-code</Link>. The `messageBus$` would
dispatch the action object and the glue-code would become the equivalent of an `react` reducer, modifying
state using the `next` function.

#### Changes are made with pure functions

From `redux`:

<blockquote>
  To specify how the state tree is transformed by actions, you write pure
  reducers. Reducers are just pure functions that take the previous state and an
  action, and return the next state. Remember to return new state objects,
  instead of mutating the previous state. You can start with a single reducer,
  and as your app grows, split it off into smaller reducers that manage specific
  parts of the state tree. Because reducers are just functions, you can control
  the order in which they are called, pass additional data, or even make
  reusable reducers for common tasks such as pagination.
</blockquote>

In `restate` the equivalent of reducers are those tiny callback functions you put into `next`:

```
  store.next(state => state.name = 'John Tagaryan')
//            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//              This is your reducer function
```

Those callback function take a draft of the current state as parameter and modify the
draft to provide the intent how the next state should look like.

# What distinguishes restate from redux?

### Async actions and async flow

One of the most trickiest part of redux is to figure out how to write **asynchronous actions and reducers**.
Without middleware, (this is not possible)[https://redux.js.org/advanced/async-flow].
The community developed numerous projects to overcome this problem: (redux-hunk)[https://github.com/reduxjs/redux-thunk],
(redux-promise)[https://github.com/redux-utilities/redux-promise], or (redux-saga)[https://github.com/redux-saga/redux-saga], to name just a few of them.

Writing asynchronous code is very straight forward in `restate`.
