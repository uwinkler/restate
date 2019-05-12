import * as React from "react"
import Link from "gatsby-link"
import { DefaultLayout } from "../layouts"
import { Code } from "../components/code"
import { Divider, Button } from "@material-ui/core"

interface IndexPageProps {
  location: any
}

const npmInstall = `$ npm install react-rx-state --save`

const yarnInstall = `$ yarn add react-rx-state`

export default (props: IndexPageProps) => {
  return (
    <DefaultLayout title="Installation" path={props.location.pathname}>
      <p>To install react-rx-state you need use either NPM or YARN:</p>
      <h5>with NPM:</h5>
      <Code code={npmInstall} lang="bash" />

      <h5>with YARN:</h5>
      <Code code={yarnInstall} lang="bash" />
      <Divider style={{ marginTop: 30 }} />
      <p>
        <Button>
          <Link to="/page-2/">Next: your first store</Link>
        </Button>
      </p>
    </DefaultLayout>
  )
}
