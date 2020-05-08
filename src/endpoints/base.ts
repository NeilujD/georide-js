import Config from '../config'
import Request from '../request'


/**
 * Abstract class to implement endpoints
 * @property {Config} config the client config
 * @property {Request} request the request object
 * @property {string} baseUri the endpoint base URI
 */
export default class BaseEndpoint {
  config: Config
  request: Request
  baseUri!: String

  /**
   * Create an endpoint instance
   * @param {Config} config 
   */
  constructor (config: Config) {
    this.config = config
    this.request = new Request(config)
  }
}