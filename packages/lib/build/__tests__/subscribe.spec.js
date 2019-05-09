"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Rx = __importStar(require(".."));
var react_1 = __importDefault(require("react"));
var react_test_renderer_1 = __importDefault(require("react-test-renderer"));
var subscribe_1 = require("../subscribe");
var defaultAppState = {
    servus: "rx-state"
};
var appStore = Rx.createStore({ state: defaultAppState });
var TestStoreProvider = Rx.createProvider(appStore);
var withTestStore = Rx.createWithStoreHoc(TestStoreProvider);
describe("subscribe", function () {
    test("should subscribe", function () {
        var TestComponent = /** @class */ (function (_super) {
            __extends(TestComponent, _super);
            function TestComponent() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.state = {
                    greetings: ""
                };
                _this.sub = null;
                return _this;
            }
            TestComponent.prototype.componentDidMount = function () {
                var _this = this;
                this.sub = subscribe_1.subscribe(this.props.rxStore)
                    .select(function (store) { return store.servus; })
                    .mount(function (nextServus) { return _this.setState({ greetings: nextServus }); });
            };
            TestComponent.prototype.componentWillUnmount = function () {
                if (this.sub) {
                    this.sub.unsubscribe();
                }
            };
            TestComponent.prototype.render = function () {
                return react_1.default.createElement("div", null, this.state.greetings);
            };
            return TestComponent;
        }(react_1.default.Component));
        var ConnectedComponent = withTestStore(TestComponent);
        var component = react_test_renderer_1.default.create(react_1.default.createElement(TestStoreProvider.Provider, { value: appStore },
            react_1.default.createElement(ConnectedComponent, null)));
        var tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});
exports.default = {}; // ?
//# sourceMappingURL=subscribe.spec.js.map