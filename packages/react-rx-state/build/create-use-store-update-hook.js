"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var immer_1 = __importDefault(require("immer"));
var react_1 = require("react");
var identifySelectorFunction = function (state) { return state; };
function createUseStoreUpdateHook(provider) {
    function useUpdateStoreHook(selectorFunction) {
        var selector = selectorFunction
            ? selectorFunction
            : identifySelectorFunction;
        var store = react_1.useContext(provider);
        var state$ = store.state$;
        var patches$ = store.patches$;
        var inversePatches$ = store.inversePatches$;
        function updateState(updateFunction) {
            var currentState = state$.value;
            var nextState = immer_1.default(currentState, function (draftState) {
                var subState = selector(draftState);
                updateFunction(subState);
                return draftState;
            }, function (patches, inversePatches) {
                patches$.next(patches);
                inversePatches$.next(inversePatches);
            });
            state$.next(nextState);
            store.meta$.next({
                type: "@RX/UPDATE_USE_UPDATE_HOOK",
                payload: {
                    func: updateFunction.toString()
                }
            });
        }
        return updateState;
    }
    return useUpdateStoreHook;
}
exports.createUseStoreUpdateHook = createUseStoreUpdateHook;
//# sourceMappingURL=create-use-store-update-hook.js.map