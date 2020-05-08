import { Socket } from 'socket.io-client'

import { Token } from './request'


/**
 * Class that define Georide client config
 * @property {string} email the user email
 * @property {string} password the user password
 * @property {string} host the Georide API host
 * @property {string} protocol the Georide API protocol
 * @property {string} authUri the Georide API authentication endpoint uri
 */
export default class Config {
  email: string
  password: string
  host: string
  protocol: string
  authUri: string
  newTokenUri: string
  token: Token | null
  socket!: typeof Socket

  /**
   * Create a config instance
   * @param {object} options 
   * @param {string} options.email the user email
   * @param {string} options.password the user password
   * @param {string} options.host the Georide API host
   * @param {string} options.protocol the Georide API protocol
   * @param {string} options.authUri the Georide API authentication endpoint uri
   * @param {string} options.newTokenUri the Georide API new token request uri
   */
  constructor (options: { email: string, password: string, host?: string, protocol?: string, auth_uri?: string, new_token_uri?: string }) {
    const { email, password, host = 'api.georide.fr', protocol = 'https', auth_uri = '/user/login', new_token_uri = '/user/new-token'} = options

    this.email = email
    this.password = password

    this.host = host
    this.protocol = protocol
    this.authUri = auth_uri
    this.newTokenUri = new_token_uri

    this.token = null
  }

  /** Setter for the token
   * @param {Token} token
   */
  setToken (token: Token | null) {
    this.token = token
  }

  /**
   * Setter for the socket client
   * @param {Socket} socket 
   */
  setSocket (socket: typeof Socket) {
    this.socket = socket
  }
}