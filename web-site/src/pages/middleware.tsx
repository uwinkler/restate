import * as React from "react"
import Link from "gatsby-link"
import { DefaultLayout } from "../layouts"
import { Code } from "../components/code"
import { Divider, Button } from "@material-ui/core"

interface IndexPageProps {
  location: any
}

export default (props: IndexPageProps) => {
  return (
    <DefaultLayout title="Middleware" path={props.location.pathname}>
      <p>
        Middleware is the code, that glues your state to other parts of your
        systems, for example a logger, remote server or local storage.
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
      <h4>Read Access</h4>
      You have five ways to access and observe the state:
      <ul>
        <li>
          Outside of a react component using the <tt>store.state</tt> property.
        </li>
        <li>
          Outside of a react component using the <tt>store.state$</tt>
          observable.
        </li>
        <li>
          Within a function component using the <tt>useStore</tt> hook.
        </li>
        <li>
          Within a function component using the <tt>useStoreObservable</tt>{" "}
          hook.
        </li>
        <li>
          Using the <tt>withStoreHoc</tt> higher-order component.
        </li>
      </ul>
      {/* <Code code={imports} />

      <h3>2. Create Store</h3>

      <Code code={createStore} />

      <h3>3. Create Provider</h3>

      <Code code={createProvider} />

      <h3>4. Create State Hook</h3>

      <Code code={createStateHook} />

      <h3>5. Create Next Hook</h3>

      <Code code={createNextHook} />

      <h3>6. Component</h3>

      <Code code={createNextHook} /> */}
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
