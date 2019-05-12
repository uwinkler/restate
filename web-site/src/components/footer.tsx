import React from "react"
import { makeStyles } from "@material-ui/styles"
import { theme } from "../layouts/theme"

const useClasses = makeStyles({
  container: {
    backgroundColor: theme.palette.grey[100],
    height: 300
  }
})

export const Footer: React.FC = () => {
  const classes = useClasses()
  return <div className={classes.container} />
}
