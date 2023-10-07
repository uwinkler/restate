export function isMessageDevTools(msg) {
    return msg?.data?.source === 'restate-di-devtools';
}
export function isMessageContent(msg) {
    return msg.source === 'restate-di-content';
}
//# sourceMappingURL=di-common-types.js.map