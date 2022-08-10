import React from 'react'
import { useNextAppState, Visibility } from './store'

function useSetVisibility() {
  const nextState = useNextAppState((state) => state)

  return (nextVisibility: Visibility) => () =>
    nextState((s) => {
      s.visibility = nextVisibility
      s.page = 0
    })
}

export const Footer = () => {
  const setVisibility = useSetVisibility()

  return (
    <div>
      <button onClick={setVisibility('all')}>all</button>
      <button onClick={setVisibility('open')}>active</button>
      <button onClick={setVisibility('done')}>done</button>
    </div>
  )
}
