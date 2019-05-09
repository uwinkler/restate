"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultRouterState = {
    location: {
        pathname: "",
        search: "",
        state: {},
        hash: ""
    },
    state: {}
};
var INIT = "HISTORY/INIT";
function connectReactRouter(props) {
    var appStore = props.appStore, history = props.history;
    var currentLocation = props.history.location;
    appStore.next(function (state) {
        state.router.location = currentLocation;
    }, { type: INIT });
    history.listen(function (location, action) {
        appStore.next(function (state) {
            state.router.location = Object.assign(state.router.location, location);
        }, { type: "HISTORY/" + action });
    });
}
exports.connectReactRouter = connectReactRouter;
//# sourceMappingURL=connect-router.js.map