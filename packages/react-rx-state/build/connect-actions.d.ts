import { Observable, Subscription } from "rxjs";
import { MetaInfo, RxStore } from "./rx-store";
export declare type ActionFactorySelectorFunction<S, T extends object> = (state: S) => T;
declare type UpdateFunction<T> = (subState: T) => void;
export interface ActionPropsState<STATE> {
    store: RxStore<STATE>;
    subscription: Subscription;
}
export interface ActionFactoryProps<SUB_STATE> {
    state$: Observable<SUB_STATE>;
    messageBus$: Observable<MetaInfo>;
    next: (updateFunction: UpdateFunction<SUB_STATE>) => void;
}
export declare type ActionFactory<SUB_STATE, T> = (props: ActionFactoryProps<SUB_STATE>) => T;
declare type ActionFactoryConnectProps<S, T> = ActionPropsState<S> & ActionFactoryProps<T>;
export declare type ActionFactoryConnectFunction<STATE, SUB_STATE, ACTIONS> = (props: ActionFactoryConnectProps<STATE, SUB_STATE>) => ACTIONS;
export declare function connectActions<STATE, SUB_STATE extends Object, ACTIONS>(store: RxStore<STATE>, selectorFunction: ActionFactorySelectorFunction<STATE, SUB_STATE>, actionFactory: ActionFactoryConnectFunction<STATE, SUB_STATE, ACTIONS>): ACTIONS;
export {};
//# sourceMappingURL=connect-actions.d.ts.map