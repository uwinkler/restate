import * as monaco from 'monaco-editor'
import React, { useEffect } from 'react'
import { useSelector } from './state'

export function DiffEditor() {
  const ref = React.useRef<HTMLDivElement>(null)

  const selectedUpdate = useSelector((s) => {
    const id =
      s.selectedUpdateId === 'NO_UPDATE_SELECTED'
        ? s.updates.at(-1)
        : s.selectedUpdateId

    return s.updates.find((u) => u.id === id)
  })

  const previousUpdate = useSelector(
    (s) => {
      const idx = s.updates.findIndex((u) => u.id === selectedUpdate?.id) - 1

      if (idx < 0) {
        return s.updates.at(-1)
      }

      return s.updates.at(idx)
    },
    {
      deps: [selectedUpdate]
    }
  )

  const editor = React.useRef<monaco.editor.IDiffEditor | null>(null)

  useEffect(() => {
    editor.current = monaco.editor.createDiffEditor(ref.current!, {
      automaticLayout: true,
      renderSideBySide: false
    })

    return () => editor.current?.dispose()
  }, [])

  useEffect(() => {
    editor.current?.setModel({
      original: monaco.editor.createModel(
        JSON.stringify(previousUpdate?.state, null, 2)
      ),
      modified: monaco.editor.createModel(
        JSON.stringify(selectedUpdate?.state, null, 2)
      )
    })
  }, [selectedUpdate, previousUpdate])

  return <div ref={ref} style={{ gridArea: 'editor' }} />
}
