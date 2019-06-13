import List from "@material-ui/core/List"
import React from "react"
import { Link } from "gatsby"
import { ListItem, ListItemText, ListItemIcon } from "@material-ui/core"
import { makeStyles, getThemeProps } from "@material-ui/styles"
import { theme } from "../layouts/theme"

const useClasses = makeStyles({
  list: {
    marginLeft: 30
  },
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
  },
  active: {
    color: theme.palette.primary.main
  },
  inActive: {
    color: "black"
  }
})

const Dot: React.FC = () => {
  const { dot } = useClasses()
  return <div className={dot} />
}

const DotPlaceHolder = () => <div style={{ width: 10, height: 10 }} />

export const PageLink: React.FC<{
  to: string
  title: string
  variant: "default" | "inset"
  path: string
}> = props => {
  const classes = useClasses()
  const active = props.to === props.path
  const secondary = props.variant === "inset"
  return (
    <Link id={props.to} className={classes.link} to={props.to}>
      <ListItem className={active ? classes.active : classes.inActive}>
        <ListItemIcon>{active ? <Dot /> : <DotPlaceHolder />}</ListItemIcon>
        <ListItemText
          // primaryTypographyProps={{ color: "inherit" }}
          // secondaryTypographyProps={{ color: "inherit" }}
          primary={secondary ? null : props.title}
          secondary={secondary ? props.title : null}
          inset={secondary}
        >
          {/* {props.title} */}
        </ListItemText>
      </ListItem>
    </Link>
  )
}

interface NavigationProps {
  path: string
}

export const Navigation: React.FC<NavigationProps> = props => {
  const classes = useClasses()
  return (
    <List className={classes.list}>
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
          to="/hello-world/"
          title="Hello World"
        />
        <PageLink
          path={props.path}
          variant="inset"
          to="/quick-store/"
          title="Store"
        />
        <PageLink
          path={props.path}
          variant="inset"
          to="/quick-provider/"
          title="Provider"
        />
        <PageLink
          path={props.path}
          variant="inset"
          to="/quick-state-hook/"
          title="App State Hook"
        />
        <PageLink
          path={props.path}
          variant="inset"
          to="/quick-next-hook/"
          title="Next State Hook"
        />
        <PageLink
          path={props.path}
          variant="inset"
          to="/quick-actions/"
          title="Actions"
        />
        <PageLink
          path={props.path}
          variant="inset"
          to="/quick-glue/"
          title="Connectors"
        />
        <PageLink
          path={props.path}
          variant="inset"
          to="/quick-middleware/"
          title="Middleware"
        />
        <PageLink
          path={props.path}
          variant="inset"
          to="/quick-dev-tools/"
          title="DevTools"
        />
      </List>

      {/* ------------ */}
      {/* Guides */}
      {/* ------------ */}

      <PageLink
        path={props.path}
        variant="default"
        to="/page-2/"
        title="API Guide"
      />
      <List dense>
        <PageLink
          path={props.path}
          variant="inset"
          to="/store/"
          title="Store"
        />
        <PageLink
          path={props.path}
          variant="inset"
          to="/state-hook/"
          title="App State Hook"
        />
        <PageLink
          path={props.path}
          variant="inset"
          to="/next-hook/"
          title="Next State Hook"
        />
        <PageLink
          path={props.path}
          variant="inset"
          to="/store-hook/"
          title="Store Hook"
        />
        <PageLink
          path={props.path}
          variant="inset"
          to="/multiple-stores/"
          title="Multiple Stores"
        />
        <PageLink
          path={props.path}
          variant="inset"
          to="/test/"
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

        <PageLink
          path={props.path}
          variant="inset"
          to="/firebase/"
          title="Firebase Database"
        />
        <PageLink
          path={props.path}
          variant="inset"
          to="/firebase/"
          title="PouchDB"
        />
      </List>
    </List>
  )
}
