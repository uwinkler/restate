import React from 'react'
import { useAppState, PAGE_SIZE, useNextAppState } from './store'
import { useCountVisibleTodos } from './use-count-visible-todos'

export function Paginator() {
  const page = useAppState((state) => state.page)
  const next = useNextAppState((state) => state)

  const count = useCountVisibleTodos()
  const maxPage = Math.max(0, Math.ceil(count / PAGE_SIZE) - 1)

  function prevPage() {
    next((state) => state.page--)
  }

  function nextPage() {
    next((state) => state.page++)
  }

  const start = page * PAGE_SIZE
  const end = start + PAGE_SIZE - 1

  return (
    <div style={{ display: 'flex' }}>
      <button disabled={page === 0} onClick={prevPage}>
        -
      </button>
      <div>
        Showing todos {start} - {end} of {count}
      </div>
      <button disabled={page === maxPage} onClick={nextPage}>
        +
      </button>
    </div>
  )
}
