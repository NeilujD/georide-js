import io from 'socket.io-client'
import fetch from 'node-fetch'

import Config from './config'

const GEORIDE_MISSING_TOKEN_ERROR = 'Aucun motard trouvé à cette adresse ⭕️'
const INTERN_MISSING_TOKEN_ERROR = 'missing_valid_token'


/** 
 * Class representing a Georide token 
 * @property {string} id the user id
 * @property {string} email the user email
 * @property {boolean} isAdmin determine is user has admin right on Georide API
 * @property {string} authToken the access token
 */
export class Token {
  id: string
  email: string
  isAdmin: boolean
  authToken: string

  /** 
   * Create a token
   * @param {object} data
   * @param {string} data.id the user id
   * @param {string} data.email the user email 
   * @param {boolean} data.isAdmin determine is user has admin right on Georide API
   * @param {string} data.authToken the access token 
   */
  constructor (data: { id: string, email: string, isAdmin: boolean, authToken: string}) {
    const { id, email, isAdmin, authToken } = data

    this.id = id
    this.email = email
    this.isAdmin = isAdmin
    this.authToken = authToken
  }
}


/** 
 * Class to simplify API request with token authentication 
 * @property {Config} config the config neened to perform requests
 * @property {Token} token the required Georide token 
 */
export default class Request {
  config: Config

  /**
   * Create a request
   * @param {Config} config a config instance
   */
  constructor (config: Config) {
    this.config = config
  }

  /**
   * Method that permit to authenticate the user using given email and password
   * @return {Promise<Token>} a promise to the token
   */
  async authenticate (): Promise<Token> {
    const { email, password, protocol, host, authUri } = this.config
    
    const method = 'POST'
    const body = JSON.stringify({ email, password })
    const headers = { 'content-type': 'application/json' }
    const url = `${protocol}://${host}${authUri}`

    try {
      // Request the token
      const response = await fetch(url, { method, body, headers })
      const data = await response.json()

      // Check if `InvalidRequest` is returned
      if (data.error) {
        throw new Error(data.error)
      }
      
      const token = new Token(data)
      this.config.setToken(token)

      // Create the socket.io client
      const socket = io(`${protocol}://${host}/`, {
        reconnection: true,
        transportOptions: {
          polling: {
            extraHeaders: {
              token: token.authToken
            }
          }
        }
      })
      this.config.setSocket(socket)

      return token
    } catch (e) {
      throw e
    }
  }

  /**
   * Send a request to the Georide API
   * @param uri 
   * @param params 
   * @param method 
   * @return {Promise<{}>} a promise to the data
   */
  async send (uri: string, params: Object | null = null, method: string = 'GET'): Promise<{}> {
    const { protocol, host, token } = this.config

    const req = async (token: Token) => {
      const headers = { 
        'content-type': 'application/json',
        'Authorization': `Bearer ${token.authToken}`
      }
      const url = `${protocol}://${host}${uri}`

      let options: {} = { method, headers }
      if (method.toUpperCase() === 'POST') 
        options = {
          ...options,
          body: JSON.stringify(params)
        }

      try {
        const response = await fetch(url, options)
        const data = await response.json()

        if (data.errors && data.errors.message == GEORIDE_MISSING_TOKEN_ERROR) throw new Error(INTERN_MISSING_TOKEN_ERROR)

        return data
      } catch (e) {
        throw e
      }
    }

    try {
      if (!token) throw new Error(INTERN_MISSING_TOKEN_ERROR)
      const response = await req(token)
      return response
    } catch (e) {
      if (e.message !== INTERN_MISSING_TOKEN_ERROR) throw e
      const p = token ? this.newToken(token) : this.authenticate()
      return p.then(token => req(token))
    }
  }

  /**
   * Refresh the token
   * @param {Token} token the expired token
   * @return {Promise<Token>} a promise to the token
   */
  async newToken (token: Token): Promise<Token> {
    const { protocol, host, newTokenUri } = this.config
    
    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${token.authToken}`
    }
    const url = `${protocol}://${host}${newTokenUri}`

    try {
      // Request the token
      const response = await fetch(url, { headers })
      const data = await response.json()

      // Check if `InvalidRequest` is returned
      if (data.error) throw new Error(data.error)
      else if (data.errors && data.errors.message === GEORIDE_MISSING_TOKEN_ERROR) throw new Error(INTERN_MISSING_TOKEN_ERROR)
      
      this.config.token!.authToken = data.authToken

      // Update the socket.io client
      this.config.socket.io.opts.transportOptions = {
        ...this.config.socket.io.opts.transportOptions,
        polling: {
          extraHeaders: {
            token: data.authToken
          }
        }
      }

      return this.config.token!
    } catch (e) {
      throw e
    }
  }

  /**
   * Subscribe to a given event
   * @param {string} event the event name
   * @param {function} callback the callback function
   */
  subscribe (event: string, callback: Function) {
    this.config.socket.on(event, (message: object) => callback(message))
  }
}