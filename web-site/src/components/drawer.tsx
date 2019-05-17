import AppBar from "@material-ui/core/AppBar"
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft"
import ChevronRightIcon from "@material-ui/icons/ChevronRight"
import classNames from "classnames"
import Divider from "@material-ui/core/Divider"
import Drawer from "@material-ui/core/Drawer"
import IconButton from "@material-ui/core/IconButton"
import MenuIcon from "@material-ui/icons/Menu"
import React from "react"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import { Logo } from "./logo"
import { makeStyles } from "@material-ui/styles"
import { Navigation } from "./navigation"
import { theme } from "../layouts/theme"
import { useAppState, useUpdateAppState } from "../state/state"

const drawerWidth = 340
const appBarHeight = 83

const useClasses = makeStyles({
  root: {
    display: "flex"
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    height: appBarHeight,
    display: "flex",
    justifyContent: "center"
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20
  },
  hide: {
    display: "none"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: "0 8px",
    justifyContent: "center"
  },
  content: {
    flexGrow: 1,
    padding: 8 * 3,
    marginLeft: -drawerWidth,
    marginTop: 83
  },
  contentShift: {
    marginLeft: 0
  },
  logoContainer: {
    padding: 20,
    flexDirection: "column",
    display: "flex"
  }
})

interface PersistentDrawerLeftProps {
  title: string
  path: string
}

export const PersistentDrawerLeft: React.FC<
  PersistentDrawerLeftProps
> = props => {
  console.log(props)
  const classes = useClasses()

  const open = useAppState(s => s.drawerOpen)
  const setOpen = useUpdateAppState(s => s)

  function handleDrawerOpen() {
    setOpen(s => {
      s.drawerOpen = true
    })
  }

  function handleDrawerClose() {
    setOpen(s => {
      s.drawerOpen = false
    })
  }

  return (
    <nav className={classes.root}>
      <AppBar
        elevation={0}
        // style={{ background: "white" }}
        position="fixed"
        className={classNames(classes.appBar, {
          [classes.appBarShift]: open
        })}
      >
        <Toolbar disableGutters={!open}>
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            onClick={handleDrawerOpen}
            className={classNames(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" noWrap>
            {props.title}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.drawerHeader}>
          <div className={classes.logoContainer}>
            <Logo style={{ marginBottom: 0 }} />
          </div>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        {/* <Divider /> */}
        <Navigation path={props.path} />
      </Drawer>

      <main
        className={classNames(classes.content, {
          [classes.contentShift]: open
        })}
      >
        {props.children}
      </main>
    </nav>
  )
}