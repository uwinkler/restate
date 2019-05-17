import React from "react"
import { makeStyles } from "@material-ui/styles"
import { theme } from "../layouts/theme"
import { green } from "@material-ui/core/colors"
const { MDXProvider } = require("@mdx-js/react")

const useClasses = makeStyles({
  warn: {
    // backgroundColor: "white",
    marginTop: 30,
    marginLeft: 30,
    padding: theme.spacing.unit * 2,
    borderLeft: "3px solid" + theme.palette.primary.dark,
    // border: "1px solid" + theme.palette.primary.dark
    backgroundColor: "rgba(230, 74,25, 0.1)"
    // fontSize: "0.9rem"
  },
  info: {
    marginTop: 60,
    marginLeft: 30,
    backgroundColor: "rgba(102, 187, 106,0.1)",
    borderLeft: "3px solid" + green[400],
    padding: theme.spacing.unit * 2
  }
})

export const WarningPanel: React.FC = props => {
  const classes = useClasses()
  return (
    <div className={classes.warn}>
      <MDXProvider>{props.children}</MDXProvider>
    </div>
  )
}

export const InfoPanel: React.FC = props => {
  const classes = useClasses()
  return (
    <div className={classes.info}>
      <MDXProvider>{props.children}</MDXProvider>
    </div>
  )
}
