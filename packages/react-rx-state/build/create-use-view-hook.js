"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
function createUseViewHook(provider) {
    function useView(mapFunction) {
        var store = react_1.useContext(provider);
        var state$ = store.state$;
        var _a = react_1.useState(mapFunction(state$.value)), value = _a[0], setValue = _a[1];
        react_1.useEffect(function () {
            var subscribtion = state$.subscribe(function (nextStateValue) {
                return setValue(mapFunction(nextStateValue));
            });
            return function cleanup() {
                subscribtion.unsubscribe();
            };
        }, [state$]);
        return value;
    }
    return useView;
}
exports.createUseViewHook = createUseViewHook;
//# sourceMappingURL=create-use-view-hook.js.map