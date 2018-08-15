// @flow

import invariant from 'assert'
import _debounce from 'lodash/debounce'

import hydrate, { validateScope } from './hydrate'
import dehydrate from './dehydrate'

async function reduxMemory({
  scope = [],
  storage,
  reducer,
  createStore,
  saveDebounce = 0,
  keysToPersist = [],
}: {|
  scope?: Array<Function>,
  storage: Object,
  reducer: Function,
  createStore: Function,
  saveDebounce?: number,
  keysToPersist?: Array<string>,
|} = {}) {
  invariant(typeof reducer === 'function', 'option.reducer must be a function')
  invariant(typeof createStore === 'function', 'option.createStore must be a function')
  invariant(storage && typeof storage === 'object', 'option.storage must be a valid Storage instance')
  invariant(typeof storage.save === 'function', 'options.storage.save must be a function')
  invariant(typeof storage.load === 'function', 'options.storage.load must be a function')
  invariant(typeof saveDebounce === 'number' && Number.isFinite(saveDebounce), 'options.debounce must be a valid number')
  invariant(Array.isArray(keysToPersist), 'options.keysToPersist must be a valid Array')
  validateScope(scope)

  const initialState = await storage.load()
  const store = createStore(reducer, hydrate(initialState, scope))

  function save() {
    const state = store.getState()
    const stateToWrite = dehydrate(state, keysToPersist)
    storage.save(stateToWrite)
  }

  store.subscribe(_debounce(save, saveDebounce))

  return store
}

export default reduxMemory
