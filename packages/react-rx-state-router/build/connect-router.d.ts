import { Location, History } from "history";
import { RxStore } from "react-rx-state";
export interface WithConnectReactRouterState<LocationState> {
    location: Location<LocationState>;
}
export declare const defaultRouterState: {
    pathname: string;
    search: string;
    state: any;
    hash: string;
};
export declare function connectReactRouter<LocationStateType, S extends WithConnectReactRouterState<LocationStateType>>(props: {
    appStore: RxStore<S>;
    history: History<any>;
}): void;
//# sourceMappingURL=connect-router.d.ts.map