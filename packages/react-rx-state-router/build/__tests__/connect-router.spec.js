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
Object.defineProperty(exports, "__esModule", { value: true });
var react_rx_state_1 = require("react-rx-state");
var __1 = require("../");
var history_1 = require("history");
it("should provide histor", function () {
    var defaultState = {
        value: 0,
        location: __assign({}, __1.defaultRouterState, { state: { routerInfo: 0 } })
    };
    var store = react_rx_state_1.createStore({ state: defaultState });
    var history = history_1.createMemoryHistory();
    __1.connectReactRouter({ appStore: store, history: history });
    expect(store.state$.value.location.pathname).toEqual("/");
    expect(store.state$.value.location.state).toEqual({ routerInfo: 0 });
    history.push("/new_path", { routerInfo: 1 });
    expect(store.state$.value.location.pathname).toEqual("/new_path");
    expect(store.state$.value.location.state).toEqual({ routerInfo: 1 });
});
//# sourceMappingURL=connect-router.spec.js.map