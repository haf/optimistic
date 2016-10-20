/* eslint-disable */
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;

import {
  createSchema,
  createDatabase,
  persistMiddleware,
  getById,
  getUnsent
} from './persistMiddleware';
import { fromJS } from 'immutable';
import {
  createStore,
  applyMiddleware
} from 'redux';

// (store) state
const initialState = {};

// constant
const SEND_MESSAGE = "optimistic/tests/SEND_MESSAGE";
const CHANGE_MESSAGE = "optimistic/tests/CHANGE_MESSAGE";

// action creator
const sendMessage = (message, cmdId, threadId) => ({
  type: SEND_MESSAGE,
  headers: {
    id: cmdId,
    endpoint: `/thread/${threadId}/sendMessage`
  },
  body: { message }
});

const changeMessage = message => ({
  type: CHANGE_MESSAGE,
  message
});

const sampleReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEND_MESSAGE:
      return { ...state, message: '' };
    case CHANGE_MESSAGE:
      return { ...state, message: action.message };
    default:
      return state;
  } 
};

describe('persist middleware', () => {
  const databaseName =
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random()*16|0,
            v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  var dbP, store;
  function createSubjectStore(mid) { // takes the middleware
    const store = createStore(sampleReducer, initialState, applyMiddleware(mid));
    return store;
  }

  beforeEach(() => {
    dbP = createDatabase(databaseName, 7, db => {
      //db.deleteObjectStore(databaseName);
      createSchema(db, databaseName, { autoIncrement: true }, [
        { name: 'id_IX', fields: ['headers.id'], opts: { unique: true } }
      ]);
    }).toPromise();

    store = dbP.
      then(db => persistMiddleware(db, databaseName)).
      then(createSubjectStore);
  });

  it("create", () => {
    const p = store.then(store => {
      expect(store.getState()).to.deep.equal({});
    });
    return expect(p).to.eventually.be.fulfilled;
  });

  it("returns the reducer's effects", () => {
    const p = store.then(store => {
      store.dispatch(changeMessage("Hello"));
      expect(store.getState()).to.deep.equals({ message: "Hello" });
    });
    return expect(p).to.eventually.be.fulfilled;
  });

  it("doesn't save actions", () => {
    return expect(Promise.all([dbP, store]).then(([db, store]) => {
      store.dispatch(changeMessage("Hello"));
      // sanity:
      expect(store.getState()).to.deep.equals({ message: "Hello" });
      return getById(db, databaseName, 1).toPromise();
    })).to.eventually.be.undefined;
  });

  it('saves commands', () => {
    return expect(Promise.all([dbP, store]).then(([db, store]) => {
      return store.dispatch(sendMessage("Hello", 'deadbeef')).
        concatMap((_) => getById(db, databaseName, 1)).
        toPromise();
    })).to.eventually.deep.equal(sendMessage('Hello', 'deadbeef'));
  });

  it('is queryable on sent state', () => {
    return expect(Promise.all([
      dbP,
      store
    ]).then(([db, store]) => {
      return store.
        dispatch(sendMessage("Hello", 'deadbeef')).
        concatMap(_ => getUnsent(db, databaseName).toArray()).
        toPromise()
    })).to.eventually.be.fulfilled.then(unsent => {
      expect(unsent.length).to.be.greaterThan(1);
    });
  });
});

describe('smoke', () => {
  it('is pluffy', () => {
    expect(true).to.equal(true);
  });
});
