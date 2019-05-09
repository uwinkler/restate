/// <reference types="react" />
import { RxStore, UpdateFunction } from './rx-store';
declare type RxStoreContext<S> = React.Context<RxStore<S>>;
declare type SelectorFunction<S, T extends object> = (state: S) => T;
export declare function createUseStoreHook<S extends object>(context: RxStoreContext<S>): <T extends object>(selectorFunction?: SelectorFunction<S, T> | undefined) => [T, (updateFunction: UpdateFunction<T>) => void];
export {};
//# sourceMappingURL=create-use-store-hook.d.ts.map