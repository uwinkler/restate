"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var immer_1 = require("immer");
exports.UPDATE = "@RX/UPDATE";
var defaultMetaInfo = {
    type: exports.UPDATE
};
exports.INIT_MESSAGE = {
    type: "@RX/INIT"
};
var RxStore = /** @class */ (function () {
    function RxStore(x, options) {
        this._meta$ = new rxjs_1.BehaviorSubject(exports.INIT_MESSAGE);
        this._patches$ = new rxjs_1.BehaviorSubject([]);
        this._inversePatches$ = new rxjs_1.BehaviorSubject([]);
        this._messageBus$ = new rxjs_1.BehaviorSubject(exports.INIT_MESSAGE);
        this._error$ = new rxjs_1.BehaviorSubject(null);
        this._middlewares = [];
        this._state$ = x;
        this._options = options;
    }
    RxStore.of = function (state, options) {
        return new RxStore(state, options);
    };
    RxStore.prototype.next = function (updateFunctionOrNextState, metaInfo) {
        var _this = this;
        if (metaInfo === void 0) { metaInfo = defaultMetaInfo; }
        try {
            var currentState = this.state$.value;
            var isUpdateFunction = updateFunctionOrNextState instanceof Function;
            var draft = isUpdateFunction
                ? immer_1.createDraft(currentState)
                : immer_1.createDraft(updateFunctionOrNextState);
            var draftMetaInfos = immer_1.createDraft(metaInfo);
            if (updateFunctionOrNextState instanceof Function) {
                updateFunctionOrNextState(draft);
            }
            // await recursiveMiddlewareHandler(this._middlewares, draft, draftMetaInfos)
            var nextState = immer_1.finishDraft(draft, function (patches, inversePatches) {
                _this.patches$.next(patches);
                _this.inversePatches$.next(inversePatches);
            });
            console.log("NEXT", nextState);
            var nextMetaInfo = immer_1.finishDraft(draftMetaInfos);
            this.state$.next(nextState);
            this.meta$.next(nextMetaInfo);
            this.error$.next(null);
            return { state: nextState, metaInfo: nextMetaInfo };
        }
        catch (e) {
            this._error$.next({ error: e, state: this.state$.value, metaInfo: metaInfo });
            return e;
        }
    };
    RxStore.prototype.dispatch = function (message) {
        this.messageBus$.next(message);
    };
    Object.defineProperty(RxStore.prototype, "state", {
        get: function () {
            return this._state$.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RxStore.prototype, "state$", {
        get: function () {
            return this._state$;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RxStore.prototype, "patches$", {
        get: function () {
            return this._patches$;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RxStore.prototype, "inversePatches$", {
        get: function () {
            return this._inversePatches$;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RxStore.prototype, "meta$", {
        get: function () {
            return this._meta$;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RxStore.prototype, "messageBus$", {
        get: function () {
            return this._messageBus$;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RxStore.prototype, "error$", {
        get: function () {
            return this._error$;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RxStore.prototype, "options", {
        get: function () {
            return this._options;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RxStore.prototype, "middlewares", {
        get: function () {
            return this._middlewares;
        },
        enumerable: true,
        configurable: true
    });
    return RxStore;
}());
exports.RxStore = RxStore;
// async function recursiveMiddlewareHandler<STATE>(
//   middlewares: Middleware<STATE>[],
//   state: STATE,
//   metaInfo: MetaInfo
// ) {
//   if (middlewares.length === 0) {
//     return {
//       state,
//       metaInfo
//     }
//   }
//   const nextCall = middlewares[0]
//   const rest = middlewares.slice(1, middlewares.length)
//   const nextFunction = async () => {
//     await recursiveMiddlewareHandler(rest, state, metaInfo)
//   }
//   return await nextCall({
//     state,
//     metaInfo,
//     next: nextFunction
//   })
// }
//# sourceMappingURL=rx-store.js.map