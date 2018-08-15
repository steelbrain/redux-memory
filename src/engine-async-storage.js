// @flow

let AsyncStorage = null
try {
  // $FlowFixMe
  AsyncStorage = require('react-native').AsyncStorage // eslint-disable-line
} catch (_) {
  /* No op */
}

export default class EngineAsyncStorage {
  key: string

  constructor(key: string) {
    this.key = key
  }
  save(obj: Object) {
    if (!AsyncStorage) {
      throw new Error('Unable to find react-native AsyncStorage')
    }

    AsyncStorage.setItem(this.key, JSON.stringify(obj)).catch(console.error)
  }
  async load() {
    if (!AsyncStorage) {
      throw new Error('Unable to find react-native AsyncStorage')
    }

    return JSON.parse((await AsyncStorage.getItem(this.key)) || 'null')
  }
}
