import { RxStore } from './rx-store';
export declare type SelectorFunction<S, T> = (state: S) => T;
export declare type MountPointSelector<S> = (nextState: S) => void;
export declare function subscribe<APP_STATE>(store: RxStore<APP_STATE>): {
    select: <SUB_STATE>(selectorFunction: SelectorFunction<APP_STATE, SUB_STATE>) => {
        mount: (mount: MountPointSelector<SUB_STATE>) => import("rxjs").Subscription;
    };
};
//# sourceMappingURL=subscribe.d.ts.map