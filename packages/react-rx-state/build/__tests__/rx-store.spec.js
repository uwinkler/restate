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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var create_store_1 = require("../create-store");
var immer_1 = require("immer");
it("should be able to set a next state", function () { return __awaiter(_this, void 0, void 0, function () {
    var orgState, store, nextState;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                orgState = { a: 1 };
                store = create_store_1.createStore({ state: orgState });
                return [4 /*yield*/, store.next(function (s) {
                        s.a = 2;
                    })];
            case 1:
                _a.sent();
                nextState = store.state;
                expect(orgState).toEqual({ a: 1 });
                expect(nextState).toEqual({ a: 2 });
                expect(Object.isFrozen(store.state)).toBe(true);
                return [2 /*return*/];
        }
    });
}); });
it("should be able to use non-plain objects (immer style)", function () { return __awaiter(_this, void 0, void 0, function () {
    var _a, State, state, store, nextState;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                State = /** @class */ (function () {
                    function State() {
                        this[_a] = true;
                        this.a = 1;
                    }
                    State.prototype.aPlusOne = function () {
                        return this.a + 1;
                    };
                    return State;
                }());
                _a = immer_1.immerable;
                state = new State();
                store = create_store_1.createStore({ state: state });
                return [4 /*yield*/, store.next(function (s) {
                        s.a = 2;
                    })];
            case 1:
                _b.sent();
                nextState = store.state;
                expect(state.a).toBe(1);
                expect(state.aPlusOne()).toEqual(2);
                expect(nextState.a).toBe(2);
                expect(nextState.aPlusOne()).toEqual(3);
                return [2 /*return*/];
        }
    });
}); });
it("should use middleware", function () { return __awaiter(_this, void 0, void 0, function () {
    var store, plusOne;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                store = create_store_1.createStore({
                    state: {
                        a: 1
                    }
                });
                plusOne = function (_a) {
                    var state = _a.state, next = _a.next;
                    state.a = state.a + 1;
                    next();
                };
                store.middlewares.push(plusOne);
                return [4 /*yield*/, store.next(function (s) {
                        s.a = 2;
                    })];
            case 1:
                _a.sent();
                expect(store.state.a).toEqual(3);
                return [2 /*return*/];
        }
    });
}); });
it("should not call subsequent middlewares if next() is not called", function () { return __awaiter(_this, void 0, void 0, function () {
    var store, doNotCallNext, setToThree;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                store = create_store_1.createStore({
                    state: {
                        a: 1
                    }
                });
                doNotCallNext = function () {
                    // Do not call next
                };
                setToThree = function (_a) {
                    var state = _a.state, next = _a.next;
                    state.a = 3;
                    next();
                };
                store.middlewares.push(doNotCallNext, setToThree);
                return [4 /*yield*/, store.next(function (s) {
                        s.a = 2;
                    })];
            case 1:
                _a.sent();
                expect(store.state.a).toEqual(2);
                return [2 /*return*/];
        }
    });
}); });
it("should not call subsequent middlewares if next() is not called", function () { return __awaiter(_this, void 0, void 0, function () {
    var store, doNotCallNext, setToThree;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                store = create_store_1.createStore({
                    state: {
                        a: 1
                    }
                });
                doNotCallNext = function () {
                    // Do not call next
                };
                setToThree = function (_a) {
                    var state = _a.state, next = _a.next;
                    state.a = 3;
                    next();
                };
                store.middlewares.push(doNotCallNext, setToThree);
                return [4 /*yield*/, store.next(function (s) {
                        s.a = 2;
                    })];
            case 1:
                _a.sent();
                expect(store.state.a).toEqual(2);
                return [2 /*return*/];
        }
    });
}); });
it("should use multiple middleware", function () { return __awaiter(_this, void 0, void 0, function () {
    var store, plusOne;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                store = create_store_1.createStore({
                    state: {
                        a: 1
                    }
                });
                plusOne = function (_a) {
                    var state = _a.state, next = _a.next;
                    state.a = state.a + 1;
                    next();
                };
                store.middlewares.push(plusOne, plusOne);
                return [4 /*yield*/, store.next(function (s) {
                        s.a = 2;
                    })];
            case 1:
                _a.sent();
                expect(store.state.a).toEqual(4);
                return [2 /*return*/];
        }
    });
}); });
it("should use async middleware", function () { return __awaiter(_this, void 0, void 0, function () {
    var store, plusOne;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                store = create_store_1.createStore({
                    state: {
                        a: 1
                    }
                });
                plusOne = function (_a) {
                    var state = _a.state, next = _a.next;
                    return new Promise(function (resolve) {
                        setTimeout(function () {
                            state.a = state.a + 1;
                            next();
                            resolve();
                        }, 10);
                    });
                };
                store.middlewares.push(plusOne);
                return [4 /*yield*/, store.next(function (s) {
                        s.a = 2;
                    })];
            case 1:
                _a.sent();
                expect(store.state.a).toEqual(3);
                return [2 /*return*/];
        }
    });
}); });
it("should be able to use middleware in reverse order", function () { return __awaiter(_this, void 0, void 0, function () {
    var store, plusOne, logMiddleware;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                store = create_store_1.createStore({
                    state: {
                        a: 1
                    }
                });
                plusOne = function (_a) {
                    var state = _a.state, next = _a.next;
                    state.a = state.a + 1;
                    next();
                };
                logMiddleware = function (_a) {
                    var state = _a.state, next = _a.next;
                    return __awaiter(_this, void 0, void 0, function () {
                        var start, end;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    start = state.a;
                                    return [4 /*yield*/, next()];
                                case 1:
                                    _b.sent();
                                    end = state.a;
                                    expect(start).toEqual(2); // first we get a 2
                                    expect(end).toEqual(3); // then plusOne should have been called
                                    return [2 /*return*/];
                            }
                        });
                    });
                };
                store.middlewares.push(logMiddleware, plusOne);
                return [4 /*yield*/, store.next(function (s) {
                        s.a = 2;
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
it("should be able to throw", function () { return __awaiter(_this, void 0, void 0, function () {
    var store, errorMiddleware;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                store = create_store_1.createStore({
                    state: {
                        a: 1
                    }
                });
                errorMiddleware = function () {
                    throw Error("error!");
                };
                store.middlewares.push(errorMiddleware);
                return [4 /*yield*/, store.next(function (s) {
                        s.a = 2;
                    })];
            case 1:
                _a.sent();
                expect(store.state.a).toEqual(1); // no update
                expect(store.error$.value.error).toBeDefined();
                expect(store.error$.value.state).toEqual({
                    a: 1
                });
                return [2 /*return*/];
        }
    });
}); });
it("should return default options", function () {
    var store = create_store_1.createStore({
        state: { value: 1 }
    });
    expect(store.options.freeze).toBeTruthy();
    expect(store.options.storeName).toEqual("STORE");
});
it("should return options", function () {
    var store = create_store_1.createStore({
        state: { value: 1 },
        options: { freeze: true, storeName: "TEST" }
    });
    expect(store.options.freeze).toBeTruthy();
    expect(store.options.storeName).toEqual("TEST");
});
it("freeze: should freeze the state if the freeze options is set to true", function () { return __awaiter(_this, void 0, void 0, function () {
    function shouldThrow() {
        var state = store.state$.value;
        state.value = 3;
    }
    var store;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                store = create_store_1.createStore({
                    state: { value: 1 },
                    options: { freeze: true }
                });
                return [4 /*yield*/, store.next(function (s) {
                        s.value = 2;
                    })];
            case 1:
                _a.sent();
                expect(shouldThrow).toThrow();
                return [2 /*return*/];
        }
    });
}); });
it("freeze: should not freeze the state if the freeze options is set to false", function () { return __awaiter(_this, void 0, void 0, function () {
    function shouldNotThrow() {
        var state = store.state$.value;
        state.value = 3;
    }
    var store;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                store = create_store_1.createStore({
                    state: { value: 1 },
                    options: { freeze: false }
                });
                return [4 /*yield*/, store.next(function (s) {
                        s.value = 2;
                    })];
            case 1:
                _a.sent();
                expect(shouldNotThrow).not.toThrow();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=rx-store.spec.js.map