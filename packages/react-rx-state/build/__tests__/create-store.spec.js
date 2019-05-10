"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var create_store_1 = require("../create-store");
var immer_1 = require("immer");
it("should create a simple store", function () {
    var state = { a: 1 };
    var store = create_store_1.createStore({ state: state });
    expect(store.state).not.toBe(state); // Object.is equality - should not be the same object
    expect(store.state).toEqual(state); // but state should look equal
});
it("should be able to set a next state", function () {
    var orgState = { a: 1 };
    var store = create_store_1.createStore({ state: orgState });
    store.next(function (s) {
        s.a = 2;
    });
    var nextStaet = store.state;
    expect(orgState).toEqual({ a: 1 });
    expect(nextStaet).toEqual({ a: 2 });
});
it("should be able to freeze non-plain objects", function () {
    var _a;
    var State = /** @class */ (function () {
        function State() {
            this[_a] = true;
            this.a = 1;
        }
        return State;
    }());
    _a = immer_1.immerable;
    var state = new State();
    var store = create_store_1.createStore({ state: state });
    store.next(function (s) {
        s.a = 2;
    });
    var nextState = store.state;
    expect(state.a).toBe(1);
    expect(nextState.a).toBe(2);
});
it("state should be alter after calling next", function () {
    var state = { a: 1 };
    var store = create_store_1.createStore({ state: state });
    store.next(function (s) {
        s.a = 2;
    });
    expect(store.state.a).toBe(2);
    expect(Object.isFrozen(store.state)).toBe(true);
});
it("state should not be mutated", function () {
    var state = { a: 1 };
    var store = create_store_1.createStore({ state: state });
    expect(store.state.a).toBe(1);
    // expect(Object.isFrozen(store.state)).toBe(true)
});
exports.default = {};
//# sourceMappingURL=create-store.spec.js.map