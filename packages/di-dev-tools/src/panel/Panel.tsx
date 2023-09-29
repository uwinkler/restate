import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { Box, Button, CssBaseline, styled } from '@mui/material'
import React, { ReactNode } from 'react'
import { Editor } from './editor'
import { useAppState } from './state'
import { useMessage } from './use-message'

function Stores() {
  const [stores] = useAppState((s) => s.stores)
  return <h1>{stores.length}</h1>
}

const Layout = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: '100%'
})

export function Panel(): ReactNode {
  const { postMessage } = useMessage()

  return (
    <>
      <CssBaseline />
      <Layout>
        <Button
          id="restate"
          onClick={() => postMessage({ type: 'get-all-store-updates' })}
        >
          Refresh
        </Button>
        <Editor />
      </Layout>
    </>
  )
}
