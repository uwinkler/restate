"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
function createMessageBusHook(provider) {
    return function useMessageBus() {
        var store = react_1.useContext(provider);
        function dispatch(message) {
            store.dispatch(message);
        }
        return dispatch;
    };
}
exports.createMessageBusHook = createMessageBusHook;
//# sourceMappingURL=create-message-bus-hook.js.map