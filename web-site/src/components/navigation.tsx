import List from "@material-ui/core/List"
import React from "react"
import { Link } from "gatsby"
import { ListItem, ListItemText, ListItemIcon } from "@material-ui/core"
import { makeStyles, getThemeProps } from "@material-ui/styles"
import { theme } from "../layouts/theme"

const useClasses = makeStyles({
  activeLink: {
    color: theme.palette.primary.main
  },
  listItem: {
    "& a": {
      color: theme.palette.text.primary + " !important"
    }
  },
  link: {
    textDecoration: "none"
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: "50px",
    backgroundColor: theme.palette.primary.main
  }
})

const Dot: React.FC = () => {
  const { dot } = useClasses()
  return <div className={dot} />
}

export const PageLink: React.FC<{
  to: string
  title: string
  variant: "default" | "inset"
  path: string
}> = props => {
  const classes = useClasses()
  return (
    <Link
      id={props.to}
      className={classes.link}
      to={props.to}
      // activeStyle={{ color: theme.palette.primary.main }}
    >
      <ListItem className={classes.listItem}>
        <ListItemIcon>
          {props.to === props.path ? (
            <Dot />
          ) : (
            <div style={{ width: 10, height: 10 }} />
          )}
        </ListItemIcon>
        <ListItemText inset={props.variant === "inset"}>
          {props.title}
        </ListItemText>
      </ListItem>
    </Link>
  )
}

interface NavigationProps {
  path: string
}

export const Navigation: React.FC<NavigationProps> = props => {
  return (
    <List>
      <PageLink
        path={props.path}
        variant="default"
        to="/"
        title="Introduction"
      />
      <PageLink
        path={props.path}
        variant="default"
        to="/page-2/"
        title="Quick Start"
      />
      <List dense>
        <PageLink
          path={props.path}
          variant="inset"
          to="/installation/"
          title="Installation"
        />
        <PageLink
          path={props.path}
          variant="inset"
          to="/first-store/"
          title="First store"
        />
        <PageLink
          path={props.path}
          variant="inset"
          to="/quick-start/"
          title="Hooks"
        />
        <PageLink
          path={props.path}
          variant="inset"
          to="/quick-start/"
          title="Actions"
        />
        <PageLink
          path={props.path}
          variant="inset"
          to="/quick-start/"
          title="Messages"
        />
      </List>

      {/* ------------ */}
      {/* Guides */}
      {/* ------------ */}

      <PageLink
        path={props.path}
        variant="default"
        to="/page-2/"
        title="Guides"
      />
      <List dense>
        <PageLink
          path={props.path}
          variant="inset"
          to="/middleware/"
          title="Middleware"
        />
        <PageLink
          path={props.path}
          variant="inset"
          to="/quick-start/"
          title="Async Actions"
        />
        <PageLink
          path={props.path}
          variant="inset"
          to="/quick-start/"
          title="Async Messages"
        />
        <PageLink
          path={props.path}
          variant="inset"
          to="/quick-start/"
          title="Multiple Stores"
        />
        <PageLink
          path={props.path}
          variant="inset"
          to="/quick-start/"
          title="Sub-Stores"
        />
        <PageLink
          path={props.path}
          variant="inset"
          to="/quick-start/"
          title="Testing"
        />
      </List>

      {/* ------------ */}
      {/* Integration */}
      {/* ------------ */}
      <PageLink
        path={props.path}
        variant="default"
        to="/page-2/"
        title="Extensions"
      />
      <List dense>
        <PageLink
          path={props.path}
          variant="inset"
          to="/quick-start/"
          title="Logger"
        />

        <PageLink
          path={props.path}
          variant="inset"
          to="/quick-start/"
          title="Router"
        />
      </List>

      {/* ------------ */}
      {/* Integration */}
      {/* ------------ */}
      <PageLink
        path={props.path}
        variant="default"
        to="/page-2/"
        title="Integration"
      />
      <List dense>
        <PageLink
          path={props.path}
          variant="inset"
          to="/quick-start/"
          title="Redux"
        />

        <PageLink
          path={props.path}
          variant="inset"
          to="/quick-start/"
          title="Storybook"
        />
      </List>
    </List>
  )
}
