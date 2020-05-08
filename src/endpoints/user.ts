import BaseEndpoint from './base'
import Config from '../config'


/**
 * User endpoint class
 */
export default class User extends BaseEndpoint {
  /**
   * Create an `User` endpoint instance
   * @param {Config} config 
   */
  constructor (config: Config) {
    super(config)
    this.baseUri = 'user'
  }

  /**
   * Request the user info
   * @return {Promise<{}>} a promise to the info data
   */
  info (): Promise<{}> {
    const uri = `/${this.baseUri}`

    return this.request.send(uri)
  }

  /**
   * Request the user's trackers
   * @return {Promise<{}>} a promise to the trackers list
   */
  trackers (): Promise<{}> {
    const uri = `/${this.baseUri}/trackers`

    return this.request.send(uri)
  }
}