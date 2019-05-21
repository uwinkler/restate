import React from "react"
import { Divider, Button } from "@material-ui/core"
import { Link } from "gatsby"

interface NextButtonProps {
  to: string
  title: string
}
export const NextButton: React.FC<NextButtonProps> = props => {
  return (
    <>
      <Divider style={{ marginTop: 30 }} />
      <Button>
        <Link to={props.to}>{props.title}</Link>
      </Button>
    </>
  )
}
