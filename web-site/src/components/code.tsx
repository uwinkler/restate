import { Card, Tooltip } from '@material-ui/core'
import CheckIcon from '@material-ui/icons/Check'
import WarningIcon from '@material-ui/icons/Warning'
import { makeStyles } from '@material-ui/styles'
import Prism from 'prismjs'
import React, { useLayoutEffect, useRef } from 'react'
import { theme } from '../layouts/theme'

import 'prismjs/plugins/line-highlight/prism-line-highlight'
import 'prismjs/plugins/line-highlight/prism-line-highlight.css'

// import "prismjs/plugins/line-numbers/prism-line-numbers.css"
import { green, yellow } from '@material-ui/core/colors'
import 'prismjs/themes/prism-tomorrow.css'

require('prismjs/components/prism-typescript')
require('prismjs/components/prism-bash')

//@ts-ignore
import stackBlitzLogo from './stack-blitz.jpg'

const cobald = 'rgb(40, 44, 52)'

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
    color: yellow[900],
    // backgroundColor: "rgb(40, 44, 52, 0.9)",
    display: 'flex',
    flexGrow: 1,
    alignItems: 'center'
  },
  info: {
    padding: theme.spacing.unit,
    color: green[900],
    // backgroundColor: "rgb(40, 44, 52, 0.9)",
    display: 'flex',
    flexGrow: 1,
    alignItems: 'center'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center'
  },
  stackBlitzImg: {
    height: 24,
    widht: 24,
    position: 'relative',
    top: -24,
    borderRadius: 2
  },
  stackblitz: {
    display: 'flex',
    flexDirection: 'row-reverse',
    height: 0,
    widht: '100%'
  }
})

type Language = 'typescript' | 'javascript' | 'bash'

interface CodeProps {
  code?: string
  lang?: Language
  variant?: 'default' | 'warn' | 'err' | 'ok'
  title?: string
  src?: string
  lines?: string
}

const Warn: React.FC<{ title: string }> = (props) => {
  const classes = useClasses()
  return (
    <div className={classes.warn}>
      <WarningIcon style={{ marginRight: 8 }} />
      {props.title}
    </div>
  )
}

const Err: React.FC<{ title: string }> = (props) => {
  const classes = useClasses()
  return (
    <div className={classes.warn}>
      <WarningIcon style={{ marginRight: 8 }} />
      {props.title}
    </div>
  )
}

const Info: React.FC<{ title: string }> = (props) => {
  const classes = useClasses()
  return (
    <div className={classes.info}>
      <CheckIcon style={{ marginRight: 8 }} />
      {props.title}
    </div>
  )
}

const Stackblitz: React.FC<{ src: string }> = (props) => {
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

export const Code: React.FC<CodeProps> = (props) => {
  const code: string = props.code ? props.code : props.children.toString()
  const lang = props.lang ? props.lang : 'typescript'
  const variant = props.variant || 'default'
  const title = props.title || ''
  const lines = props.lines || ''

  const inputEl = useRef(null)

  const classes = useClasses()

  const html = Prism.highlight(
    code,
    Prism.languages[lang], //[props.lang],
    lang
  )

  useLayoutEffect(() => {
    Prism.hooks.run('complete', { element: inputEl.current, code })
  })

  return (
    <Card elevation={13} className={classes.card}>
      <div className={classes.cardHeader}>
        {variant === 'warn' ? <Warn title={title} /> : null}
        {variant === 'err' ? <Err title={title} /> : null}
        {variant === 'ok' ? <Info title={title} /> : null}
      </div>
      <div className={classes.codeContent}>
        <pre className="line-numbers language-typescript" style={{ position: 'relative' }} data-line={lines}>
          <code ref={inputEl} className="content" dangerouslySetInnerHTML={{ __html: html }} />
        </pre>
        {props.src ? <Stackblitz src={props.src} /> : null}
      </div>
    </Card>
  )
}
