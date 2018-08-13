// @flow

import invariant from 'assert'

async function reduxMemory({
  storage,
  reducer,
  createStore,
  saveDebounce = 0,
  keysToPersist = [],
}: {|
  storage: Object,
  reducer: Function,
  createStore: Function,
  saveDebounce: number,
  keysToPersist: Array<string>,
|} = {}) {
  invariant(typeof reducer === 'function', 'option.reducer must be a function')
  invariant(typeof createStore === 'function', 'option.createStore must be a function')
  invariant(storage && typeof storage === 'object', 'option.storage must be a valid Storage instance')
  invariant(typeof storage.save === 'function', 'options.storage.save must be a function')
  invariant(typeof storage.load === 'function', 'options.storage.load must be a function')
  invariant(typeof saveDebounce === 'number' && Number.isFinite(saveDebounce), 'options.debounce must be a valid number')
  invariant(Array.isArray(keysToPersist), 'options.keysToPersist must be a valid Array')
}

export default reduxMemory
