import React from 'react'

//@ts-ignore
import logo from './logo.svg'

export const Logo = (props: any) => (
  <div style={{ height: 50, width: 200 }}>
    <img alt="logo" height="40px" width="200px" src={logo} {...props} />
  </div>
)
