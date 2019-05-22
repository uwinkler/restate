import React from "react"
import { useAppState, PAGE_SIZE, useNextAppState } from "./store"
import { useCountVisibleTodos } from "./use-count-visible-todos"

export const Paginator: React.FC = () => {
  const page = useAppState(state => state.page)
  const next = useNextAppState(state => state)
  const visibleTodosCount = useCountVisibleTodos()
  const maxPage = Math.max(0, Math.ceil(visibleTodosCount / PAGE_SIZE) - 1)

  function prevPage() {
    next(state => state.page--)
  }

  function nextPage() {
    next(state => state.page++)
  }
  return (
    <div style={{ display: "flex" }}>
      <button disabled={page === 0} onClick={prevPage}>
        -
      </button>
      <div>
        Page {page} of {maxPage}
      </div>
      <button disabled={page === maxPage} onClick={nextPage}>
        +
      </button>
    </div>
  )
}
