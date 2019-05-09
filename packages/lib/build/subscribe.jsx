"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var operators_1 = require("rxjs/operators");
function subscribe(store) {
    return {
        select: function (selectorFunction) {
            return {
                mount: function (mount) {
                    return store.state$
                        .pipe(operators_1.map(selectorFunction), operators_1.distinctUntilChanged())
                        .subscribe(function (nextState) {
                        mount(nextState);
                    });
                },
            };
        },
    };
}
exports.subscribe = subscribe;
//# sourceMappingURL=subscribe.jsx.map