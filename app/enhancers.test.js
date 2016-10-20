import expect from 'expect';
import {
  doNothingWith,
  storeHistory
} from './enhancers';

import { fromJS } from 'immutable';
import {
  createStore,
  applyMiddleware
} from 'redux';

const initialState = "Hello";
const SEND_MESSAGE = "optimistic/tests/SEND_MESSAGE";

const sendMessage = message => ({
  type: SEND_MESSAGE,
  message
});

const sampleReducer = (state = initialState, action) => {
  if (action.type === SEND_MESSAGE) return action.message;
  return state;
};

describe('doNothingWith', () => {
  it("working reducer", () => {
    const store = createStore(sampleReducer);
    expect(store.getState()).toEqual("Hello");
  });
  it("returns the reducer's effects", () => {
    const store = createStore(doNothingWith(sampleReducer));
    expect(store.getState()).toEqual("Hello");
  });
  describe('remembering reducer', () => {
    /*it("primitive remembering reducer", () => {
      const store = createStore(storeHistory(sampleReducer));
      expect(store.getState()).toEqual("Hello");
    });
    it("std behaviour", () => {
      const store = createStore(storeHistory(sampleReducer));
      store.dispatch(sendMessage('Goodbye'));
      expect(store.getState()).toEqual("Goodbye");
    });
    it("remembered action", () => {
      const store = createStore(storeHistory(sampleReducer));
      store.dispatch(sendMessage('Goodbye'));
      expect(store.getState().past).toEqual([
        sendMessage("Goodbye")
      ]);
    });*/
  });
});