import * as React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import Helmet from 'react-helmet'
import { PersistentDrawerLeft } from '../components/drawer'
import { AppStateProvider } from '../state/state'
import './index.css'
import { AppTheme } from './theme'
import { Footer } from '../components/footer'
import '@fontsource/signika-negative'
import '@fontsource/roboto'

interface DefaultLayoutProps {
  title: string
  path: string
}

export const DefaultLayout: React.FC<DefaultLayoutProps> = (props) => {
  return (
    <AppStateProvider>
      <AppTheme>
        <CssBaseline />
        <Helmet
          title="ReState"
          meta={[
            { name: 'description', content: 'restate' },
            {
              name: 'keywords',
              content: 'react, state, management, manager, redux'
            }
          ]}
        >
          {/* <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" /> */}
          {/* <link href="https://fonts.googleapis.com/css?family=Signika+Negative" rel="stylesheet" /> */}
        </Helmet>
        <PersistentDrawerLeft path={props.path} title={props.title}>
          {props.children}
        </PersistentDrawerLeft>
        <Footer />
      </AppTheme>
    </AppStateProvider>
  )
}
