import BaseEndpoint from './base'
import Config from '../config'


/**
 * Trip endpoint class
 * @category Endpoint
 */
class Trip extends BaseEndpoint {
  /**
   * Create a `Trip` endpoint instance
   * @param {Config} config 
   */
  constructor (config: Config) {
    super(config)
    this.baseUri = 'trip'
  }

  /**
   * Get the shared trip by share id
   * @param {string} id the trip share id
   * @return {Promise<{}>} a promise to the trip
   */
  get (id: string): Promise<{}> {
    const { baseUri } = this
    const uri = `/${baseUri}/${id}`

    return this.request.send(uri)
  }
}
export default Trip
export { Trip }