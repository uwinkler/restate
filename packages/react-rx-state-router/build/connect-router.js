"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultRouterState = {
    pathname: "",
    search: "",
    state: undefined,
    hash: ""
};
var INIT = "HISTORY/INIT";
function connectReactRouter(props) {
    var appStore = props.appStore, history = props.history;
    var currentLocation = props.history.location;
    var initState = appStore.state.location.state;
    appStore.next(function (state) {
        state.location = currentLocation;
        state.location.state = initState;
    }, { type: INIT });
    history.listen(function (location, action) {
        appStore.next(function (state) {
            state.location = Object.assign(state.location, location);
        }, { type: "HISTORY/" + action });
    });
}
exports.connectReactRouter = connectReactRouter;
//# sourceMappingURL=connect-router.js.map