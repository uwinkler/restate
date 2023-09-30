import * as monaco from 'monaco-editor'
import React, { useEffect } from 'react'
import { store, useAppState, useSelector } from './state'
import { useMessage } from './use-message'
import { retry } from 'rxjs'

export function Editor() {
  const ref = React.useRef<HTMLDivElement>(null)
  const { postMessage } = useMessage()

  const update = useSelector((s) =>
    s.updates.find((u) => u.id === s.selectedUpdateId)
  )

  const editor = React.useRef<monaco.editor.IStandaloneCodeEditor | null>(null)

  useEffect(() => {
    function applyState() {
      const update = store.state.updates.find(
        (u) => u.id === store.state.selectedUpdateId
      )
      if (!update) {
        return
      }

      const nextStateString = editor.current?.getValue()
      const nextState = (() => {
        try {
          return JSON.parse(nextStateString || '')
        } catch (e) {
          console.error(e)
          alert('Invalid JSON')
        }
      })()
      postMessage({
        type: 'apply-state',
        payload: {
          store: update.store,
          nextState,
          trace: update.trace
        }
      })
    }

    const applyAction: monaco.editor.IActionDescriptor = {
      id: 'run-code',
      label: 'Apply State',
      contextMenuOrder: 2,
      contextMenuGroupId: '1_modification',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
      run: applyState
    }

    editor.current?.addAction(applyAction)
  }, [editor.current])

  useEffect(() => {
    editor.current = monaco.editor.create(ref.current!, {
      value: JSON.stringify('loading...', null, 2),
      language: 'json',
      automaticLayout: true
    })

    return () => editor.current?.dispose()
  }, [])

  useEffect(() => {
    if (update) {
      editor.current?.setValue(JSON.stringify(update.state, null, 2))
    }
  }, [update])

  return <div ref={ref} style={{ gridArea: 'editor' }} />
}
