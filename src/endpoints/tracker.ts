import BaseEndpoint from './base'
import Config from '../config'
import { formatDateParam } from '../helper'


/**
 * Tracker endpoint class
 * @category Endpoint
 */
export default class Tracker extends BaseEndpoint {
  /**
   * Create a `Tracker` endpoint instance
   * @param {Config} config 
   */
  constructor (config: Config) {
    super(config)
    this.baseUri = 'tracker'
  }

  /**
   * Request the tracker trips list between two dates
   * @param {number} id the tracker id
   * @param {Date} from the start date filter
   * @param {Date} to the end date filter
   * @return {Promise<{}>} a promise to the trips list
   */
  trips (id: number, from: Date, to: Date): Promise<{}> {
    const { baseUri } = this
    const uri = `/${baseUri}/${id}/trips`
    const params = formatDateParam({ from ,to })

    return this.request.send(uri, params)
  }

  /**
   * Request the tracker positions between two dates
   * @param {number} id the tracker id
   * @param {Date} from the start date filter
   * @param {Date} to the end date filter
   * @return {Promise<{}>} a promise to the positions data
   */
  positions (id: number, from: Date, to: Date): Promise<{}> {
    const { baseUri } = this
    const uri = `/${baseUri}/${id}/trips/positions`
    const params = formatDateParam({ from ,to })

    return this.request.send(uri, params)
  }

  /**
   * Lock the tracker
   * @param {number} id 
   */
  lock (id: number) {
    const { baseUri } = this
    const uri = `/${baseUri}/${id}/lock`

    this.request.send(uri, null, 'POST')
  }

  /**
   * Unlock the tracker
   * @param {number} id 
   */
  unlock (id: number) {
    const { baseUri } = this
    const uri = `/${baseUri}/${id}/unlock`

    this.request.send(uri, null, 'POST')
  }

  /**
   * Toggle the tracker lock
   * @param {number} id the tracker id
   * @return {Promise<{}>} a promise to the result
   */
  toggle (id: number): Promise<{}> {
    const { baseUri } = this
    const uri = `/${baseUri}/${id}/toggleLock`

    return this.request.send(uri, null, 'POST')
  }

  /**
   * Share a trip
   * @param {number} id the tracker id
   * @param {object} params the action params
   * @param {number} params.tripId the id of the trip you want to share
   * @param {Date} params.from the `from` filter date
   * @param {Date} params.to the `to` filter date
   * @param {number} params.tripMergeId the id of a merge trip
   */
  shareTrip (id: number, params: { tripId: number } | { from: Date, to: Date } | { tripMergeId: number }) {
    const { baseUri } = this
    const uri = `/${baseUri}/${id}/share/trip`

    return this.request.send(uri, formatDateParam(params), 'POST')
  }
}