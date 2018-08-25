// @flow

import invariant from 'assert'
import _debounce from 'lodash/debounce'

import hydrate, { validateKnownTypes } from './hydrate'
import dehydrate, { defaultSerializeValue } from './dehydrate'
import EngineLocalStorage from './engine-local-storage'
import EngineAsyncStorage from './engine-async-storage'

async function getReduxMemory({
  storage,
  reducer,
  createStore,
  saveDebounce = 0,
  knownTypes = [],
  keysToPersist = [],
  serializeValue = defaultSerializeValue,
}: {|
  storage: Object,
  reducer: Function,
  createStore: Function,
  saveDebounce?: number,
  knownTypes?: Array<Function>,
  keysToPersist?: Array<string>,
  serializeValue?: Function,
|} = {}) {
  invariant(typeof reducer === 'function', 'option.reducer must be a function')
  invariant(typeof createStore === 'function', 'option.createStore must be a function')
  invariant(storage && typeof storage === 'object', 'option.storage must be a valid Storage instance')
  invariant(typeof storage.save === 'function', 'options.storage.save must be a function')
  invariant(typeof storage.load === 'function', 'options.storage.load must be a function')
  invariant(typeof saveDebounce === 'number' && Number.isFinite(saveDebounce), 'options.debounce must be a valid number')
  invariant(Array.isArray(keysToPersist), 'options.keysToPersist must be a valid Array')
  invariant(typeof serializeValue === 'function', 'options.serializeValue must be a valid function')
  validateKnownTypes(knownTypes)

  const initialState = await storage.load()
  const store = createStore(reducer, hydrate(initialState, knownTypes))

  function save() {
    const state = store.getState()
    const stateToWrite = dehydrate(serializeValue, state, keysToPersist)
    storage.save(stateToWrite)
  }

  if (saveDebounce < 0) {
    store.subscribe(save)
  } else {
    store.subscribe(_debounce(save, saveDebounce))
  }

  return store
}

export { getReduxMemory, EngineLocalStorage, EngineAsyncStorage }
