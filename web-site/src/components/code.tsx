import Prism from "prismjs"
import React from "react"
import { Card, CardContent, Tooltip } from "@material-ui/core"

import WarningIcon from "@material-ui/icons/Warning"
import { makeStyles, ThemeProvider } from "@material-ui/styles"
import { theme } from "../layouts/theme"

// import "prismjs/themes/prism-coy.css"
// import "prismjs/themes/prism-dark.css"
// import "prismjs/themes/prism-funky.css"
// import "prismjs/themes/prism-okaidia.css"
// import "prismjs/themes/prism-solarizedlight.css"
import "prismjs/themes/prism-tomorrow.css"
// import "prismjs/themes/prism-twilight.css"
// import "prismjs/themes/prism.css"

require("prismjs/components/prism-typescript")
require("prismjs/components/prism-bash")

const stackBlitzLogo = require("./stack-blitz.jpg")

const cobald = "rgb(40, 44, 52)"

const useClasses = makeStyles({
  codeContent: {
    padding: 16,
    backgroundColor: cobald,
    color: theme.palette.grey[300]
  },
  card: {
    borderRadius: 8,
    // padding: 20,
    // backgroundColor: cobald,
    marginTop: 3 * theme.spacing.unit,
    marginBottom: 3 * theme.spacing.unit
  },
  warn: {
    padding: theme.spacing.unit,
    color: theme.palette.error.dark,
    display: "flex",
    alignItems: "center"
  },
  cardHeader: {
    display: "flex",
    alignItems: "center"
  },
  stackBlitzImg: {
    height: 24,
    widht: 24,
    position: "relative",
    top: -24,
    borderRadius: 2
  },
  stackblitz: {
    display: "flex",
    flexDirection: "row-reverse",
    height: 0,
    widht: "100%"
  }
})

type Language = "typescript" | "javascript" | "bash"

interface CodeProps {
  code?: string
  lang?: Language
  variant?: "default" | "warn" | "err"
  title?: string
  src?: string
}

const Warn: React.FC<{ title: string }> = props => {
  const classes = useClasses()
  return (
    <div className={classes.warn}>
      <WarningIcon style={{ marginRight: 8 }} />
      {props.title}
    </div>
  )
}

const Stackblitz: React.FC<{ src: string }> = props => {
  const classes = useClasses()

  return (
    <div className={classes.stackblitz}>
      <Tooltip title="Open in StackBlitz">
        <a href={props.src} target={props.src}>
          <img className={classes.stackBlitzImg} src={stackBlitzLogo} />
        </a>
      </Tooltip>
    </div>
  )
}

export const Code: React.FC<CodeProps> = props => {
  const code: string = props.code ? props.code : props.children.toString()
  const lang = props.lang ? props.lang : "typescript"
  const variant = props.variant || "default"
  const title = props.title || ""

  const classes = useClasses()
  const html = Prism.highlight(
    code,
    Prism.languages[lang], //[props.lang],
    lang
  )

  return (
    <Card elevation={13} className={classes.card}>
      <div className={classes.cardHeader}>
        {variant === "warn" ? <Warn title={title} /> : null}
      </div>
      <div className={classes.codeContent}>
        <pre>
          <code
            className="content"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </pre>
        {props.src ? <Stackblitz src={props.src} /> : null}
      </div>
    </Card>
  )
}
