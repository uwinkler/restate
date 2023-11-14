import { RestateStore, create } from '@restate/core'
import {
  debounceTime,
  distinctUntilChanged,
  map,
  pairwise,
  startWith
} from 'rxjs/operators'

const { store } = create({
  state: {
    user: {
      name: 'John',
      age: 32
    }
  }
})

// Out
// Using the `next` method to update the state
// in an imperative way. Please note, that
// the state is immutable, but we are using immer
// under the hood to make it look like it is mutable.
store.next((state) => {
  state.user.name = 'Jane'
})

// Using the `next` method to update the state,
// setting the new state directly
store.next({
  user: {
    name: 'Jane',
    age: 25
  }
})

// Accessing the state and just reading the current value
console.log(store.state)

// Restate uses RxJS under the hood. So we can
// accessing the state using the state$ observable
// like this:
store.state$.subscribe((state) => console.log(state))

// ... and with RxJs we can do some cool stuff,
// like this:
//
store.state$

  .pipe(
    map((update) => update.state), // the update object contains the state
    map((state) => state.user.name), // select the name
    distinctUntilChanged(), // only emit when the name changes
    debounceTime(1000), // wait 1s before emitting
    pairwise() // emit the previous and the next name
  )
  .subscribe(([previousName, nextName]) =>
    console.log(`${previousName} -> ${nextName}`)
  )
