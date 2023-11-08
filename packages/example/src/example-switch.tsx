import { useAppState } from './app.state'

export function ExampleSwitch() {
  const [value, setValue] = useAppState((s) => s.exampleApp)

  const handleChange: React.ChangeEventHandler<HTMLSelectElement> = (e) =>
    setValue(e.target.value as any)

  return (
    <div className="example-switch">
      <select onChange={handleChange}>
        <option value="hello-restate">Hello Restate</option>
        <option value="hello-useAppState">useAppState</option>
        <option value="multiple-useSelector">useSelector</option>
        <option value="hello-useNext">useNext</option>
        <option value="hello-store">Store and Observables</option>
        <option value="hello-middleware">Middleware</option>
        <option value="hello-zod">Validation with ZOD</option>
      </select>
    </div>
  )
}
