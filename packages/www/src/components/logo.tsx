import React from "react"

export const Logo: React.FC<any> = props => (
  <img alt="logo" style={{ color: "green" }} src={"/logo.svg"} {...props} />
)
