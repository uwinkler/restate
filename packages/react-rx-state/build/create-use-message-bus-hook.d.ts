/// <reference types="react" />
import { RxStore, Message } from './rx-store';
declare type CreateUseMessageBusObservableHookProps<S> = React.Context<RxStore<S>>;
export declare function createUseMessageBusHook<S extends object>(provider: CreateUseMessageBusObservableHookProps<S>): () => {
    dispatch: (message: Message) => void;
    dispatchAsync: (message: Message) => void;
};
export {};
//# sourceMappingURL=create-use-message-bus-hook.d.ts.map