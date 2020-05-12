import Config from './config'
import Request, { Token } from './request'
import User from './endpoints/user'
import Tracker from './endpoints/tracker'
import Trip from './endpoints/trip'


const MESSAGE = 'message'
const DEVICE = 'device'
const POSITION = 'position'
const ALARM = 'alarm'
export { MESSAGE, DEVICE, POSITION, ALARM }

/**
 * JavaScript Georide client class
 * @property {Config} config the client config
 * @property {Request} request the request helper
 */
export default class Georide {
  config: Config
  request: Request
  User: User
  Tracker: Tracker
  Trip: Trip

  /**
   * Create the Georide client
   * @param {string} email the user email
   * @param {string} password the user password
   * @param {object} options client options
   * @param {string} options.host the Georide API host
   * @param {string} options.protocol the Georide API protocol
   * @param {string} options.auth_uri the Georide API authentication uri
   */
  constructor (email: string, password: string, options: {host: string, protocol: string, auth_uri: string, new_token_uri: string} | {} = {}) {
    this.config = new Config({
      email, password,
      ...options
    })
    this.request = new Request(this.config)

    this.User = new User(this.config)
    this.Tracker = new Tracker(this.config)
    this.Trip = new Trip(this.config)
  }

  /**
   * Authenticate the user
   * @return {Promise<Token>}
   */
  login(): Promise<Token> {
    return this.request.authenticate()
  }

  /**
   * Subscribe for the `message` event
   * @param {Function} callback 
   */
  onMessage (callback: Function) {
    this.request.subscribe(MESSAGE, callback)
  }

  /**
   * Subscribe for the `device` event
   * @param {Function} callback 
   */
  onDevice (callback: Function) {
    this.request.subscribe(DEVICE, callback)
  }

  /**
   * Subscribe for the `position` event
   * @param {Function} callback 
   */
  onPosition (callback: Function) {
    this.request.subscribe(POSITION, callback)
  }

  /**
   * Subscribe for the `alarm` event
   * @param {Function} callback 
   */
  onAlarm (callback: Function) {
    this.request.subscribe(ALARM, callback)
  }
}