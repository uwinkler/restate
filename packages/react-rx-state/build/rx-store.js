"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
        if (metaInfo === void 0) { metaInfo = defaultMetaInfo; }
        return __awaiter(this, void 0, void 0, function () {
            var currentState, isUpdateFunction, draft, draftMetaInfos, nextState, nextMetaInfo, e_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        currentState = this.state$.value;
                        isUpdateFunction = updateFunctionOrNextState instanceof Function;
                        draft = isUpdateFunction
                            ? immer_1.createDraft(currentState)
                            : immer_1.createDraft(updateFunctionOrNextState);
                        draftMetaInfos = immer_1.createDraft(metaInfo);
                        if (!(updateFunctionOrNextState instanceof Function)) return [3 /*break*/, 2];
                        return [4 /*yield*/, updateFunctionOrNextState(draft)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, recursiveMiddlewareHandler(this._middlewares, draft, draftMetaInfos)];
                    case 3:
                        _a.sent();
                        nextState = immer_1.finishDraft(draft, function (patches, inversePatches) {
                            _this.patches$.next(patches);
                            _this.inversePatches$.next(inversePatches);
                        });
                        console.log("NEXT", nextState);
                        nextMetaInfo = immer_1.finishDraft(draftMetaInfos);
                        this.state$.next(nextState);
                        this.meta$.next(nextMetaInfo);
                        this.error$.next(null);
                        return [2 /*return*/, { state: nextState, metaInfo: nextMetaInfo }];
                    case 4:
                        e_1 = _a.sent();
                        this._error$.next({ error: e_1, state: this.state$.value, metaInfo: metaInfo });
                        return [2 /*return*/, e_1];
                    case 5: return [2 /*return*/];
                }
            });
        });
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
function recursiveMiddlewareHandler(middlewares, state, metaInfo) {
    return __awaiter(this, void 0, void 0, function () {
        var nextCall, rest, nextFunction;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (middlewares.length === 0) {
                        return [2 /*return*/, {
                                state: state,
                                metaInfo: metaInfo
                            }];
                    }
                    nextCall = middlewares[0];
                    rest = middlewares.slice(1, middlewares.length);
                    nextFunction = function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, recursiveMiddlewareHandler(rest, state, metaInfo)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    return [4 /*yield*/, nextCall({
                            state: state,
                            metaInfo: metaInfo,
                            next: nextFunction
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
//# sourceMappingURL=rx-store.js.map