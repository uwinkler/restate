import * as React from "react"
import Link from "gatsby-link"
import { DefaultLayout } from "../layouts"

interface IndexPageProps {
  location: any
}

export default (props: IndexPageProps) => {
  return (
    <DefaultLayout title="Introduction" path={props.location.pathname}>
      <h1>What is react-rx-state?</h1>

      <p>React-rx-state is application state-mangement for practionairs .</p>
      <Link to="/page-2/">Go to page 2</Link>
    </DefaultLayout>
  )
}
