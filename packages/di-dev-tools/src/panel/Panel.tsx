import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { Button, CssBaseline } from '@mui/material'
import React from 'react'
import { useMessage } from './use-message'

export function Panel() {
  const { postMessage } = useMessage()

  return (
    <>
      <CssBaseline />
      <Button onClick={() => postMessage({ hello: 'from panel' })}>
        Message
      </Button>
    </>
  )
}
