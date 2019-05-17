/// <reference types="react" />
import { RxStore, Message } from "./rx-store";
declare type CreateUseMessageBusObservableHookProps<S> = React.Context<RxStore<S>>;
export declare function createMessageBusHook<S extends object>(provider: CreateUseMessageBusObservableHookProps<S>): () => (message: Message) => void;
export {};
//# sourceMappingURL=create-message-bus-hook.d.ts.map