import { Socket } from 'socket.io-client'

import { Token } from './request'
import { StorageFactory, MemoryStorageFactory } from './storage'


/**
 * Class that define Georide client config
 * @property {string} email the user email
 * @property {string} password the user password
 * @property {string} host the Georide API host
 * @property {string} protocol the Georide API protocol
 * @property {string} authUri the Georide API authentication endpoint uri
 * @property {string} newTokenUri the Georide API refresh token endpoint uri
 * @property {Socket} socket the socket client
 * @property {boolean} supportSocket define if client should support socket client connection
 * @property {object} storage the storage used to store the token 
 * @property {string} storageTokenKey the storage key to the token
 */
class Config {
  email: string
  password: string
  host: string
  protocol: string
  authUri: string
  newTokenUri: string
  supportSocket: boolean
  socket!: typeof Socket
  storage: StorageFactory | MemoryStorageFactory
  storageTokenKey: string

  /**
   * Create a config instance
   * @param {object} options 
   * @param {string} options.email the user email
   * @param {string} options.password the user password
   * @param {string} options.host the Georide API host
   * @param {string} options.protocol the Georide API protocol
   * @param {string} options.authUri the Georide API authentication endpoint uri
   * @param {string} options.newTokenUri the Georide API new token endpoint uri
   * @param {object} options.storage the storage strategy
   * @param {string} options.storageTokenKey the storage key to store the token
   * @param {boolean} options.supportSocket define if client should support socket client connection
   */
  constructor (
    options: { 
      email: string, 
      password: string, 
      host?: string, 
      protocol?: string, 
      authUri?: string, 
      newTokenUri?: string, 
      storage?: StorageFactory | MemoryStorageFactory,
      storageTokenKey?: string,
      supportSocket?: boolean
    }
  ) {
    const { 
      email, 
      password, 
      host = 'api.georide.fr', 
      protocol = 'https', 
      authUri = '/user/login', 
      newTokenUri = '/user/new-token', 
      storage = new StorageFactory(),
      storageTokenKey = 'georide_token',
      supportSocket = true
    } = options

    this.email = email
    this.password = password

    this.host = host
    this.protocol = protocol
    this.authUri = authUri
    this.newTokenUri = newTokenUri

    this.storage = storage
    this.storageTokenKey = storageTokenKey

    this.supportSocket = supportSocket
  }

  /** 
   * Setter for the token
   * @param {Token} token
   */
  setToken (token: Token | null) {
    // Update token in storage
    if (!token) this.storage.delete(this.storageTokenKey)
    else this.storage.set(this.storageTokenKey, JSON.stringify(token))

    // Update token in socket client
    if (this.socket)
      this.socket.io.opts.transportOptions = {
        ...this.socket.io.opts.transportOptions,
        polling: {
          extraHeaders: {
            token: token ? token.authToken : null
          }
        }
      }
  }

  /**
   * Getter for the token
   * @return {Token | null}
   */
  getToken (): Token | null {
    const t = this.storage.get(this.storageTokenKey)
    return t ? new Token(JSON.parse(t)) : null
  }

  /**
   * Setter for the socket client
   * @param {Socket} socket 
   */
  setSocket (socket: typeof Socket) {
    this.socket = socket
  }
}
export default Config
export { Config }