"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("jsdom-global/register");
var enzyme_adapter_react_16_1 = __importDefault(require("enzyme-adapter-react-16"));
var react_1 = __importDefault(require("react"));
var enzyme_1 = require("enzyme");
var create_provider_1 = require("../create-provider");
var create_store_1 = require("../create-store");
var create_state_hook_1 = require("../create-state-hook");
var create_next_hook_1 = require("../create-next-hook");
enzyme_1.configure({ adapter: new enzyme_adapter_react_16_1.default() });
it("should update a state", function () {
    var state = { value: 1 };
    var store = create_store_1.createStore({ state: state });
    var AppStoreProvider = create_provider_1.createProvider(store);
    var useAppState = create_state_hook_1.createStateHook(AppStoreProvider);
    var useNextAppState = create_next_hook_1.createNextHook(AppStoreProvider);
    var TestComponent = function () {
        var x = useAppState(function (s) { return s; });
        var nextAppState = useNextAppState(function (s) { return s; });
        function increment() {
            nextAppState(function (s) {
                s.value = s.value + 1;
            });
        }
        return (react_1.default.createElement("button", { className: "btn", onClick: increment }, x.value));
    };
    var component = enzyme_1.mount(react_1.default.createElement(AppStoreProvider.Provider, { value: store },
        react_1.default.createElement(TestComponent, null)));
    expect(component.html()).toMatchInlineSnapshot("\"<button class=\\\"btn\\\">1</button>\"");
    var btn = component.find(".btn");
    btn.simulate("click");
    expect(store.state.value).toEqual(2);
    expect(component.html()).toMatchInlineSnapshot("\"<button class=\\\"btn\\\">2</button>\"");
});
it("should update selected properties", function () {
    var state = { value: 1 };
    var store = create_store_1.createStore({ state: state });
    var AppStoreProvider = create_provider_1.createProvider(store);
    var useAppStore = create_state_hook_1.createStateHook(AppStoreProvider);
    var useAppStoreUpdate = create_next_hook_1.createNextHook(AppStoreProvider);
    var TestComponent = function () {
        var value = useAppStore(function (s) { return s.value; });
        var nextStore = useAppStoreUpdate(function (s) { return s; });
        function increment() {
            nextStore(function (s) {
                s.value = s.value + 1;
            });
        }
        return (react_1.default.createElement("button", { className: "btn", onClick: increment }, value));
    };
    var component = enzyme_1.mount(react_1.default.createElement(AppStoreProvider.Provider, { value: store },
        react_1.default.createElement(TestComponent, null)));
    expect(component.html()).toMatchInlineSnapshot("\"<button class=\\\"btn\\\">1</button>\"");
    var btn = component.find(".btn");
    btn.simulate("click");
    expect(store.state.value).toEqual(2);
    expect(component.html()).toMatchInlineSnapshot("\"<button class=\\\"btn\\\">2</button>\"");
});
//# sourceMappingURL=create-next-hook.spec.js.map