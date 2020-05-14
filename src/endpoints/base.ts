import Config from '../config'
import Request from '../request'


/**
 * Abstract class to implement endpoints
 * @category Endpoint
 * @property {Config} config the client config
 * @property {Request} request the request object
 * @property {string} baseUri the endpoint base URI
 */
class BaseEndpoint {
  config: Config
  request: Request
  baseUri!: string

  /**
   * Create an endpoint instance
   * @param {Config} config 
   */
  constructor (config: Config) {
    this.config = config
    this.request = new Request(config)
  }
}
export default BaseEndpoint
export { BaseEndpoint }