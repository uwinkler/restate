/// <reference types="react" />
import { RxStore } from './rx-store';
declare type CreateUseObservableHook<S> = React.Context<RxStore<S>>;
export declare function createUseObservableHook<S extends object>(provider: CreateUseObservableHook<S>): () => import("rxjs").BehaviorSubject<S>;
export {};
//# sourceMappingURL=create-observable-hook.d.ts.map