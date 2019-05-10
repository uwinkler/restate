"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var isEqual_1 = __importDefault(require("lodash/isEqual"));
var immer_1 = __importDefault(require("immer"));
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
exports.UPDATE = "@RX/UPDATE";
var defaultMetaInfo = {
    type: exports.UPDATE
};
exports.INIT_MESSAGAE = {
    type: "@RX/INIT"
};
var RxStore = /** @class */ (function () {
    function RxStore(x, options) {
        this._meta$ = new rxjs_1.BehaviorSubject(exports.INIT_MESSAGAE);
        this._patches$ = new rxjs_1.BehaviorSubject([]);
        this._inversePatches$ = new rxjs_1.BehaviorSubject([]);
        this._messageBus$ = new rxjs_1.BehaviorSubject(exports.INIT_MESSAGAE);
        this._state$ = x;
        this._options = options;
    }
    RxStore.of = function (state, options) {
        return new RxStore(state, options);
    };
    RxStore.prototype.subStore = function (selector) {
        var _this = this;
        var initalState = selector(this.state$.value);
        var subStoreObservable$ = new rxjs_1.BehaviorSubject(initalState);
        var subStore = RxStore.of(subStoreObservable$, this._options);
        //
        //  Upstream subscription
        //
        subStore.state$.subscribe(function (nextSubState) {
            var currentState = _this._state$.value;
            var nextState = immer_1.default(currentState, function (draft) {
                var subState = selector(draft);
                Object.assign(subState, nextSubState);
            });
            if (!isEqual_1.default(currentState, nextState)) {
                _this.next(function (_) { return nextState; });
            }
        });
        //
        // Downstream
        //
        this.state$
            .pipe(operators_1.map(selector), operators_1.distinctUntilChanged())
            .subscribe(function (nextSubState) {
            var currentSubStoreState = subStore.state;
            if (!isEqual_1.default(nextSubState, currentSubStoreState)) {
                subStore.next(function (_) { return nextSubState; });
            }
        });
        //
        // Meta
        //
        // we only upstram meta information, not downstream.
        subStore.meta$
            .pipe(operators_1.distinctUntilChanged())
            .subscribe(function (meta) { return _this.meta$.next(meta); });
        // Message Bus
        //
        // down-stream and up-stream messages, we simply share the messageBus Subject
        subStore._messageBus$ = this._messageBus$;
        return subStore;
    };
    RxStore.prototype.next = function (updateFunction, metaInfo) {
        var _this = this;
        if (metaInfo === void 0) { metaInfo = defaultMetaInfo; }
        var currentState = this.state$.value;
        var nextState = immer_1.default(currentState, function (draftState) {
            return updateFunction(draftState);
        }, function (patches, inversePatches) {
            _this.patches$.next(patches);
            _this.inversePatches$.next(inversePatches);
        });
        this.state$.next(nextState);
        this.meta$.next(metaInfo);
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
    Object.defineProperty(RxStore.prototype, "options", {
        get: function () {
            return this._options;
        },
        enumerable: true,
        configurable: true
    });
    return RxStore;
}());
exports.RxStore = RxStore;
//# sourceMappingURL=rx-store.js.map