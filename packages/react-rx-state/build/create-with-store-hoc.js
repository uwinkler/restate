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
var react_1 = __importDefault(require("react"));
function createWithStoreHoc(Context) {
    return function withStore(Component) {
        return function WithRxStoreHoc(props) {
            return react_1.default.createElement(Context.Consumer, null, function (store) { return react_1.default.createElement(Component, __assign({ rxStore: store }, props)); });
        };
    };
}
exports.createWithStoreHoc = createWithStoreHoc;
//# sourceMappingURL=create-with-store-hoc.js.map