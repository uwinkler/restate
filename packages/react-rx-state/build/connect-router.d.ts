import { Location, History } from "history";
import { RxStore } from "./rx-store";
export interface WithConnectReactRouterState<LocationState> {
    router: {
        location: Location;
        state: LocationState;
    };
}
export declare const defaultRouterState: {
    location: {
        pathname: string;
        search: string;
        state: {};
        hash: string;
    };
    state: {};
};
export declare function connectReactRouter<LocationStateType, S extends WithConnectReactRouterState<LocationStateType>>(props: {
    appStore: RxStore<S>;
    history: History<any>;
}): void;
//# sourceMappingURL=connect-router.d.ts.map