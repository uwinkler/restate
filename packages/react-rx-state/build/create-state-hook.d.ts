/// <reference types="react" />
import { RxStore } from "./rx-store";
declare type SelectorFunction<S, T> = (state: S) => T;
export declare type UseStoreHookWithSelectorFunction<S> = <T>(selectorFunction?: SelectorFunction<S, T>) => T;
export declare type UseStoreHookWithoutSelectorFunction<S> = () => S;
export declare type UseStoreStateHook<S> = UseStoreHookWithSelectorFunction<S>;
export declare function createStateHook<S>(context: React.Context<RxStore<S>>): UseStoreHookWithSelectorFunction<S>;
export declare function createStateHook<S, SUB_STATE>(context: React.Context<RxStore<S>>, outerSelector: SelectorFunction<S, SUB_STATE>): UseStoreStateHook<SUB_STATE>;
export {};
//# sourceMappingURL=create-state-hook.d.ts.map