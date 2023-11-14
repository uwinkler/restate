import { EXAMPLES_MAP, EXAMPLE_NAMES, useAppState } from './app.state'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
export function ExampleSwitch() {
  const [value, setValue] = useAppState((s) => s.exampleApp)

  const handleChange: React.ChangeEventHandler<HTMLSelectElement> = (e) =>
    setValue(e.target.value as any)

  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">Example</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={value}
        label="Example"
        onChange={(e) => setValue(e.target.value as any)}
      >
        {EXAMPLE_NAMES.map((name) => (
          <MenuItem key={name} value={name}>
            {name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
