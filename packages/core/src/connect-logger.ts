import { Patch } from "immer"
import { RxStore } from "./rx-store"

interface LoggerProps {
  color?: string
  backgroundColor?: string
}

// console.log('%c 🛒 [ ' + delta + 'ms ] ' + args, 'background: bisque; color: #333; padding:5px; font-weight:bold')

export function connectLogger(
  appStore: RxStore<any, any>,
  props: LoggerProps = { color: "white", backgroundColor: "DarkOrange" }
) {
  const { color, backgroundColor } = props

  const name =
    appStore.options.storeName === "" ? "RxState" : appStore.options.storeName

  appStore.state$.subscribe(update => {
    console.groupCollapsed(
      `%c [${name}] : ` + update.message.type,
      `color: ${color}; background:${backgroundColor};`
    )
    formatPatches(update.patches || [])
    console.log("State: ", update.state)
    console.log("Message: ", update.message)
    console.groupEnd()
  })
}

function formatPatches(patches: Patch[]) {
  patches.forEach(patch => {
    const path = patch.path.join(".")
    switch (patch.op) {
      case "add": {
        console.groupCollapsed(
          '%c Add "' + path + '":',
          "color: green",
          patch.value
        )
        console.log(JSON.stringify(patch.value, null, 2))
        console.groupEnd()
        break
      }
      case "remove": {
        console.groupCollapsed(
          '%c Remove "' + path + '":',
          "color: red",
          patch.value
        )
        console.log(JSON.stringify(patch.value, null, 2))
        console.groupEnd()
        break
      }
      case "replace": {
        console.groupCollapsed(
          '%c Replace "' + path + '":',
          "color: #008800",
          patch.value
        )
        console.log(JSON.stringify(patch.value, null, 2))
        console.groupEnd()
        break
      }

      default: {
        console.groupCollapsed(
          '%c Default "' + path + '":',
          "color: green",
          patch.value
        )
        console.log(JSON.stringify(patch.value, null, 2))
        console.groupEnd()
      }
    }
  })
}
