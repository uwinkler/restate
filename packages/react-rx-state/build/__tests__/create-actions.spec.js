"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Rx = __importStar(require("../index"));
var defaultMainView = { hello: "world" };
var defaultAppState = {
    view: {
        main: defaultMainView
    }
};
var store = Rx.createStore({ state: defaultAppState });
var myOtherStore = Rx.createStore({ state: defaultAppState });
function hello(greetings, _a) {
    var next = _a.next;
    next(function (state) { return (state.hello = greetings); });
}
var mainViewActionsFactory = function (props) { return ({
    hello: function (greetings) { return hello(greetings, props); }
}); };
var mainViewActions = Rx.connectActions(store, function (state) { return state.view.main; }, mainViewActionsFactory);
it("should update store", function () {
    expect(store.state.view.main.hello).toEqual("world");
    mainViewActions.hello("rx-state");
    expect(store.state.view.main.hello).toEqual("rx-state");
    expect(myOtherStore.state.view.main.hello).toEqual("world");
});
exports.default = {};
//# sourceMappingURL=create-actions.spec.js.map