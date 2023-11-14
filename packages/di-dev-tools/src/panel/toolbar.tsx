import { IconButton, Tooltip } from '@mui/material'
import Box from '@mui/material/Box'
import React from 'react'
import DifferenceIcon from '@mui/icons-material/Difference'
import { useAppState } from './state'
export function Toolbar() {
  return (
    <Box sx={{ gridArea: 'header', padding: (t) => t.spacing(1) }}>
      <ToggleDiffModeButton />
      <ScrollButton />
    </Box>
  )
}

function ToggleDiffModeButton() {
  const [diffMode, setDiffMode] = useAppState((s) => s.diffMode)
  return (
    <Tooltip
      title={diffMode ? 'Switch off diff mode.' : 'Switch on diff mode.'}
    >
      <IconButton
        onClick={() => setDiffMode(!diffMode)}
        color={diffMode ? 'primary' : 'default'}
      >
        <DifferenceIcon />
      </IconButton>
    </Tooltip>
  )
}

function ScrollButton() {
  const [scrollMode, setScrollMode] = useAppState((s) => s.scrollMode)
  const [diffMode] = useAppState((s) => s.diffMode)

  if (diffMode) {
    return null
  }

  return (
    <Tooltip title={scrollMode ? 'Stay on top.' : `Don't scroll.`}>
      <IconButton
        onClick={() => setScrollMode(!scrollMode)}
        color={scrollMode ? 'primary' : 'default'}
      >
        <DifferenceIcon />
      </IconButton>
    </Tooltip>
  )
}
