import { assert } from 'chai'
import nock from 'nock'

import Georide from '../src/georide'
import { Token } from '../src/request'


describe('user endpoint', () => {
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

  beforeEach(() => {
    client.config.setToken(new Token(tokenData))
  })

  describe('get user info', () => {
    it('should return user info', async () => {
      const infoData = {
        id: "123",
        email: emailAddress,
        firstName: "John",
        createdAt: "2019-03-18T11:24:15.031Z",
        phoneNumber: "33612345678",
        pushUserToken: null,
        legal: true,
        legalSocial: true,
        dateOfBirth: '1999-01-01'
      }

      scope.get('/user').reply(200, infoData)
  
      const info = await client.User.info()
      assert.deepEqual(info, infoData)
    })
  })

  describe('get user trackers list', () => {
    it('should return the user trackers list', async () => {
      const trackersData = {
        trackers: [{
          trackerId: 123
        }]
      }

      scope.get('/user/trackers').reply(200, trackersData)

      const trackers = await client.User.trackers()
      assert.deepEqual(trackersData, trackers)
    })
  })

  after(() => {
    nock.cleanAll()
  })
})