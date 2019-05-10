"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var immer_1 = __importDefault(require("immer"));
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var react_1 = require("react");
var identifySelectorFunction = function (state) { return state; };
function createUseTransactionHook(provider) {
    function useTransaction(selectorFunction) {
        var selector = selectorFunction ? selectorFunction : identifySelectorFunction;
        var store = react_1.useContext(provider);
        var state$ = store.state$;
        var patches$ = store.patches$;
        var inversePatches$ = store.inversePatches$;
        var startValue = selector(state$.value);
        var _a = react_1.useState(startValue), value = _a[0], setValue = _a[1];
        var output$ = react_1.useMemo(function () {
            return new rxjs_1.BehaviorSubject(startValue);
        }, [state$]);
        react_1.useEffect(function () {
            var subscription = state$.subscribe(function (nextStateValue) {
                var nextSubValue = selector(nextStateValue);
                output$.next(nextSubValue);
            });
            output$.pipe(operators_1.distinctUntilChanged()).subscribe(function (nextStateValue) { return setValue(nextStateValue); });
            return function cleanup() {
                subscription.unsubscribe();
            };
        }, [output$]);
        function updateStore(updateFunction) {
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
                type: '@RX/UPDATE_USE_STORE_HOOK',
                payload: {
                    func: updateFunction.toString(),
                },
            });
        }
        return { store: value, updateStore: updateStore };
    }
    return useTransaction;
}
exports.createUseTransactionHook = createUseTransactionHook;
//# sourceMappingURL=create-use-transaction-hook.js.map