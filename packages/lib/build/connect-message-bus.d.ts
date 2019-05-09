import { RxStore, Message } from './rx-store';
import { Subscription } from 'rxjs';
/**
 * Usage:
 *
 *
 */
export declare type MessagebusListener<S> = (props: {
    message: Message;
    store: RxStore<S>;
}) => void;
export declare function connectMessageBus<S>(store: RxStore<S>): (listener: MessagebusListener<S>) => Subscription;
export declare function connectMessageBus<S>(store: RxStore<S>, listener: MessagebusListener<S>): Subscription;
//# sourceMappingURL=connect-message-bus.d.ts.map