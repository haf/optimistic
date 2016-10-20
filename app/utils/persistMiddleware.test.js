/* eslint-disable */
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;

import {
  createSchema,
  createMiddlewareSchema,
  createDatabase,
  persistMiddleware,
  getById,
  getUnsent,
  saveCommand,
  deleteCommand
} from './persistMiddleware';
import { fromJS } from 'immutable';
import {
  createStore,
  applyMiddleware
} from 'redux';
import {Observable} from 'rx-lite';

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

function genId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random()*16|0,
          v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

describe('persist middleware', () => {
  var dbP, store, databaseName;
  function createSubjectStore(mid) { // takes the middleware
    const store = createStore(sampleReducer, initialState, applyMiddleware(mid));
    return store;
  }

  beforeEach(() => {
    databaseName = genId();

    dbP = createDatabase(databaseName, 7, db =>
      createMiddlewareSchema(db, databaseName)
    ).toPromise();

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
      expect(unsent.length).to.be.greaterThan(0);
    });
  });

  it('sent command can be deleted', () => {
    const cmd = sendMessage("Hi Yaks", "mycmdid", "mythreadid");
    const obs =
      Observable.fromPromise(dbP)
      .concatMap(db =>
        saveCommand(db, databaseName, cmd)
          .map(x => [x, db])
      )
      .concatMap(([id, db]) => {
        expect(id).not.to.be.undefined;
        expect(id).to.be.a('Number');
        return deleteCommand(db, databaseName, cmd)
          .map([id, db]);
      })
      .concatMap(([id, db]) =>
         getById(db, databaseName, id)
      )
      .tap(found => {
        expect(found).to.be.undefined;
      })
      .toPromise();
    return expect(obs).to.eventually.be.fulfilled;
  });
});

describe('periodicSender + infra', () => {
  it('should be done later');
});