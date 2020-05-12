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

  describe('share a trip', () => {
    it('should share a trip using a trip id', async () => {
      const trackerId = 1
      const tripId = 1

      const data = {
        url: '<shared_url>',
        sharedId: '123'
      }

      scope.post(`/tracker/${trackerId}/share/trip`, {
        tripId
      }).reply(200, data)

      const sharedTrip = await client.Tracker.shareTrip(trackerId, { tripId })

      assert.deepEqual(sharedTrip, data)
    })

    it('should share a trip using a from date and a to date', async () => {
      const trackerId = 1
      const from = new Date()
      const to = new Date()

      const data = {
        url: '<shared_url>',
        sharedId: '123'
      }

      scope.post(`/tracker/${trackerId}/share/trip`, {
        from: moment(from).format('YYYY-MM-DD'), to: moment(to).format('YYYY-MM-DD')
      }).reply(200, data)

      const sharedTrip = await client.Tracker.shareTrip(trackerId, { from, to })

      assert.deepEqual(sharedTrip, data)
    })

    it('should share a trip using a merge trip id', async () => {
      const trackerId = 1
      const tripMergeId = 1

      const data = {
        url: '<shared_url>',
        sharedId: '123'
      }

      scope.post(`/tracker/${trackerId}/share/trip`, {
        tripMergeId
      }).reply(200, data)

      const sharedTrip = await client.Tracker.shareTrip(trackerId, { tripMergeId })

      assert.deepEqual(sharedTrip, data)
    })
  })

  describe('toggle a tracker lock', () => {
    it('should lock if tracker is unlocked', async () => {
      const trackerId = 1

      const locked = true

      scope.post(`/tracker/${trackerId}/toggleLock`).reply(200, { locked: !locked })

      const result = await client.Tracker.toggle(trackerId)

      assert.deepEqual(result, { locked: !locked })
    })
  })

  describe('unlock the tracker', () => {
    it('should unlock the tracker', async () => {
      const trackerId = 1

      scope.post(`/tracker/${trackerId}/unlock`).reply(200, {ok: true})

      await client.Tracker.unlock(trackerId)
    })
  })

  after(()=>{
    nock.cleanAll()
  })
})