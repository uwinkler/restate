"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
function createStoreHook(provider) {
    return function useStore() {
        var store = react_1.useContext(provider);
        return store;
    };
}
exports.createStoreHook = createStoreHook;
//# sourceMappingURL=create-store-hook.js.map