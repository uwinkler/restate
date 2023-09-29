import * as monaco from 'monaco-editor'
import React, { useEffect } from 'react'
import { useSelector } from './state'

export function Editor() {
  const ref = React.useRef<HTMLDivElement>(null)
  const store = useSelector((s) => s.stores[s.stores.length - 1])
  const editor = React.useRef<monaco.editor.IStandaloneCodeEditor | null>(null)

  useEffect(() => {
    editor.current = monaco.editor.create(ref.current!, {
      value: JSON.stringify(store, null, 2),
      language: 'json',
      automaticLayout: true
    })

    return () => editor.current?.dispose()
  }, [])

  useEffect(() => {
    if (store) {
      editor.current?.setValue(JSON.stringify(store, null, 2))
    }
  }, [store])

  return (
    <>
      <div ref={ref} style={{ height: '100%', width: '100%' }} />
    </>
  )
}
