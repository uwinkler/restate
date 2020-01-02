import { RxStore } from "@restate/core"

/**
 * isFullscreenAvailable: https://developer.mozilla.org/en-US/docs/Web/API/Document/fullscreenEnabled
 */
export interface WithWebApiConnector {
  webApi: {
    isFullscreenAvailable: boolean | null
  }
}

const INIT = "@RESTATE/WEB_API/INIT"

export function connectWebApi<S extends WithWebApiConnector>(props: {
  appStore: RxStore<S>
}) {
  const { appStore } = props

  appStore.next(
    state => {
      state.webApi.isFullscreenAvailable = isFullscreenAvailable()
    },
    { type: INIT }
  )
}

function isFullscreenAvailable(): boolean | null {
  let isFullscreenAvailable =
    document.fullscreenEnabled /* Standard syntax */ ||
    (document as any)
      .webkitFullscreenEnabled /* Chrome, Safari and Opera syntax */ ||
    (document as any).mozFullScreenEnabled /* Firefox syntax */ ||
    (document as any).msFullscreenEnabled /* IE/Edge syntax */

  if (isFullscreenAvailable == null) {
    return null
  } else {
    return isFullscreenAvailable
  }
}
