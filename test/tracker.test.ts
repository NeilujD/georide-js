import { assert } from 'chai'
import nock from 'nock'
import moment from 'moment'

import Georide from '../src/georide'
import { Token } from '../src/request'


describe('tracker endpoint', () => {
  const apiUrl = 'https://api.georide.fr'
  const emailAddress = "email@email.com"
  const password = "123"
  const client = new Georide(emailAddress, password)
  const scope = nock(apiUrl)
  const tokenData = {
    id: 123,
    email: emailAddress,
    isAdmin: false,
    authToken: "123"
  }
  const from = new Date(), to = new Date()

  beforeEach(() => {
    client.config.token = new Token(tokenData)
  })

  describe('get tracker trips', () => {
    it('should return the tracker trips', async () => {
      const data = {
        trips: [{
          id: 123
        }]
      }
      const trackerId = 1

      scope.get(`/tracker/${trackerId}/trips`).query({ 
        from: moment(from).format('YYYY-MM-DD'), 
        to: moment(to).format('YYYY-MM-DD') 
      }).reply(200, data)

      const trips = await client.Tracker.trips(trackerId, from, to)
      assert.deepEqual(data, trips)
    })
  })

  describe('get tracker positions', () => {
    it('should return the tracker positions', async () => {
      const data = {
        positions: [{
          id: 123
        }]
      }
      const trackerId = 1

      scope.get(`/tracker/${trackerId}/trips/positions`).query({ 
        from: moment(from).format('YYYY-MM-DD'), 
        to: moment(to).format('YYYY-MM-DD') 
      }).reply(200, data)

      const positions = await client.Tracker.positions(trackerId, from, to)
      assert.deepEqual(data, positions)
    })
  })

  describe('lock the tracker', () => {
    it('should lock the tracker with success', async () => {
      const trackerId = 1

      scope.post(`/tracker/${trackerId}/lock`).reply(200, {ok: true})

      await client.Tracker.lock(trackerId)
    })
  })

  after(()=>{
    nock.cleanAll()
  })
})