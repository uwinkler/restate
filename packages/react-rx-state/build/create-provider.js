"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
function createProvider(store) {
    return react_1.default.createContext(store);
}
exports.createProvider = createProvider;
//# sourceMappingURL=create-provider.js.map