export type MessageDevToolsType = 'get-all-store-updates' | 'apply-state' | 'get-all-service-updates';
export type MessageContentType = 'get-all-store-updates-response' | 'get-all-services-updates-response' | 'store-update' | 'service-update';
export type MessageContent<T> = {
    source: 'restate-di-content';
    type: MessageContentType;
    tabId?: number;
    payload: T;
};
export type MessageDevTools<T> = {
    source: 'restate-di-devtools';
    type: MessageDevToolsType;
    tabId: number;
    payload: T;
};
export type Message<T> = MessageContent<T> | MessageDevTools<T>;
export declare function isMessageDevTools(msg: any): boolean;
export declare function isMessageContent<T>(msg: any): msg is MessageContent<T>;
//# sourceMappingURL=di-common-types.d.ts.map