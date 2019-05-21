import * as React from "react"
import CssBaseline from "@material-ui/core/CssBaseline"
import Helmet from "react-helmet"
import { AppStateProvider } from "../state/state"
import { AppTheme } from "./theme"
import { Code } from "../components/code"
import { Footer } from "../components/footer"
import { install } from "@material-ui/styles"
import { PersistentDrawerLeft } from "../components/drawer"
import "./index.css"
const { MDXProvider } = require("@mdx-js/react")

install()

interface DefaultLayoutProps {
  title: string
  path: string
  pageContext: any
}

export const MDXWrapper: React.FC = props => (
  <MDXProvider
    components={{
      inlineCode: (props: any) => <code>{props.children}</code>,
      code: (props: any) => {
        const metastring = props.metastring || ""
        let title = ""
        // console.log(props)
        if (metastring.indexOf('title="') > -1) {
          const splits = metastring.split('"')
          title = splits[1]
          // console.log(splits)
        }
        return (
          <Code
            title={title}
            variant={props.variant}
            src={props.src}
            lines={props.lines}
          >
            {props.children}
          </Code>
        )
      }
    }}
  >
    {props.children}
  </MDXProvider>
)

export const MdxLayout: React.FC<DefaultLayoutProps> = props => {
  const frontmatter = {
    path: "/",
    title: ""
  }
  const { path, title } = props.pageContext.frontmatter || frontmatter

  return (
    <AppStateProvider>
      <AppTheme>
        <CssBaseline />
        <Helmet
          title="React Rx State"
          meta={[
            { name: "description", content: "react-rx-state" },
            { name: "keywords", content: "react, state management" }
          ]}
        >
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
          />

          <link
            href="https://fonts.googleapis.com/css?family=Signika+Negative"
            rel="stylesheet"
          />
        </Helmet>
        <PersistentDrawerLeft path={path} title={title}>
          <>
            <MDXWrapper {...props} />
          </>
        </PersistentDrawerLeft>
        <Footer />
      </AppTheme>
    </AppStateProvider>
  )
}
