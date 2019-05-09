"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
function createWithStoreHoc(Context) {
    return function withStore(Component) {
        return function WithRxStoreHoc(props) {
            return <Context.Consumer>{function (store) { return <Component rxStore={store} {...props}/>; }}</Context.Consumer>;
        };
    };
}
exports.createWithStoreHoc = createWithStoreHoc;
//# sourceMappingURL=create-with-store-hoc.jsx.map