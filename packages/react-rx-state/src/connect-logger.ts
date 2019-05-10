import { distinctUntilChanged, pairwise } from "rxjs/operators"
import { Patch } from "immer"
import { RxStore } from "./rx-store"
import { zip } from "rxjs"

export function connectLogger(appStore: RxStore<any>) {
  const name =
    appStore.options.storeName === "" ? "RxState" : appStore.options.storeName

  zip(appStore.state$, appStore.meta$, appStore.patches$)
    .pipe(
      distinctUntilChanged(),
      pairwise()
    )
    .subscribe(update => {
      const [prevUpdate, currentUpdate] = update
      const [currentState, meta, patches] = currentUpdate
      const [prevState] = prevUpdate
      console.groupCollapsed(`[${name}]: ` + meta.type)
      formatPatches(patches, prevState, currentState)
      console.log("State:", currentState)
      console.log("Meta:", meta)
      console.groupEnd()
    })

  appStore.messageBus$.subscribe(message => {
    console.groupCollapsed(
      `[${name}] Message: ` + message.type,
      message.payload
    )
    console.log(message.payload)
    console.groupEnd()
  })
}

function formatPatches(
  patches: Patch[],
  _prevState: RxStore<any>,
  _currentState: RxStore<any>
) {
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
