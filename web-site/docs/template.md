---
title: Hello, world!
path: /test
---

# Here’s a chart

The chart is rendered inside our MDX document.

Some text with `code`?

- _Emph:_ List?
- a

```tsx
const NameForm = () => {
const name = useAppState(state => state.name)
const next = useNextAppState(state => state)

return <input value={name} onChange={e => next(state => state.name = e.target.value)} />
```
