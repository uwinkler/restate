"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cloneDeep_1 = __importDefault(require("lodash/cloneDeep"));
var immer_1 = require("immer");
var rxjs_1 = require("rxjs");
var rx_store_1 = require("./rx-store");
var defaultOptions = {
    freeze: true,
    storeName: "STORE"
};
function createStore(_a) {
    var state = _a.state, _b = _a.options, options = _b === void 0 ? defaultOptions : _b;
    var opts = __assign({}, defaultOptions, options);
    immer_1.setAutoFreeze(opts.freeze);
    var clone = cloneDeep_1.default(state);
    var state$ = new rxjs_1.BehaviorSubject(clone);
    return rx_store_1.RxStore.of(state$, opts);
}
exports.createStore = createStore;
//# sourceMappingURL=create-store.js.map