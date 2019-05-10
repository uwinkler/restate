"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
function createUseMessageBusHook(provider) {
    return function useMessageBus() {
        var store = react_1.useContext(provider);
        function dispatch(message) {
            store.dispatch(message);
        }
        function dispatchAsync(message) {
            setTimeout(function () { return store.dispatch(message); }, 0);
        }
        return { dispatch: dispatch, dispatchAsync: dispatchAsync };
    };
}
exports.createUseMessageBusHook = createUseMessageBusHook;
//
//# sourceMappingURL=create-use-message-bus-hook.js.map