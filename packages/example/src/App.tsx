import React from 'react'
import './App.css'
import { HelloService } from './examples/hello-service'
import { ExampleSwitch } from './example-switch'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { EXAMPLES_MAP, useAppState, useSelector } from './app.state'

function Layout(props: React.PropsWithChildren) {
  return <Box>{props.children}</Box>
}

function Header() {
  return (
    <Grid container padding={1} alignItems={'center'}>
      <Grid item padding={1} sx={{ marginRight: 2 }}>
        <h1>Restate Examples</h1>
      </Grid>
      <Grid item>
        <ExampleSwitch />
      </Grid>
    </Grid>
  )
}

function App() {
  const exampleApp = useSelector((s) => s.exampleApp)
  return (
    <Layout>
      <Header />
      {EXAMPLES_MAP[exampleApp]}
    </Layout>
  )
}

export default App
