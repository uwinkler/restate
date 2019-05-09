import React from 'react';
import { RxStore } from './rx-store';
declare type WithStoreHocProps<S> = React.Context<RxStore<S>>;
export interface WithRxStore<S> {
    rxStore: RxStore<S>;
}
export declare function createWithStoreHoc<STATE>(Context: WithStoreHocProps<STATE>): <P extends WithRxStore<STATE>>(Component: React.ComponentType<P>) => (props: Pick<P, import("utility-types").SetDifference<keyof P, "rxStore">>) => JSX.Element;
export {};
//# sourceMappingURL=create-with-store-hoc.d.ts.map