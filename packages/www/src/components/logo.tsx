import React from "react"
const logo = require("./logo.svg")

export const Logo: React.FC<any> = props => (
  <img alt="logo" style={{ color: "green" }} src={logo} {...props} />
)
