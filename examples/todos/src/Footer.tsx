import React from "react"
import { useNextAppState, VisibilityFiler } from "./store"

export const Footer = () => {
  const nextState = useNextAppState(state => state)

  function setNextVisibility(visibility: VisibilityFiler) {
    nextState(state => {
      state.visibility = visibility
      state.page = 0
    })
  }

  return (
    <div>
      <button onClick={() => setNextVisibility("all")}>all</button>
      <button onClick={() => setNextVisibility("open")}>active</button>
      <button onClick={() => setNextVisibility("done")}>done</button>
    </div>
  )
}
