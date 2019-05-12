"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var create_store_1 = require("../create-store");
var create_provider_1 = require("../create-provider");
var react_1 = __importDefault(require("react"));
var react_test_renderer_1 = __importDefault(require("react-test-renderer"));
var create_state_hook_1 = require("../create-state-hook");
it("should create default hook", function () {
    var state = { value: 1 };
    var store = create_store_1.createStore({ state: state });
    var AppStoreProvider = create_provider_1.createProvider(store);
    var useAppStore = create_state_hook_1.createStateHook(AppStoreProvider);
    var TestComponent = function () {
        var x = useAppStore(function (s) { return s; });
        return react_1.default.createElement("div", null, x.value);
    };
    var component = react_test_renderer_1.default.create(react_1.default.createElement(AppStoreProvider.Provider, { value: store },
        react_1.default.createElement(TestComponent, null)));
    var tree = component.toJSON();
    expect(tree).toMatchInlineSnapshot("\n            <div>\n              1\n            </div>\n      ");
});
it("sub-state 1", function () {
    var state = { value: 1 };
    var store = create_store_1.createStore({ state: state });
    var AppStoreProvider = create_provider_1.createProvider(store);
    var useAppStore = create_state_hook_1.createStateHook(AppStoreProvider);
    var TestComponent = function () {
        var value = useAppStore(function (s) { return s.value; });
        return react_1.default.createElement("div", null, value);
    };
    var component = react_test_renderer_1.default.create(react_1.default.createElement(AppStoreProvider.Provider, { value: store },
        react_1.default.createElement(TestComponent, null)));
    var tree = component.toJSON();
    expect(tree).toMatchInlineSnapshot("\n        <div>\n          1\n        </div>\n    ");
});
it("sub-state 2", function () {
    var state = { subState: { value: 1 } };
    var store = create_store_1.createStore({ state: state });
    var AppStoreProvider = create_provider_1.createProvider(store);
    var useAppStoreSubState = create_state_hook_1.createStateHook(AppStoreProvider, function (s) { return s.subState; });
    var TestComponent = function () {
        var subState = useAppStoreSubState(function (s) { return s; });
        return react_1.default.createElement("div", null, subState.value);
    };
    var component = react_test_renderer_1.default.create(react_1.default.createElement(AppStoreProvider.Provider, { value: store },
        react_1.default.createElement(TestComponent, null)));
    var tree = component.toJSON();
    expect(tree).toMatchInlineSnapshot("\n        <div>\n          1\n        </div>\n    ");
});
it("sub-state 1+2", function () {
    var state = { subState: { value: 1 } };
    var store = create_store_1.createStore({ state: state });
    var AppStoreProvider = create_provider_1.createProvider(store);
    var useAppStoreSubState = create_state_hook_1.createStateHook(AppStoreProvider, function (s) { return s.subState; });
    var TestComponent = function () {
        var value = useAppStoreSubState(function (s) { return s.value; });
        expect(typeof value).toEqual("number");
        return react_1.default.createElement("div", null, value);
    };
    var component = react_test_renderer_1.default.create(react_1.default.createElement(AppStoreProvider.Provider, { value: store },
        react_1.default.createElement(TestComponent, null)));
    var tree = component.toJSON();
    expect(tree).toMatchInlineSnapshot("\n          <div>\n            1\n          </div>\n      ");
});
//# sourceMappingURL=create-state-hook.spec.js.map