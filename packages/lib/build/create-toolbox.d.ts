import { Observable, Subscription } from "rxjs";
import { MetaInfo, RxStore } from "./rx-store";
declare type SelectorFunction<S, T extends object> = (state: S) => T;
declare type UpdateFunction<T> = (subState: T) => void;
export interface ForgePropsStore<S> {
    store: RxStore<S>;
    subscription: Subscription;
}
export interface ForgeProps<SUB_STATE> {
    state$: Observable<SUB_STATE>;
    meta$: Observable<MetaInfo>;
    messageBus$: Observable<MetaInfo>;
    next: (updateFunction: UpdateFunction<SUB_STATE>) => void;
}
declare type CompleteForgeProps<S, T> = ForgePropsStore<S> & ForgeProps<T>;
export declare type ToolboxForge<STATE, SUB_STATE, TOOLBOX> = (props: CompleteForgeProps<STATE, SUB_STATE>) => TOOLBOX;
export declare function createToolbox<STATE, SUB_STATE extends Object, TOOLBOX>(store: RxStore<STATE>, selectorFunction: SelectorFunction<STATE, SUB_STATE>, forge: ToolboxForge<STATE, SUB_STATE, TOOLBOX>): TOOLBOX;
export {};
//# sourceMappingURL=create-toolbox.d.ts.map