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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
require("jsdom-global/register");
var enzyme_adapter_react_16_1 = __importDefault(require("enzyme-adapter-react-16"));
var react_1 = __importDefault(require("react"));
var enzyme_1 = require("enzyme");
var create_provider_1 = require("../create-provider");
var create_store_1 = require("../create-store");
var create_state_hook_1 = require("../create-state-hook");
var create_next_hook_1 = require("../create-next-hook");
var react_test_renderer_1 = require("react-test-renderer");
/**
 *
 * :warning: Known issue: https://github.com/facebook/react/issues/14769
 *
 * Warning: An update to TestComponent inside a test was not wrapped in act(...).
      
      When testing, code that causes React state updates should be wrapped into act(...):
      
      act(() => {

      });

      
      This ensures that you're testing the behavior the user would see in the browser. Learn more at https://fb.me/react-wrap-tests-with-act
          in TestComponent
          in WrapperComponent
 */
enzyme_1.configure({ adapter: new enzyme_adapter_react_16_1.default() });
it("should update a state", function () { return __awaiter(_this, void 0, void 0, function () {
    var state, store, AppStoreProvider, useAppState, useNextAppState, TestComponent, component;
    return __generator(this, function (_a) {
        state = { value: 1 };
        store = create_store_1.createStore({ state: state });
        AppStoreProvider = create_provider_1.createProvider(store);
        useAppState = create_state_hook_1.createStateHook(AppStoreProvider);
        useNextAppState = create_next_hook_1.createNextHook(AppStoreProvider);
        TestComponent = function () {
            var x = useAppState(function (s) { return s; });
            var nextAppState = useNextAppState(function (s) { return s; });
            function increment() {
                nextAppState(function (s) {
                    s.value = s.value + 1;
                });
            }
            return (react_1.default.createElement("button", { className: "btn", onClick: increment }, x.value));
        };
        react_test_renderer_1.act(function () {
            component = enzyme_1.mount(react_1.default.createElement(AppStoreProvider.Provider, { value: store },
                react_1.default.createElement(TestComponent, null)));
        });
        expect(component.html()).toMatchInlineSnapshot("\"<button class=\\\"btn\\\">1</button>\"");
        react_test_renderer_1.act(function () {
            var btn = component.find(".btn");
            btn.simulate("click");
        });
        process.nextTick(function () {
            expect(store.state.value).toEqual(2);
            expect(component.html()).toMatchInlineSnapshot("\"<button class=\\\"btn\\\">2</button>\"");
        });
        return [2 /*return*/];
    });
}); });
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
    process.nextTick(function () {
        expect(store.state.value).toEqual(2);
        expect(component.html()).toMatchInlineSnapshot("\"<button class=\\\"btn\\\">2</button>\"");
    });
});
it("should update a scoped state", function () {
    var state = { subState: { value: 1 } };
    var store = create_store_1.createStore({ state: state });
    var AppStoreProvider = create_provider_1.createProvider(store);
    var useAppState = create_state_hook_1.createStateHook(AppStoreProvider);
    var useNextAppState = create_next_hook_1.createNextHook(AppStoreProvider, function (state) { return state.subState; });
    var TestComponent = function () {
        var x = useAppState(function (s) { return s; });
        var nextAppState = useNextAppState(function (s) { return s; });
        function increment() {
            nextAppState(function (s) {
                s.value = s.value + 1;
            });
        }
        return (react_1.default.createElement("button", { className: "btn", onClick: increment }, x.subState.value));
    };
    var component = enzyme_1.mount(react_1.default.createElement(AppStoreProvider.Provider, { value: store },
        react_1.default.createElement(TestComponent, null)));
    expect(component.html()).toMatchInlineSnapshot("\"<button class=\\\"btn\\\">1</button>\"");
    var btn = component.find(".btn");
    btn.simulate("click");
    process.nextTick(function () {
        expect(store.state.subState.value).toEqual(2);
        expect(component.html()).toMatchInlineSnapshot("\"<button class=\\\"btn\\\">2</button>\"");
    });
});
//# sourceMappingURL=create-next-hook.spec.js.map