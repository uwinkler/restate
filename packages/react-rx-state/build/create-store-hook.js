"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
function createUseStoreHook(provider) {
    return function useStore() {
        var store = react_1.useContext(provider);
        return store;
    };
}
exports.createUseStoreHook = createUseStoreHook;
//# sourceMappingURL=create-store-hook.js.map