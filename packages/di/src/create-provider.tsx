import React, { FC } from 'react'

type Service = React.FC<Parent>
interface Parent {
  children?: React.ReactNode
}

/**
 * `createServiceProvider` is a utility to combine multiple services.
 */
export function createServiceProvider(...services: Service[]) {
  return combineComponents(...services)
}

export const combineComponents = (...components: FC<Parent>[]): FC<Parent> =>
  components.reduce(
    (Prev, Cur) => (props: Parent) =>
      (
        <Prev>
          <Cur>{props.children}</Cur>
        </Prev>
      ),
    (props: Parent) => <>{props.children}</>
  )
