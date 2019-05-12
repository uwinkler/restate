import * as React from "react"
import Link from "gatsby-link"
import { DefaultLayout } from "../layouts"

const SecondPage = ({ location }: any) => (
  <DefaultLayout title={"Second page"} path={location.pathname}>
    <h1>Hi from the second page</h1>
    <p>Welcome to page 2</p>
    <Link to="/">Go back to the homepage</Link>

    <iframe
      height="500"
      width="100%"
      frameBorder="0"
      style={{ boxShadow: "0px 0px 10px 10px rgba(0,0,0,0.15)" }}
      src="https://stackblitz.com/edit/react-tke4mg?embed=1&file=index.js&hideExplorer=1"
    />
  </DefaultLayout>
)

export default SecondPage
