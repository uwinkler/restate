import { Patch } from "immer";
import { BehaviorSubject } from "rxjs";
import { SelectorFunction } from "./subscribe";
export declare type UpdateFunction<S> = (subState: S) => void;
export interface Message {
    type: string;
    payload?: any;
}
export interface MetaInfo extends Message {
}
export declare const UPDATE = "@RX/UPDATE";
export declare const INIT_MESSAGAE: Message;
export interface RxStoreOptions {
    freeze: boolean;
    storeName: string;
}
export declare class RxStore<STATE> {
    protected _state$: BehaviorSubject<STATE>;
    protected _meta$: BehaviorSubject<MetaInfo>;
    protected _patches$: BehaviorSubject<Patch[]>;
    protected _inversePatches$: BehaviorSubject<Patch[]>;
    protected _messageBus$: BehaviorSubject<Message>;
    protected _options: RxStoreOptions;
    constructor(x: BehaviorSubject<STATE>, options: RxStoreOptions);
    static of<S>(state: BehaviorSubject<S>, options: RxStoreOptions): RxStore<S>;
    subStore<T extends object>(selector: SelectorFunction<STATE, T>): RxStore<T>;
    next(updateFunction: UpdateFunction<STATE>, metaInfo?: MetaInfo): void;
    dispatch(message: Message): void;
    readonly state: STATE;
    readonly state$: BehaviorSubject<STATE>;
    readonly patches$: BehaviorSubject<Patch[]>;
    readonly inversePatches$: BehaviorSubject<Patch[]>;
    readonly meta$: BehaviorSubject<MetaInfo>;
    readonly messageBus$: BehaviorSubject<Message>;
    readonly options: RxStoreOptions;
}
//# sourceMappingURL=rx-store.d.ts.map