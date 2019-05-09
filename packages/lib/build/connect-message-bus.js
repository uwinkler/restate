"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function connectMessageBus(store, listener) {
    var subscribeListenerToMessageBus = function (store, listener) {
        return store.messageBus$.subscribe(function (message) { return listener({ message: message, store: store }); });
    };
    if (listener == null) {
        return function (listener) {
            return subscribeListenerToMessageBus(store, listener);
        };
    }
    else {
        return subscribeListenerToMessageBus(store, listener);
    }
}
exports.connectMessageBus = connectMessageBus;
//# sourceMappingURL=connect-message-bus.js.map