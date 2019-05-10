"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var create_store_1 = require("../create-store");
var immer_1 = require("immer");
var connect_message_bus_1 = require("../connect-message-bus");
var rx_store_1 = require("../rx-store");
it('should be able to set a next state', function () {
    var orgState = { a: 1 };
    var store = create_store_1.createStore({ state: orgState });
    store.next(function (s) {
        s.a = 2;
    });
    var nextStaet = store.state;
    expect(orgState).toEqual({ a: 1 });
    expect(nextStaet).toEqual({ a: 2 });
    expect(Object.isFrozen(store.state)).toBe(true);
});
it('should be able to use non-plain objects (immer style)', function () {
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
it('should be able to use sub-stores: upstream updates', function () {
    var orgState = { a: 1, sub: { b: 2 } };
    var store = create_store_1.createStore({ state: orgState });
    var subscriberStore = jest.fn();
    store.state$.subscribe(subscriberStore);
    expect(subscriberStore).toHaveBeenCalledTimes(1); // First subscribtion
    var subStore = store.subStore(function (s) { return s.sub; });
    var subscriberSubStore = jest.fn();
    store.state$.subscribe(subscriberSubStore);
    expect(subscriberSubStore).toHaveBeenCalledTimes(1); // First subscribtion
    //
    // New state
    //
    subStore.next(function (subState) {
        subState.b = 3;
    });
    expect(store.state).toEqual({
        a: 1,
        sub: { b: 3 },
    });
    expect(subscriberStore).toHaveBeenCalledTimes(2);
    expect(subStore.state).toEqual({ b: 3 });
    expect(subscriberSubStore).toHaveBeenCalledTimes(2);
});
it('should be able to use sub-stores: upstream updates', function () {
    var orgState = { a: 1, sub: { b: 2 } };
    var store = create_store_1.createStore({ state: orgState });
    var subStore = store.subStore(function (s) { return s.sub; });
    store.next(function (s) {
        s.sub.b = 3;
    });
    expect(subStore.state).toEqual({ b: 3 });
    expect(store.state).toEqual({
        a: 1,
        sub: { b: 3 },
    });
});
it('substore should NOT be notified, if we change a value outside of the sub-stores realm', function () {
    var orgState = { a: 1, sub: { b: 2 } };
    var store = create_store_1.createStore({ state: orgState });
    var subStore = store.subStore(function (s) { return s.sub; });
    // SubState
    var subscriberSubStateMock = jest.fn();
    subStore.state$.subscribe(subscriberSubStateMock);
    expect(subscriberSubStateMock).toHaveBeenCalledTimes(1); // inital subscription
    // Meta
    var subscriberSubMetaMock = jest.fn();
    subStore.meta$.subscribe(subscriberSubMetaMock);
    expect(subscriberSubMetaMock).toHaveBeenCalledTimes(1); // inital subscription
    // Next state
    store.next(function (s) {
        s.a = 2;
    });
    expect(subscriberSubStateMock).toHaveBeenCalledTimes(1); // still have been called only once
    expect(subscriberSubMetaMock).toHaveBeenCalledTimes(1); // still have been called only once
});
it('messages should be shared by the the parent store and sub-stores', function () {
    var orgState = { a: 1, sub: { b: 2 } };
    var rootStore = create_store_1.createStore({ state: orgState });
    var subStore = rootStore.subStore(function (s) { return s.sub; });
    var rootStoreListener = jest.fn();
    connect_message_bus_1.connectMessageBus(rootStore, rootStoreListener);
    expect(rootStoreListener).toBeCalledWith({ message: rx_store_1.INIT_MESSAGAE, store: rootStore });
    var subStoreListener = jest.fn();
    connect_message_bus_1.connectMessageBus(subStore, subStoreListener);
    expect(subStoreListener).toBeCalledWith({ message: rx_store_1.INIT_MESSAGAE, store: subStore });
    var messageRoot = { type: 'TEST_FROM_ROOT' };
    rootStore.dispatch(messageRoot);
    expect(rootStoreListener).toHaveBeenCalledWith({ message: messageRoot, store: rootStore });
    expect(subStoreListener).toHaveBeenCalledWith({ message: messageRoot, store: subStore });
    var messageSubStore = { type: 'TEST_SUB_STORE' };
    subStore.dispatch(messageSubStore);
    expect(rootStoreListener).toHaveBeenCalledWith({ message: messageSubStore, store: rootStore });
    expect(subStoreListener).toHaveBeenCalledWith({ message: messageSubStore, store: subStore });
});
exports.default = {};
//# sourceMappingURL=rx-store.spec.js.map