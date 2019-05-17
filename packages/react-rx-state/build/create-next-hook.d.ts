/// <reference types="react" />
import { RxStore } from "./rx-store";
declare type AppStoreProvider<S> = React.Context<RxStore<S>>;
declare type SelectorFunction<S, T extends object> = (state: S) => T;
declare type UpdateFunction<S> = (state: S) => void;
declare type CreateNextHookRet<S> = <T extends object>(selector: SelectorFunction<S, T>) => (updateFunction: UpdateFunction<T>) => void;
export declare function createNextHook<S extends object>(provider: AppStoreProvider<S>): CreateNextHookRet<S>;
export declare function createNextHook<S extends object, T extends object>(provider: AppStoreProvider<S>, scope: SelectorFunction<S, T>): CreateNextHookRet<T>;
export {};
//# sourceMappingURL=create-next-hook.d.ts.map