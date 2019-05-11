import * as React from "react"
import Link from "gatsby-link"
import { DefaultLayout } from "../layouts"

// Please note that you can use https://github.com/dotansimha/graphql-code-generator
// to generate all types from graphQL schema
interface IndexPageProps {
  location: any
  data: {
    site: {
      siteMetadata: {
        title: string
      }
    }
  }
}

export const pageQuery = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`
export default (props: IndexPageProps) => {
  return (
    <DefaultLayout title="Index" path={props.location.pathname}>
      <div>
        <h1>Hi people</h1>
        <p>
          Welcome to your new
          <strong>{props.data.site.siteMetadata.title}</strong> site.
        </p>
        <p>Now go build something great.</p>
        <Link to="/page-2/">Go to page 2</Link>
      </div>
    </DefaultLayout>
  )
}
