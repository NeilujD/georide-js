import { assert } from 'chai'
import nock from 'nock'

import Georide from '../src/georide'
import { Token, GEORIDE_INVALID_LOGIN, GEORIDE_MISSING_TOKEN_ERROR, ERRORS } from '../src/request'


describe('Georide authentication', () => {
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

  describe('user login', () => {
    it('should return a token', async () => {
      scope.post('/user/login', { email: emailAddress, password }).reply(200, tokenData)

      const token = await client.login()
      const { id, email, isAdmin, authToken } = token
      assert.deepEqual({
        id, email, isAdmin, authToken
      }, tokenData)
    })

    it('should return an error if email or password is wrong', async () => {
      scope.post('/user/login', { email: emailAddress, password }).reply(200, {
        error: GEORIDE_INVALID_LOGIN
      })

      try {
        await client.login()
      } catch (e) {
        assert.equal(e.message, ERRORS[GEORIDE_INVALID_LOGIN])
      }
    })

    after(()=>{
      nock.cleanAll()
    })
  })

  describe('authorisation header', () => {
    const infoData = {ok: true}

    it('should try to authenticate if no token exist', async () => {
      client.config.setToken(null)
      
      scope.post('/user/login', { email: emailAddress, password }).reply(200, tokenData)
      scope.get('/user').reply(200, infoData)
      
      const info = await client.User.info()
      assert.deepEqual(info, infoData)
    })

    it('should try to generate a new token if token is not valid', async () => {
      client.config.setToken(new Token(tokenData))

      scope.get('/user').matchHeader('authorization', `Bearer ${tokenData.authToken}`).reply(200, {
        errors: { message: GEORIDE_MISSING_TOKEN_ERROR }
      })
      const authToken = "456"
      scope.get('/user/new-token').reply(200, {
        ...tokenData,
        authToken
      })
      scope.get('/user').matchHeader('authorization', `Bearer ${authToken}`).reply(200, infoData)

      const info = await client.User.info()
      assert.deepEqual(info, infoData)
      assert.propertyVal(client.config.getToken(), 'authToken', authToken)
    })

    it('throw an error if no valid token is given', async () => {
      client.config.setToken(null)

      scope.post('/user/login', { email: emailAddress, password }).reply(200, tokenData)
      scope.get('/user').reply(200, {
        errors: { message: GEORIDE_MISSING_TOKEN_ERROR }
      })

      try {
        await client.User.info()
      } catch (e) {
        assert.equal(e.message, ERRORS[GEORIDE_MISSING_TOKEN_ERROR])
      }
    })

    after(()=>{
      nock.cleanAll()
    })
  })
})