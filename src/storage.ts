/**
 * Permit to handle storage strategy based on whereas is used on browser or on Node
 * @property {Storage} localStorage the used storage
 */
class StorageFactory {
  localStorage: Storage

  /**
   * Create a storage
   */
  constructor() {
    if (typeof localStorage === 'undefined' || localStorage === null) {
      const { LocalStorage } = require('node-localstorage')

      this.localStorage = new LocalStorage('./localStorage')
    } else {
      this.localStorage = window.localStorage
    }
  }

  /**
   * Set a storage key
   * @param {string} key the storage key
   * @param {any} value the storage value
   */
  set(key: string, value: any) {
    return this.localStorage.setItem(key, value)
  }

  /**
   * Get a storage key
   * @param {string} key the storage key
   */
  get(key: string) {
    return this.localStorage.getItem(key)
  }

  /**
   * Delete a storage key
   * @param {string} key the storage key
   */
  delete(key: string) {
    return this.localStorage.removeItem(key)
  }
}
export { StorageFactory }


/**
 * Alternative storage strategy using state logic
 * @property {Map} state the storage state
 */
class MemoryStorageFactory {
  state: Map<string, any>

  /**
   * Create a memory storage
   */
  constructor() {
    this.state = new Map()
  }

  /**
   * Set a storage key
   * @param {string} key the storage key
   * @param {any} value the storage value
   */
  set(key: string, value: any) {
    this.state.set(key, value)
  }

  /**
   * Get a storage key
   * @param {string} key the storage key
   */
  get(key: string) {
    return this.state.get(key) || null
  }

  /**
   * Delete a storage key
   * @param {string} key the storage key
   */
  delete(key: string) {
    this.state.delete(key)
  }
}
export { MemoryStorageFactory }
