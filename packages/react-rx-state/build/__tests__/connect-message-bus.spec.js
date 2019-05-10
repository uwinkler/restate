"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var connect_message_bus_1 = require("../connect-message-bus");
var create_store_1 = require("../create-store");
var index_1 = require("../index");
it('should be able to create a message bus connector listener', function () {
    var state = { a: 1, sub: { b: 1 } };
    var store = create_store_1.createStore({ state: state });
    var handlerMock = jest.fn();
    var listener = function (_a) {
        var message = _a.message, store = _a.store;
        return handlerMock(message, store);
    };
    connect_message_bus_1.connectMessageBus(store, listener);
    var message = { type: 'TEST_MESSAGE', payload: 'PAYLOAD' };
    store.dispatch(message);
    expect(handlerMock).toHaveBeenLastCalledWith(message, store);
});
it('should be able to create a message bus listener (curried version)', function () {
    var state = { a: 1, sub: { b: 1 } };
    var store = create_store_1.createStore({ state: state });
    var handlerMock = jest.fn();
    var listener = function (_a) {
        var message = _a.message, store = _a.store;
        return handlerMock(message, store);
    };
    var conenctAppStoreMessageBus = connect_message_bus_1.connectMessageBus(store);
    conenctAppStoreMessageBus(listener);
    var message = { type: 'TEST_MESSAGE', payload: 'PAYLOAD' };
    store.dispatch(message);
    expect(handlerMock).toHaveBeenCalledTimes(2);
    expect(handlerMock).toHaveBeenCalledWith(index_1.INIT_MESSAGAE, store);
    expect(handlerMock).toHaveBeenLastCalledWith(message, store);
});
it('should be able to create a message bus listener using a  a sub store', function () {
    var state = { a: 1, sub: { b: 1 } };
    var store = create_store_1.createStore({ state: state });
    var subStore = store.subStore(function (s) { return s.sub; });
    var subStoreMessageHandlerMock = jest.fn();
    var listener = function (_a) {
        var message = _a.message, store = _a.store;
        return subStoreMessageHandlerMock(message, store);
    };
    var conenctAppStoreMessageBus = connect_message_bus_1.connectMessageBus(subStore);
    conenctAppStoreMessageBus(listener);
    var message = { type: 'TEST_MESSAGE', payload: 'PAYLOAD' };
    store.dispatch(message);
    expect(subStoreMessageHandlerMock).toHaveBeenCalledWith(index_1.INIT_MESSAGAE, subStore);
    expect(subStoreMessageHandlerMock).toHaveBeenLastCalledWith(message, subStore);
    expect(subStoreMessageHandlerMock).toHaveBeenCalledTimes(2);
});
exports.default = {};
//# sourceMappingURL=connect-message-bus.spec.js.map