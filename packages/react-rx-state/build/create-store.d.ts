import { RxStore, RxStoreOptions } from "./rx-store";
declare type CreateStoreProps<StateType> = {
    state: StateType;
    options?: Partial<RxStoreOptions>;
};
export declare function createStore<STATE>({ state, options }: CreateStoreProps<STATE>): RxStore<STATE>;
export {};
//# sourceMappingURL=create-store.d.ts.map