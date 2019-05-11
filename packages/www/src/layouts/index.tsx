import * as React from "react"
import CssBaseline from "@material-ui/core/CssBaseline"
import Helmet from "react-helmet"
import Link from "gatsby-link"
import { PersistentDrawerLeft } from "../components/drawer"
import { AppStateProvider } from "../state/state"
import { ButtonAppBar } from "../components/header"
import { install } from "@material-ui/styles"
import "./index.css"
import { AppTheme } from "./theme"

install()

interface DefaultLayoutProps {
  title: string
  path: string
}

export const DefaultLayout: React.FC<DefaultLayoutProps> = props => {
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
        </Helmet>
        <PersistentDrawerLeft title={props.title}>
          {props.children}
        </PersistentDrawerLeft>
      </AppTheme>
    </AppStateProvider>
  )
}
