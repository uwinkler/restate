import { RxStore, Message } from "@restate/core"

/**
 * isFullscreenAvailable: https://developer.mozilla.org/en-US/docs/Web/API/Document/fullscreenEnabled
 */
export interface WithWebApiConnector {
  webApi: {
    isFullscreenAvailable: boolean | null
  }
}

export interface RestateWebApiInitMessage extends Message {
  type: "@RESTATE/WEB_API/INIT"
}

const initMessage: RestateWebApiInitMessage = {
  type: "@RESTATE/WEB_API/INIT"
}

export function connectWebApi<
  S extends WithWebApiConnector,
  M extends Message
>(props: { appStore: RxStore<S, M> }) {
  const { appStore } = props

  appStore.next(
    state => {
      state.webApi.isFullscreenAvailable = isFullscreenAvailable()
    },
    initMessage as any
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
