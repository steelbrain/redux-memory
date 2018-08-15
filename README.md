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
import { Set as ImmSet, Map as ImmMap } from 'immutable'
// ^ Uncommment for Immutable JS support
import { createStore } from 'redux'
import reducer from './reducers'

async function main() {
  const store = getReduxMemory({
    // scope: [ImmSet, ImmMap],
    // ^ Uncomment for Immutable JS support
    storage: new EngineLocalStorage('my-local-storage-key'),
    reducer,
    createStore,
    // keysToPersist: ['session', 'user.id'],
    // ^ Uncomment if you only want to persist session.* and user.id
  })
  /// ... stuff
}
```

### Usage

```js
export async function getReduxMemory({
  scope?: Array<Function> = [],
  storage: Object,
  reducer: Function,
  createStore: Function,
  saveDebounce?: number = 0,
  keysToPersist?: Array<string> = [],
})

export class EngineAsyncStorage {
  constructor(key: string)
}

export class EngineLocalStorage {
  constructor(key: string)
}
```

### License

This project is licensed under the terms of MIT License. See the LICENSE file for more info.
