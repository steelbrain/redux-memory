// @flow

export default class EngineLocalStorage {
  key: string

  constructor(key: string) {
    this.key = key
  }
  save(obj: Object) {
    localStorage.setItem(this.key, JSON.stringify(obj))
  }
  load() {
    return JSON.parse(localStorage.getItem(this.key) || 'null')
  }
}
