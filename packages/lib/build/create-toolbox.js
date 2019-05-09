"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var immer_1 = __importDefault(require("immer"));
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var defaultMetaInfo = {
    type: "@RX/TOOLBOX"
};
var identitySelectorFunction = function (state) { return state; };
function createPropsForForges(store, selectorFunction) {
    var selector = selectorFunction
        ? selectorFunction
        : identitySelectorFunction;
    var state$ = store.state$;
    var subState$ = new rxjs_1.BehaviorSubject(selectorFunction(store.state$.value));
    var subscription = store.state$
        .pipe(operators_1.map(selectorFunction), operators_1.distinctUntilChanged())
        .subscribe(function (nextValue) { return subState$.next(nextValue); });
    function next(updateFunction, metaInfo) {
        if (metaInfo === void 0) { metaInfo = defaultMetaInfo; }
        var currentState = state$.value;
        var nextState = immer_1.default(currentState, function (draftState) {
            var subState = selector(draftState);
            updateFunction(subState);
            return draftState;
        }, function (patches, inversePatches) {
            store.patches$.next(patches);
            store.inversePatches$.next(inversePatches);
        });
        state$.next(nextState);
        store.meta$.next(metaInfo);
    }
    store.messageBus$;
    return {
        state$: subState$,
        meta$: store.meta$,
        messageBus$: store.messageBus$,
        next: next,
        store: store,
        subscription: subscription
    };
}
function createToolbox(store, selectorFunction, forge) {
    var props = createPropsForForges(store, selectorFunction);
    return forge(props);
}
exports.createToolbox = createToolbox;
//# sourceMappingURL=create-toolbox.js.map