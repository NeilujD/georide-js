import { assert } from 'chai'
import nock from 'nock'

import Georide from '../src/georide'
import { Token } from '../src/request'


describe('trip endpoint', () => {
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

  describe('get a shared trip', () => {
    it('should return a trip by share id', async () => {
      const shareId = '123'
  
      const data = { trips: [{id: 123}]}
  
      scope.get(`/trip/${shareId}`).reply(200, data)
  
      const result = await client.Trip.get(shareId)
      assert.deepEqual(result, data)
    })
  })

  after(() => {
    nock.cleanAll()
  })
})