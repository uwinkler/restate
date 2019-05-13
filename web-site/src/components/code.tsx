import Prism from "prismjs"
import React from "react"
import { Card, CardContent } from "@material-ui/core"
// import "prismjs/themes/prism.css"
import "prismjs/themes/prism-okaidia.css"

import { makeStyles } from "@material-ui/styles"
import { theme } from "../layouts/theme"

require("prismjs/components/prism-typescript")
require("prismjs/components/prism-bash")

const cobald = "#002240"

const useClasses = makeStyles({
  codeContent: {
    backgroundColor: cobald,
    color: theme.palette.grey[300]
  },
  card: {
    borderRadius: 12
  }
})

type Language = "typescript" | "javascript" | "bash"

interface CodeProps {
  code: string
  lang?: Language
}

export const Code: React.FC<CodeProps> = props => {
  const lang = props.lang ? props.lang : "typescript"
  const classes = useClasses()
  const html = Prism.highlight(
    props.code,
    Prism.languages[lang], //[props.lang],
    lang
  )
  return (
    <Card elevation={8} className={classes.card}>
      <CardContent className={classes.codeContent}>
        <pre>
          <code
            className="content"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </pre>
      </CardContent>
    </Card>
  )
}
