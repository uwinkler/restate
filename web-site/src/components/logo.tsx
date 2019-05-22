import React from "react"
const logo = require("./logo.svg")

export const Logo: React.FC<any> = props => (
  <div style={{ height: 50, width: 200 }}>
    <img alt="logo" height="40px" width="200px" src={logo} {...props} />
  </div>
)
