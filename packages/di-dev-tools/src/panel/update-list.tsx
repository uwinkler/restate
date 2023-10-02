import { Box, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import List from '@mui/material/List'
import React from 'react'
import { Update, useAppState, useSelector } from './state'

export function UpdateList() {
  const updates = useSelector((s) =>
    [...s.updates].map((s, idx) => ({ ...s, idx })).reverse()
  )
  const selectedUpdateId = useSelector((s) => s.selectedUpdateId)
  const selectedDiffUpdateId = useSelector((s) => s.diffUpdateId)

  return (
    <Box sx={{ height: '100%', overflow: 'auto', gridArea: 'left' }}>
      <List dense>
        {updates.map((update) => (
          <UpdateEntry
            update={update}
            selected={
              update.id === selectedUpdateId ||
              update.id === selectedDiffUpdateId
            }
          />
        ))}
      </List>
    </Box>
  )
}

function SelectStore() {
  const allStores = useSelector((s) => {
    const stores = new Map<string, { id: string; name: string }>()
    s.updates.forEach((u) => {
      stores.set(u.storeId, { id: u.storeId, name: u.store })
    })
    return Array.from(stores.values())
  })
}

function UpdateEntry(props: { update: Update; selected: boolean }) {
  const { update, selected } = props

  const [_, setSelectedUpdateId] = useAppState((s) => s.selectedUpdateId)

  return (
    <ListItemButton
      selected={selected}
      onClick={() => setSelectedUpdateId(update.id)}
    >
      <ListItemIcon>{(update as any).idx}</ListItemIcon>
      <Box>
        <Box sx={{ fontSize: '0.8rem' }}>{update.trace || 'Update'}</Box>
        <Box
          sx={{ fontSize: '0.7rem', color: (theme) => theme.palette.grey[600] }}
        >
          {update.store}
        </Box>
        <Box
          sx={{ fontSize: '0.7rem', color: (theme) => theme.palette.grey[600] }}
        >
          {formatTimestamp(update.timestamp)}
        </Box>
      </Box>
    </ListItemButton>
  )
}

function formatTimestamp(timestamp: number) {
  const date = new Date(timestamp)
  return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`
}
