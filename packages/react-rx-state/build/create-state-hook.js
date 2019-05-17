"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var react_1 = require("react");
var isEqual_1 = __importDefault(require("lodash/isEqual"));
var identifySelectorFunction = function (state) { return state; };
//
// createStateHook implementation
//
function createStateHook(context, outerSelector) {
    if (outerSelector === void 0) { outerSelector = identifySelectorFunction; }
    function useAppState(selectorFunction) {
        var _store = react_1.useContext(context);
        var selector = selectorFunction
            ? selectorFunction
            : identifySelectorFunction;
        var state$ = _store.state$;
        var startValue = selector(outerSelector(state$.value));
        var _a = react_1.useState(startValue), value = _a[0], setValue = _a[1];
        var output$ = react_1.useMemo(function () {
            return new rxjs_1.BehaviorSubject(startValue);
        }, [state$]);
        react_1.useEffect(function () {
            var subscription = state$.subscribe(function (nextStateValue) {
                var nextSubValue = selector(outerSelector(nextStateValue));
                output$.next(nextSubValue);
            });
            output$
                .pipe(operators_1.distinctUntilChanged(isEqual_1.default))
                .subscribe(function (nextStateValue) { return setValue(nextStateValue); });
            return function cleanup() {
                subscription.unsubscribe();
            };
        }, [output$]);
        return value;
    }
    return useAppState;
}
exports.createStateHook = createStateHook;
//# sourceMappingURL=create-state-hook.js.map