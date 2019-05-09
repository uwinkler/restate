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
var defaultMainView = { hello: 'world' };
var defaultAppState = {
    view: {
        main: defaultMainView,
    },
};
var store = Rx.createStore({ state: defaultAppState });
var myOtherStore = Rx.createStore({ state: defaultAppState });
var forgeAppState = function (_a) {
    var next = _a.next;
    return ({
        hello: function (greetings) {
            next(function (state) {
                state.hello = greetings;
            });
        },
    });
};
var toolboxAppState = Rx.createToolbox(store, function (state) { return state.view.main; }, forgeAppState);
it('should update store', function () {
    expect(store.state.view.main.hello).toEqual('world');
    toolboxAppState.hello('rx-state');
    expect(store.state.view.main.hello).toEqual('rx-state');
    expect(myOtherStore.state.view.main.hello).toEqual('world');
});
exports.default = {};
//# sourceMappingURL=create-toolbox.spec.js.map