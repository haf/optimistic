import Rx, { Observable, Observer, Scheduler } from 'rx-lite';
const indexedDB : IDBFactory =
  window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
const IDBTransaction =
  window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"};
const IDBKeyRange =
  window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

if (!indexedDB) {
  console.error("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available."); // eslint-ignore-line no-console
}

// opts: for fn 'createObjectStore'.
// indicies: Array [ { name, fields }],
//   e.g. [ { name: 'names', fields: [ 'person.firstName', 'person.lastName']}]
/**
 * Create a schema from the given parameters.
 */
export function createSchema(db : IDBDatabase, objectStore : string, opts : Object, indicies : Array) {
  const store = db.createObjectStore(objectStore, opts || {keyPath: "id"});
  indicies.forEach(current => {
    //console.log('creating index', current.name, current.fields, current.opts);
    store.createIndex(current.name, current.fields, current.opts || {});
  });
}

export const CommandIndexName = "id_IX";

// internal function to handle the callbacks from the annoying
// requests, do not publish this function publically.
function toObservableFromCallback(o : Observer, req : IDBRequest) {
  req.onsuccess = function(evt) { // eslint-disable-line no-param-reassign
    o.onNext(req.result);
    o.onCompleted();
  };
  req.onError = function(evt) { // eslint-disable-line no-param-reassign
    console.error('Error in toObservableFromCallback (lower level code)', evt);
    o.onError(evt);
  };
}

/**
 * Gets something from the passed object store by id.
 */
export function getById(db, objectStore : string, id : Number) {
  return Observable.create(o => {
    const tx = db.transaction(objectStore, 'readonly');
    const os = tx.objectStore(objectStore);
    const req = os.get(id);
    toObservableFromCallback(o, req);
  });
}

/**
 * Save commands takes a realised database instance and an object store
 * and the command to save. The command can be an arbitrary javascript
 * object, but this module is completely geared towards saving commands,
 * that have command related fields, as well as the other expected fields that commands
 * contain.
 */
export function saveCommand(db : IDBDatabase, objectStore : string, command : Object) {
  return Observable.create(o => {
    const tx = db.transaction(objectStore, 'readwrite');
    const os = tx.objectStore(objectStore);
    const req = os.put(command);
    toObservableFromCallback(o, req);
  });
}

/**
 * Creates a new middleware that persists using the given IDBDatabase
 * handle (open database that can be used).
 */
export function persistMiddleware(db : IDBDatabase, objectStore : string) {
  return store => next => action => {
    if (!!action.headers && !!action.body) {
      return saveCommand(db, objectStore, action).tap(
        (_) => store.dispatch(next(action)));
    }
    return next(action);
  };
}

/** 
 * Create a new database as an observable that yields a single value (the database instance)
 * and then completes. May also fire error callbacks.
 */
export function createDatabase(dbName : string, schemaVersion : Number, onUpgradeNeeded) {
  return Observable.create(o => {
    const req = indexedDB.open(dbName, schemaVersion);
    // will happen before onsuccess unless the schema exist
    req.onupgradeneeded = function(evt) {
      //console.debug('onupgradeneeded', evt);
      // OnUpgradeNeeded.IndexedDbRequest.Instance
      onUpgradeNeeded(evt.target.result);
    };
    req.onsuccess = function(evt) {
      // pass the db instance
      //console.debug('Instantiated database', evt.target.result);
      o.onNext(evt.target.result);
      o.onCompleted();
    };
    req.onerror = function(evt) {
      console.error('Cannot create database', dbName, evt);
      o.onError(evt);
      o.onCompleted();
    };
  });
}

/**
 * Creates a new middleware factory.
 */
export function persistMiddlewareFactory(objectStore : string, schemaVersion : Number, onUpgradeNeeded) {
  return createDatabase(objectStore, schemaVersion, onUpgradeNeeded)
    .map(db => persistMiddleware(db, objectStore));
}

/**
 * Creates a schema that's specific to this middleware implementation.
 */
export function createMiddlewareSchema(db : IDBDatabase, objectStore : string) {
  return createSchema(db, objectStore, {
    autoIncrement: true
  }, [{ // indicies
    name: CommandIndexName,
    fields: 'headers.id',
    opts: { unique: true } 
  }]);
}

// helper functions for dealing with deleting by command id (see deleteCommand below)
function getPKFromCommandId(index, cid) {
  if (typeof cid === 'undefined') throw new Error('Cannot delete by undefined command id (cid).');
  return Observable.create(o => {
    const req = index.getKey(cid);
    req.onsuccess = function() {
      // WTF!
      o.onNext(req.result);
      o.onCompleted();
    };
    req.onerror = function(evt) {
      o.onError(evt);
    };
  });
}

function deleteByPK(os, pk) {
  if (typeof pk === 'undefined') throw new Error('Cannot delete by undefined PK.');
  return Observable.create(o => {
    //console.debug('deleteByPK', pk);
    const rows = os.delete(pk);
    toObservableFromCallback(o, rows);
  });
}

/**
 * Tries to delete the command by its id from the underlying
 * IndexedDB instance.
 */
export function deleteCommand(db : IDBDatabase, objectStore : string, command : Object) : Observable {
  if (typeof command === 'undefined' || command === null) throw new Error('Cannot delete an undefined or null command');
  const tx = db.transaction(objectStore, 'readwrite');
  const os = tx.objectStore(objectStore);
  const byIdIndex = os.index(CommandIndexName);
  return getPKFromCommandId(byIdIndex, command.headers.id)
    .concatMap(pk => deleteByPK(os, pk));
}

// Communicator related code

/**
 * Gets the unsent commands, still to be sent over the network.
 */
export function getUnsent(db : IDBDatabase, objectStore : string) : Observable {
  return Observable.create(o => {
    const tx = db.transaction(objectStore, 'readonly');
    const os = tx.objectStore(objectStore);
    const creq = os.openCursor();
    creq.onsuccess = function(event) {
      const cursor = event.target.result;
      if (cursor) {
        o.onNext([cursor.key, cursor.value]);
        cursor.continue();
      } else {
        o.onCompleted();
      }
    };
    creq.onerror = function(event) {
      o.onError(event);
    };
  });
}

/**
 * Gives you back a connectivity observable.
 */
export function connectivityState() {
  const initial = window.navigator.onLine;
  return Observable.create(o => {
    o.onNext(initial);

    const handle = evt => o.onNext(navigator.onLine);
    window.addEventListener('online', handle);
    window.addEventListener('offline', handle);
  });
}

/**
 * Creates an observable that fires in a regular interval, while
 * the browser is online, as specified by the Observable[boolean]
 * that is the first parameter. Will call makeRequests and expect it
 * to return an observable of values back, that are then merged
 * to produce the result.
 * 
 * The observable is cold, so you'll need to subscribe it to
 * wake its scheduler.
 */
export function periodicRequest(connectivityStream, makeRequests, interval = 500) {
  return Observable.combineLatest([
    connectivityStream,
    Observable.interval(interval)
  ])
    .filter((online, _) => online)
    .concatMap((connected, _) =>
      makeRequests()
    );
}

/**
 * A function that takes a request factory 'createRequest' and
 * the storage location of the commands to be sent, and then
 * using the periodicRequest function, loops through the db's
 * contents and then sends the actual request.
 * 
 * The 'createRequest' function should error on faults in sending
 * over the network.
 * 
 * This function's observable should never error.
 */
export function periodicSender(createRequest, db, objectStore) {
  return periodicRequest(connectivityState(), () =>
    getUnsent(db, objectStore)
      .tap(cmd => console.debug('creating request from command', cmd))
      .map(createRequest),
  500);
}