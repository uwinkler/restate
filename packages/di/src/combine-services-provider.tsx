import React, { FC } from 'react'

type ServiceProvider = React.FC<Parent>
interface Parent {
  children?: React.ReactNode
}

/**
 * `createServiceProvider` is a utility to combine multiple services.
 */
export function combineServiceProvider(...services: ServiceProvider[]) {
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
