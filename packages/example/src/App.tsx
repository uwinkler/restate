import React from 'react'
import './App.css'
import { HelloService } from './examples/hello-service'
import { ExampleSwitch } from './example-switch'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { EXAMPLES_MAP, useAppState, useSelector } from './app.state'
import CssBaseline from '@mui/material/CssBaseline'
import { Typography } from '@mui/material'

function Layout(props: React.PropsWithChildren) {
  return <Box>{props.children}</Box>
}

function Header() {
  return (
    <Grid container padding={1} alignItems={'center'} sx={{ boxShadow: 3 }}>
      <Grid item padding={1} sx={{ marginRight: 2 }} direction={'row'}>
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 2
          }}
        >
          <img src="logo.svg" />
          <Typography variant="h5">Restate Examples</Typography>
        </Box>
      </Grid>
      <Grid item>
        <ExampleSwitch />
      </Grid>
    </Grid>
  )
}

function ExampleApp() {
  const exampleApp = useSelector((s) => s.exampleApp)
  return (
    <Box
      sx={{ margin: 2 }}
      justifyContent={'center'}
      alignItems={'center'}
      display={'flex'}
      flexDirection={'column'}
    >
      {EXAMPLES_MAP[exampleApp]}
    </Box>
  )
}

function App() {
  return (
    <>
      <CssBaseline />
      <Layout>
        <Header />
        <ExampleApp />
      </Layout>
    </>
  )
}

export default App
