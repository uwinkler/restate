/// <reference types="react" />
import { RxStore } from "./rx-store";
declare type RxStoreContext<S> = React.Context<RxStore<S>>;
declare type SelectorFunction<S, T> = (state: S) => T;
export declare function createUseStoreStateHook<S extends object>(context: RxStoreContext<S>): <T extends object>(selectorFunction?: SelectorFunction<S, T> | undefined) => T;
export {};
//# sourceMappingURL=create-use-store-state-hook.d.ts.map