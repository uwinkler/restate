"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var create_use_store_state_hook_1 = require("./create-use-store-state-hook");
var index_1 = require("./index");
function createUseStoreHook(context) {
    var useStoreUpdateHook = index_1.createUseStoreUpdateHook(context);
    var useStoreStateHook = create_use_store_state_hook_1.createUseStoreStateHook(context);
    function useStore(selectorFunction) {
        var state = useStoreStateHook(selectorFunction);
        var nextState = useStoreUpdateHook(selectorFunction);
        return [state, nextState];
    }
    return useStore;
}
exports.createUseStoreHook = createUseStoreHook;
//# sourceMappingURL=create-use-store-hook.js.map