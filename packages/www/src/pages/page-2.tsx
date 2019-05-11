import * as React from "react"
import Link from "gatsby-link"
import { DefaultLayout } from "../layouts"

const SecondPage = ({ location }: any) => (
  <DefaultLayout title={"Second page"} path={location.pathname}>
    <h1>Hi from the second page</h1>
    <p>Welcome to page 2</p>
    <Link to="/">Go back to the homepage</Link>
  </DefaultLayout>
)

export default SecondPage
