import test from 'ava'
import { createStore } from 'redux'

import getReduxMemory from '../'

function noop(arg) {
  return arg
}

async function getReduxMemoryForTest({
  scope = [],
  keysToPersist = [],
  saveDebounce = -1,
  reducer = noop,
  load = noop,
  save = noop,
}) {
  return getReduxMemory({
    scope,
    storage: { load, save },
    reducer,
    createStore,
    keysToPersist,
    saveDebounce,
  })
}

test('basic stuff', async function(t) {
  const sampleObj = {
    some: { thing: null },
    yes: 'yep',
    well: false,
    huh: { a: { b: { c: 'asd', b: 'asds' } } },
  }
  let reducerCalled = 0
  let sampleObjDehydrated = null

  const store1 = await getReduxMemoryForTest({
    reducer(arg) {
      reducerCalled += 1

      if (reducerCalled === 1) {
        t.deepEqual(arg, {})
        return sampleObj
      }
      if (reducerCalled === 2) {
        t.deepEqual(arg, sampleObj)
        return arg
      }
      throw new Error('Reducer called unexpectedly #1')
    },
    load() {
      return null
    },
    save(arg) {
      sampleObjDehydrated = arg
      console.log('inside save')
    },
  })
  store1.dispatch({ type: '_' })
  t.not(sampleObjDehydrated, null)

  const store2 = await getReduxMemoryForTest({
    reducer(arg) {
      reducerCalled += 1

      if (reducerCalled === 3) {
        t.deepEqual(arg, sampleObj)
        return sampleObj
      }
      throw new Error('Reducer called unexpectedly #2')
    },
    load() {
      return sampleObjDehydrated
    },
  })
  t.deepEqual(store2.getState(), sampleObj)
})
