import * as React from "react"
import Link from "gatsby-link"
import { DefaultLayout } from "../layouts"
import { Code } from "../components/code"
import { Divider, Button } from "@material-ui/core"
import { TT } from "../components/TT"

interface IndexPageProps {
  location: any
}

// hTTps://stackblitz.com/edit/react-rx-state-middleware-logger?file=index.tsx

const logger = `// Simple logger middleware
//
function connectLogger(store: RxStore<any>) {
  store.state$
       .pipe(pairwise())
       .subscribe( props => {
          const [oldState, newState] = props;
          console.log('State changed: ', 
            JSON.stringify(oldState), ' -> ', JSON.stringify(newState)
          );
        })
}

connectLogger(store);

store.next(s => {
  s.name = "John Targaryen"
})

// Console output will be:
// State changed: {"name":"John Snow"} -> {"name":"John Targaryen"}`

const nextDemo = `store.next(s => {
  s.name = "John Targaryen"
})`

const createStore = `interface State {
  name: string
}

const store = createStore<State>({
  state: {
    name: 'John Snow',
  }, 
  // options are optional 
  options: {
    storeName: 'AppStore', // usefull if multiple stores are used
    freeze: process.env.NODE_ENV !== 'production' // freezes the state 
  }
})`

export default (props: IndexPageProps) => {
  return (
    <DefaultLayout title="Store" path={props.location.pathname}>
      <p>
        The store is the central instance and keeps the state in a{" "}
        <TT>RxJS.BehaviourSubject</TT>.
      </p>
      <h2> Create</h2>
      Create a store with the <TT>createStore()</TT> function:
      <Code code={createStore} />
      <h2>Read Access</h2>
      <p>Outside of a react component you can access the state via:</p>
      <ul>
        <li>
          <TT>RxStore.state</TT> property,
        </li>
        <li>
          or the <TT>RxStore.state$</TT> observable
        </li>
      </ul>
      <h3>
        <TT>RxStore.state</TT> property
      </h3>
      <p>
        The <TT>store.state</TT> property gives you the current state. It is a
        shorthand version of <TT>store.state$.value</TT> and mainly used in
        tests.
      </p>
      <Code
        code={`console.log('Name is: ', store.state.name)`} // Output: "Name is: John Snow"
      />
      <h3>
        <TT>RxStore.state$</TT> observable
      </h3>
      <p>
        The state is stored in a <TT>RxJS.BehaviourSubject</TT>. You can acccess
        the state using the value attribute:
      </p>
      <Code code={`console.log('Name is: ', store.state$.value.name)`} />
      <p>
        Since it is an <TT>RxJS.BehaviourSubject</TT> you can use all the
        <TT>RxJS</TT> goodies as well. For example, you could write a simple
        logging middleware, that loggs the old and the new state, like this:
      </p>
      <Code code={logger} />
      <p />
      <h2>Write Access</h2>
      <p>
        The next state can be pushed with the <TT>RxStore.next</TT> function.
      </p>
      <Code code={nextDemo} />
      <p>
        Internaly, <a href="https://github.com/immerjs/immer">immer.js</a> is
        used and allows you to work with immutable state in a more convenient
        way. Therefore, you should NOT use the internal{" "}
        <TT>RxStore.state$.next</TT> method, since this will by-pass some
        features to the internal state management, such as middleware,
        meta-infos, patches, etc.
      </p>
      <p>
        However, the immer rules to modify the state apply. For example,{" "}
        <TT> store.next(s => s.name = "John Targaryen") </TT> will throw an
        error:
        <blockquote>
          An immer producer returned a new value *and* modified its draft.
          Either return a new value *or* modify the draft.
        </blockquote>
        To avoid such an error, wrap your code in currly braces or return a new
        state object:
        <Code
          code={`store.next( s => { s.name = 'John Targaryen'})
// or
store.next( () => { name: 'John Targaryen'})`}
        />
      </p>
      <p />
      <Divider style={{ marginTop: 30 }} />
      <p>
        <Button>
          <Link to="/page-2/">Next: your first store</Link>
        </Button>
      </p>
    </DefaultLayout>
  )
}
