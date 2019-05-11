import * as React from "react"
import Link from "gatsby-link"
import { DefaultLayout } from "../layouts"

interface IndexPageProps {
  location: any
}

export default (props: IndexPageProps) => {
  return (
    <DefaultLayout title="Index" path={props.location.pathname}>
      <div>
        <h1>Hi people</h1>
        <p>Welcome to your</p>
        <p>Now go build something great.</p>
        <Link to="/page-2/">Go to page 2</Link>
      </div>
    </DefaultLayout>
  )
}
