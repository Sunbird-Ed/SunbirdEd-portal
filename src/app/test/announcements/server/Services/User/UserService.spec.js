let chai = require('chai'),
  sinon = require('sinon'),
  HttpStatus = require('http-status-codes'),
  expect = chai.expect,
  UserService = require('../../../../../app/helpers/announcement/services/user/UserService.js'),
  User = require('../../../../../app/helpers/announcement/services/user/User.js'),
  Joi = require('joi')

describe('User Service', () => {
  let service
  let user
  before(() => {
    service = new UserService({
      userAccessToken: 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ1WXhXdE4tZzRfMld5MG5PS1ZoaE5hU0gtM2lSSjdXU25ibFlwVVU0TFRrIn0.eyJqdGkiOiI5NTk1YTkyNS01Mjk0LTQ0NjktYjkzOS0yYWU0ODU3OGI1MjAiLCJleHAiOjE1MTIxMTMyNDUsIm5iZiI6MCwiaWF0IjoxNTEyMTA5NjQ1LCJpc3MiOiJodHRwczovL2Rldi5vcGVuLXN1bmJpcmQub3JnL2F1dGgvcmVhbG1zL3N1bmJpcmQiLCJhdWQiOiJhZG1pbi1jbGkiLCJzdWIiOiIxNTllOTNkMS1kYTBjLTQyMzEtYmU5NC1lNzViMGMyMjZkN2MiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhZG1pbi1jbGkiLCJhdXRoX3RpbWUiOjAsInNlc3Npb25fc3RhdGUiOiJjYTQzZTYyMC01NWRiLTRkNGUtODgzMy03MTBlMjgwMmJhNjYiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbXSwicmVzb3VyY2VfYWNjZXNzIjp7fSwibmFtZSI6IlN1bmlsIFBhbmRpdGgiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJzdW5pbDFhczk5MCIsImdpdmVuX25hbWUiOiJTdW5pbCIsImZhbWlseV9uYW1lIjoiUGFuZGl0aCIsImVtYWlsIjoic3VuaWwuc2x2cHNoc25AZ21haWwuY29tIn0.CEK_M1keLgVsclC3z_mN6nuSk3iuzW1jcHrbQsxkRNkwRBllsFiZDcpy5FRQ8rcP8FKeCin8LeHaBYLUey-0u8o80-vXp0VeQq8AdiA7XrWYnPmcb9UT4ThWrqvyNyQPISO-FzlrDV_vpZNW5LML9kj1R25x7nr9b-qMfMtA_L6VcIcTyWPNasvpXG0VH6d_4l86X-oX1tCePfmIhVQf3l3Yf_hTOo2i1zecNEJWPRVj9tNhW_fUT27j-_3VY0Vae5sOPT2oDx55m-x1m8ulb7dZgKXoQSbZMr74yZ6548C0ahEPeRMLb4afdpWDA1BNxksYmGSS7_2oRFi-WXB-MQ',
      userIds: '159e93d1-da0c-4231-be94-e75b0c226d7c'
    })
  })

  describe('getUserProfile Method', () => {
    it('Should load the user profile', (done) => {
      service.getUserProfile()
        .then((data) => {
          expect(data.id).to.be.equal(service.userId)
        })
        .catch((error) => {
          expect(error.status).to.not.equal(undefined)
        })
      done()
    })

    it('Should throw an error, when there is invalid user data ', (done) => {
      service = new UserService({})
      service.getUserProfile(undefined, undefined)
        .then((data) => {
          expect(data.id).to.be.equal(undefined)
        })
        .catch((error) => {
          expect(error.status).to.be.equal(HttpStatus.BAD_REQUEST)
        })
      done()
    })
  })
})
