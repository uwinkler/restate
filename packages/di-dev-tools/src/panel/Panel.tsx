import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { Box, Button, CssBaseline, styled } from '@mui/material'
import React, { ReactNode } from 'react'
import { Editor } from './editor'
import { useMessage } from './use-message'
import { UpdateList } from './update-list'
import { Toolbar } from './toolbar'
import { useSelector } from './state'
import { DiffEditor } from './diff-editor'

const Layout = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '300px 1fr',
  gridTemplateRows: 'auto 1fr',
  gridTemplateAreas: `"header header"
  "left editor"`,
  overflow: 'hidden',
  height: '100vh'
})

export function Panel(): ReactNode {
  const diffMode = useSelector((s) => s.diffMode)

  return (
    <>
      <CssBaseline />
      <Layout>
        <Toolbar />
        <UpdateList />
        {diffMode ? <DiffEditor /> : <Editor />}
      </Layout>
    </>
  )
}
