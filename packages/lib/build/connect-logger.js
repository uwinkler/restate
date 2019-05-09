"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
function connectLogger(appStore) {
    var name = appStore.options.storeName === "" ? "RxState" : appStore.options.storeName;
    rxjs_1.zip(appStore.state$, appStore.meta$, appStore.patches$)
        .pipe(operators_1.distinctUntilChanged(), operators_1.pairwise())
        .subscribe(function (update) {
        var prevUpdate = update[0], currentUpdate = update[1];
        var currentState = currentUpdate[0], meta = currentUpdate[1], patches = currentUpdate[2];
        var prevState = prevUpdate[0];
        console.groupCollapsed("[" + name + "]: " + meta.type);
        formatPatches(patches, prevState, currentState);
        console.log("State:", currentState);
        console.log("Meta:", meta);
        console.groupEnd();
    });
    appStore.messageBus$.subscribe(function (message) {
        console.groupCollapsed("[" + name + "] Message: " + message.type, message.payload);
        console.log(message.payload);
        console.groupEnd();
    });
}
exports.connectLogger = connectLogger;
function formatPatches(patches, _prevState, _currentState) {
    patches.forEach(function (patch) {
        var path = patch.path.join(".");
        switch (patch.op) {
            case "add": {
                console.groupCollapsed('%c Add "' + path + '":', "color: green", patch.value);
                console.log(JSON.stringify(patch.value, null, 2));
                console.groupEnd();
                break;
            }
            case "remove": {
                console.groupCollapsed('%c Remove "' + path + '":', "color: red", patch.value);
                console.log(JSON.stringify(patch.value, null, 2));
                console.groupEnd();
                break;
            }
            case "replace": {
                console.groupCollapsed('%c Replace "' + path + '":', "color: #008800", patch.value);
                console.log(JSON.stringify(patch.value, null, 2));
                console.groupEnd();
                break;
            }
            default: {
                console.groupCollapsed('%c Default "' + path + '":', "color: green", patch.value);
                console.log(JSON.stringify(patch.value, null, 2));
                console.groupEnd();
            }
        }
    });
}
//# sourceMappingURL=connect-logger.js.map