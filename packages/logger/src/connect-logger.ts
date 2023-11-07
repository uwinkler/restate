import { Patch } from 'immer'
import { RxStore, StatePackage } from '@restate/core'
import sourceMapSupport from 'source-map-support'

interface LoggerProps {
  color?: string
  backgroundColor?: string
  printStack?: boolean
}

export function connectLogger(appStore: RxStore<any>, props: LoggerProps = {}) {
  const {
    color = 'white',
    backgroundColor = 'DarkOrange',
    printStack = process.env.NODE_ENV !== 'production'
  } = props

  if (printStack) {
    sourceMapSupport.install()
  }

  const name =
    appStore.options.storeName === '' ? 'RxState' : appStore.options.storeName

  appStore.state$.subscribe((update: any) => {
    console.groupCollapsed(
      formatGroupName(name, update),
      `color: ${color}; background:${backgroundColor};`
    )
    formatPatches(update.patches || [])
    console.log('State: ', update.state)

    if (printStack) {
      formatStack(update)
    }
    console.groupEnd()
  })
}

function formatStack(update: StatePackage<any, any>) {
  const lines = parseStack(update)
  console.log('Source :', lines)
}

function parseStack(update: StatePackage<any, any>) {
  const stack: string | undefined = (update as any).stack

  if (!stack) return []

  const URL_REG = /http:.*:\d/

  const lines = stack
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => !/^Error/.test(line))
    .filter((line) => !/internal\/operators/.test(line))
    .filter((line) => !/internal\/Scheduler.ts/.test(line))
    .filter((line) => !/internal\/scheduler/.test(line))
    .filter((line) => !/internal\/Subject.ts/.test(line))
    .filter((line) => !/internal\/BehaviorSubject.ts/.test(line))
    .filter((line) => !/internal\/Observable.ts/.test(line))
    .filter((line) => !/node_modules/.test(line))
    .filter((line) => !/Notification.observe/.test(line))
    .filter((line) => !/rx-store.ts/.test(line))
    .filter((line) => !/RxStore/.test(line))
    .filter((line) => !/Subscriber.ts/.test(line))
    .filter((line) => !/webpack\/bootstrap/.test(line))
    .filter((line) => !/chunk.js/.test(line))
    .filter((line) => URL_REG.test(line))
    .map((line) => {
      const match = URL_REG.exec(line)
      return match ? match[0] : ''
    })

  return lines
}

function formatGroupName(name: string, update: StatePackage<any, any>) {
  const lines = parseStack(update)
  const source = (lines[0] || '').split('/').reverse()[0] || ''

  return `%c [${name}] :  ${source}`
}

function formatPatches(patches: Patch[]) {
  patches.forEach((patch) => {
    const path = patch.path.join('.')
    switch (patch.op) {
      case 'add': {
        console.groupCollapsed(
          '%c Add "' + path + '":',
          'color: green',
          patch.value
        )
        console.log(JSON.stringify(patch.value, null, 2))
        console.groupEnd()
        break
      }
      case 'remove': {
        console.groupCollapsed(
          '%c Remove "' + path + '":',
          'color: red',
          patch.value
        )
        console.log(JSON.stringify(patch.value, null, 2))
        console.groupEnd()
        break
      }
      case 'replace': {
        console.groupCollapsed(
          '%c Replace "' + path + '":',
          'color: #008800',
          patch.value
        )
        console.log(JSON.stringify(patch.value, null, 2))
        console.groupEnd()
        break
      }

      default: {
        console.groupCollapsed(
          '%c Default "' + path + '":',
          'color: green',
          patch.value
        )
        console.log(JSON.stringify(patch.value, null, 2))
        console.groupEnd()
      }
    }
  })
}
