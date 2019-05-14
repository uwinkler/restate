import * as React from "react"
import Link from "gatsby-link"
import { DefaultLayout } from "../layouts"
import { Code } from "../components/code"
import { Divider, Button } from "@material-ui/core"
import { TT } from "../components/tt"

interface IndexPageProps {
  location: any
}

// https://stackblitz.com/edit/react-rx-state-middleware-logger?file=index.tsx

const logger = `// Simple logger middleware
//
function connectLogger(store: RxStore<any>) {
  store.state$.pipe(pairwise()).subscribe( props => {
    const [oldState,newState] = props;
    console.log('Old state', JSON.stringify(oldState));
    console.log('New state', JSON.stringify(newState));
  })
}

connectLogger(store);

store.next(s => {
  s.name = "John Targaryen"
})

// Console output will be:
// Old state {"name":"John Snow"}
// New state {"name":"John Targaryen"}
`

const nextDemo = `store.next(s => {
  s.name = "John Targaryen"
})`

export default (props: IndexPageProps) => {
  return (
    <DefaultLayout title="Middleware" path={props.location.pathname}>
      <p>
        Middleware (or Gluecode) is the code, that glues your state to other
        parts of your systems, for example a logger, remote server or local
        storage.
      </p>
      <p>
        There are three types of middleware:
        <ul>
          <li>
            <i>Read:</i> middleware, that reads the reads the state. A logging
            middlware would be good exmaple.
          </li>
          <li>
            <i>Write:</i> middleware, that writes to your state, e.g. to update
            the application state with data from a server.
          </li>
          <li>
            <i>Read/Write:</i> a middleware, that reacts to changes of the
            application state and alters the state accordingly. An e-mail
            validator, for example, could validate the e-mail field and sets an
            error flag if the e-mail is not valid.
          </li>
        </ul>
      </p>
      <h2>Read Access</h2>
      <p>You have five ways to access and observe the state.</p>
      <p>Outside of react you can access the state via the:</p>
      <ul>
        <li>
          <TT>RxStore.state</TT> property,
        </li>
        <li>
          <TT>RxStore.state$</TT> observable
        </li>
      </ul>
      <h3>
        <TT>RxStore.state</TT> property
      </h3>
      <p>
        The <TT>store.state</TT> property gives you the current state. It is a
        shorthand version of <TT>store.state$.value</TT>
      </p>
      <Code
        code={`console.log('Name is: ', store.state.name)`} // Output: "Name is: John Snow"
      />
      <h3>
        <TT>RxStore.state$</TT> observable
      </h3>
      <p>
        The state is stored in a <TT>RxJS.BehaviourSubject</TT>. You can always
        acccess the state using the value attribute:
      </p>
      <Code code={`console.log('Name is: ', store.state$.value.name)`} />
      <p>
        Since it is an <TT>RxJS.BehaviourSubject</TT> you can use all the
        <TT>RxJS</TT> goodies as well. For example you could write a simple
        logging middleware like this:
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
        way. Therefore, you should NOT use <TT>RxStore.state$.next</TT>, since
        this will by-pass some features, such as immutable state management,
        meta-infos, etc.
      </p>

      <p>
        However, the immer rules to modify the state apply as well. For example,{" "}
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
