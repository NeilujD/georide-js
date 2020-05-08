import BaseEndpoint from './base'
import Config from '../config'


/**
 * Tracker endpoint class
 */
export default class Tracker extends BaseEndpoint {
  /**
   * Create a `Tracker` endpoint instance
   * @param {Config} config 
   */
  constructor (config: Config) {
    super(config)
    this.baseUri = '/tracker'
  }

  /**
   * Request the tracker trips list between two dates
   * @param {Date} from the start date filter
   * @param {Date} to the end date filter
   * @return {Promise<{}>} a promise to the trips list
   */
  trips (from: Date, to: Date): Promise<{}> {
    const uri = '/trips'
    const params = { from ,to }

    return this.request.send(uri, params)
  }

  /**
   * Request the tracker positions between two dates
   * @param {Date} from the start date filter
   * @param {Date} to the end date filter
   * @return {Promise<{}>} a promise to the positions data
   */
  positions (from: Date, to: Date): Promise<{}> {
    const uri = '/trips/positions'
    const params = { from, to }

    return this.request.send(uri, params)
  }

  /**
   * Locl the tracker
   * @param {string} trackerId 
   * @return {Promise<{}>} a promise to the result
   */
  lock (trackerId: string): Promise<{}> {
    const uri = `/${trackerId}/lock`

    return this.request.send(uri, null, 'POST')
  }
}