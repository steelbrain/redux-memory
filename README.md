# Redux Memory

Redux Persistence made simple. Works with ImmutableJS through `options.scope`.

### Installation

```
npm install --save redux-memory
# or
yarn add redux-memory
```

### Example

Before:

```js
import { createStore } from 'redux'
import reducer from './reducers'

async function main() {
  const store = createStore(reducer)
  /// ... stuff
}
```

After:

```js
import { getReduxMemory, EngineLocalStorage } from 'redux-memory'
// import { Set as ImmSet, Map as ImmMap } from 'immutable'
// ^ Uncommment for Immutable JS support
import { createStore } from 'redux'
import reducer from './reducers'

async function main() {
  const store = getReduxMemory({
    storage: new EngineLocalStorage('my-local-storage-key'),
    reducer,
    createStore,
    // keysToPersist: ['session', 'user.id'],
    // ^ Uncomment if you only want to persist session.* and user.id
    // knownTypes: [ImmSet, ImmMap],
    // ^ Uncomment for Immutable JS support
  })
  /// ... stuff
}
```

### Usage

```js
export async function getReduxMemory({
  storage: Object,
  reducer: Function,
  createStore: Function,
  saveDebounce?: number = 0,
  keysToPersist?: Array<string> = [],
  knownTypes?: Array<Function> = [],
  serializeValue?: (value: any) => any,
})

export class EngineAsyncStorage {
  constructor(key: string)
}

export class EngineLocalStorage {
  constructor(key: string)
}
```

### Notes

- The value returned from `serializeValue` will be dehydrated by the original constructor from knownTypes.

### License

This project is licensed under the terms of MIT License. See the LICENSE file for more info.
