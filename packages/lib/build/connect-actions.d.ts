import { Observable, Subscription } from "rxjs";
import { MetaInfo, RxStore } from "./rx-store";
export declare type ActionFactorySelectorFunction<S, T extends object> = (state: S) => T;
declare type UpdateFunction<T> = (subState: T) => void;
export interface ActionPropsState<STATE> {
    store: RxStore<STATE>;
    subscription: Subscription;
}
export interface ActionPropsSubState<SUB_STATE> {
    state$: Observable<SUB_STATE>;
    meta$: Observable<MetaInfo>;
    messageBus$: Observable<MetaInfo>;
    next: (updateFunction: UpdateFunction<SUB_STATE>) => void;
}
declare type ActionFactoryProps<S, T> = ActionPropsState<S> & ActionPropsSubState<T>;
export declare type ActionFactory<STATE, SUB_STATE, ACTIONS> = (props: ActionFactoryProps<STATE, SUB_STATE>) => ACTIONS;
export declare function connectActions<STATE, SUB_STATE extends Object, ACTIONS>(store: RxStore<STATE>, selectorFunction: ActionFactorySelectorFunction<STATE, SUB_STATE>, actionFactory: ActionFactory<STATE, SUB_STATE, ACTIONS>): ACTIONS;
export {};
//# sourceMappingURL=connect-actions.d.ts.map