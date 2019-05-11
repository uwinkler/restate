import React from "react"
import {
  createMuiTheme,
  MuiThemeProvider,
  CssBaseline
} from "@material-ui/core"
import {
  amber,
  deepPurple,
  orange,
  blueGrey,
  deepOrange
} from "@material-ui/core/colors"

export const theme = createMuiTheme({
  palette: {
    primary: deepOrange,
    secondary: deepPurple
  }
})

export const AppTheme: React.FC = props => (
  <>
    <CssBaseline />
    <MuiThemeProvider theme={theme}>{props.children}</MuiThemeProvider>
  </>
)
