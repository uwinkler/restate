"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
function createUseObservableHook(provider) {
    function useObservable() {
        var store = react_1.useContext(provider);
        return store.state$;
    }
    return useObservable;
}
exports.createUseObservableHook = createUseObservableHook;
//# sourceMappingURL=create-observable-hook.js.map