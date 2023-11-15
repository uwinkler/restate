# Hello restate

This is `Hello World` with restate.

<<< @/../../packages/example/src/examples/hello-restate.tsx

First, we have to use the `create` function to create and initialize our store and
to obtain the `useAppState` hook.

The `useAppState` hook takes one argument, a selector function: `state => state.message`.
The selector function is used to select a property from the state,
in this example the `message` property.

The `useAppState` hook returns an array with two elements: the selected property and
a function to update the state. Just like the `useState` hook. Nice and simple. Isn't it?

And that's it (mostly)! Easy and simple.

There is an advanced example on [Stackblitz](https://stackblitz.com/edit/hello-restate?file=src%2FApp.tsx) you can play with.

---
