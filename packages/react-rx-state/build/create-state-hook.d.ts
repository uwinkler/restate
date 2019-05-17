/// <reference types="react" />
import { RxStore } from "./rx-store";
declare type SelectorFunction<S, T> = (state: S) => T;
export declare type UseStoreHook<S> = <T>(selectorFunction?: SelectorFunction<S, T>) => T;
export declare type UseStoreHookScoped<S> = UseStoreHook<S>;
export declare function createStateHook<S>(context: React.Context<RxStore<S>>): UseStoreHook<S>;
export declare function createStateHook<S, SUB_STATE>(context: React.Context<RxStore<S>>, outerSelector: SelectorFunction<S, SUB_STATE>): UseStoreHookScoped<SUB_STATE>;
export {};
//# sourceMappingURL=create-state-hook.d.ts.map