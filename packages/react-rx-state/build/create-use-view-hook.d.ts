/// <reference types="react" />
import { RxStore } from "./rx-store";
declare type CreateUseStoreHookInput<S> = React.Context<RxStore<S>>;
declare type ViewHookFunction<S, T> = (state: S) => T;
export declare function createUseViewHook<S extends object>(provider: CreateUseStoreHookInput<S>): <T>(mapFunction: ViewHookFunction<S, T>) => T;
export {};
//# sourceMappingURL=create-use-view-hook.d.ts.map