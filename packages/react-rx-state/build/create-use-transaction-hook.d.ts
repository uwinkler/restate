/// <reference types="react" />
import { RxStore } from './rx-store';
declare type CreateUseStoreHookInput<S> = React.Context<RxStore<S>>;
declare type SelectorFunction<S, T extends object> = (state: S) => T;
declare type UpdateFunction<T> = (subState: T) => void;
export declare function createUseTransactionHook<S extends object>(provider: CreateUseStoreHookInput<S>): <T extends object>(selectorFunction?: SelectorFunction<S, T> | undefined) => {
    store: T;
    updateStore: (updateFunction: UpdateFunction<T>) => void;
};
export {};
//# sourceMappingURL=create-use-transaction-hook.d.ts.map