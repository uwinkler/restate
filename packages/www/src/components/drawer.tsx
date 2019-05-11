import AppBar from "@material-ui/core/AppBar"
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft"
import ChevronRightIcon from "@material-ui/icons/ChevronRight"
import classNames from "classnames"
import CssBaseline from "@material-ui/core/CssBaseline"
import Divider from "@material-ui/core/Divider"
import Drawer from "@material-ui/core/Drawer"
import IconButton from "@material-ui/core/IconButton"
import InboxIcon from "@material-ui/icons/MoveToInbox"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import MailIcon from "@material-ui/icons/Mail"
import MenuIcon from "@material-ui/icons/Menu"
import React from "react"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import { Logo } from "./logo"
import { makeStyles, useTheme } from "@material-ui/styles"
import { theme } from "../layouts/theme"
import { useAppState, useUpdateAppState } from "../state/state"
import { Link } from "gatsby"

const drawerWidth = 340

const useClasses = makeStyles({
  root: {
    display: "flex"
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
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
    marginLeft: -drawerWidth
  },
  contentShift: {
    marginLeft: 0
  },
  logoContainer: {
    padding: 20,
    flexDirection: "column",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  activeLink: {
    color: theme.palette.primary.main
    // backgroundColor: "green"
  },
  listItem: {
    "& a": {
      color: theme.palette.text.primary + " !important"
      // background: "red"
    }
  },

  link: {
    textDecoration: "none"
    // color: theme.palette.text.primary
    // "&:visited": {
    // color: theme.palette.text.primary
    // }
  }
})

const PageLink: React.FC<{ to: string; title: string }> = props => {
  const classes = useClasses()
  return (
    <ListItem className={classes.listItem}>
      <Link
        id={props.to}
        className={classes.link}
        to={props.to}
        // activeStyle={{ color: theme.palette.primary.main }}
      >
        {props.title}
      </Link>
    </ListItem>
  )
}

const Navigation: React.FC = () => {
  return (
    <List>
      <PageLink to="/" title="Main" />
      <PageLink to="/page-2/" title="Page 2" />
    </List>
  )
}

interface PersistentDrawerLeftProps {
  title: string
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
        <Divider />
        <Navigation />
      </Drawer>
      <main
        className={classNames(classes.content, {
          [classes.contentShift]: open
        })}
      >
        <div className={classes.drawerHeader} />
        {props.children}
      </main>
    </nav>
  )
}
