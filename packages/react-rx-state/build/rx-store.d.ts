import { BehaviorSubject } from "rxjs";
import { Patch } from "immer";
export declare type UpdateFunction<S> = (subState: S) => void;
export interface Message {
    type: string;
    payload?: any;
}
export interface MetaInfo extends Message {
}
export declare const UPDATE = "@RX/UPDATE";
export declare const INIT_MESSAGE: Message;
interface MiddlewareProps<S> {
    state: S;
    metaInfo: MetaInfo;
    next(): any;
}
export interface NextErrorMessage<STATE> {
    error: Error;
    state: STATE;
    metaInfo: MetaInfo;
}
export declare type Middleware<S> = (props: MiddlewareProps<S>) => any;
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
    protected _error$: BehaviorSubject<NextErrorMessage<STATE> | null>;
    protected _options: RxStoreOptions;
    protected _middlewares: Middleware<STATE>[];
    constructor(x: BehaviorSubject<STATE>, options: RxStoreOptions);
    static of<S>(state: BehaviorSubject<S>, options: RxStoreOptions): RxStore<S>;
    next(updateFunctionOrNextState: UpdateFunction<STATE> | STATE, metaInfo?: MetaInfo): Promise<any>;
    dispatch(message: Message): void;
    readonly state: Readonly<STATE>;
    readonly state$: BehaviorSubject<STATE>;
    readonly patches$: BehaviorSubject<Patch[]>;
    readonly inversePatches$: BehaviorSubject<Patch[]>;
    readonly meta$: BehaviorSubject<MetaInfo>;
    readonly messageBus$: BehaviorSubject<Message>;
    readonly error$: BehaviorSubject<NextErrorMessage<STATE> | null>;
    readonly options: RxStoreOptions;
    readonly middlewares: Middleware<STATE>[];
}
export {};
//# sourceMappingURL=rx-store.d.ts.map