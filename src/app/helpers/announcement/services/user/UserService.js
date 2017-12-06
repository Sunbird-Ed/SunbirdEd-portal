/**
 * @author Loganathan Shanmugam <loganathan.shanmugam@tarento.com>
 */

let webService = require('request')
let envVariables = require('../../../environmentVariablesHelper.js')
let httpWrapper = require('../httpWrapper.js')
let async = require('async')
const _ = require('lodash')
let User = require('./User.js')
let AppError = require('../ErrorInterface.js')

let HttpStatus = require('http-status-codes')
/**
 * Class provides services for user related requests */

class UserService {
  /**
	 *
	 * Callers of the constructor can invoke as follows:
	 *
	 * let userService = new UserService({userAccessToken: 135-5435-6456,userId:5343434-67676-135-5, httpService:instance })
	 */
  constructor ({
    userAccessToken,
    userId,
    httpService
  } = {}) {
    /**
		 * @property {string} userAccessToken - A user authenticated user token [ TODO: Remove this property once session service is implemented ]
		 */
    this.userAccessToken = userAccessToken

    /**
		 * @property {instance} httpService - Instance of httpservice which is used to make a http service call
		 */
    this.httpService = httpService || httpWrapper

    /**
		 * @property {string} userId - An unique id of user
		 */
    this.userId = userId

    /**
		 * @property {string} profileUri - router path used to store profile path uri
		 */
    this.profileUri = 'user/v1/read/'
  }
  /**
	 * Get user profile of given user
	 */
  getUserProfile () {
    return new Promise((resolve, reject) => {
      if (_.isEmpty(this.userId)) {
        reject(new AppError({
          message: 'user id is required!',
          status: HttpStatus.BAD_REQUEST
        }))
      }
      let options = {
        method: 'GET',
        uri: envVariables.DATASERVICE_URL + this.profileUri + this.userId,
        headers: this.httpService.getRequestHeader(this.userAccessToken)
      }
      this.httpService.call(options).then((data) => {
        let res = JSON.parse(data.body)
        let profileData = res.result.response
        let userData = {
          id: profileData.identifier,
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          email: profileData.email,
          phone: profileData.phone,
          dob: profileData.dob,
          location: profileData.location,
          rootOrg: profileData.rootOrg,
          regOrgId: profileData.regOrgId,
          organisations: profileData.organisations,
          roles: profileData.roles
        }

        let userObj = new User(userData)
        resolve(userObj)
      }).catch((error) => {
        if (_.get(error, 'body.params.err') === 'USER_NOT_FOUND') {
          reject(new AppError({
            message: 'User not found',
            status: HttpStatus.NOT_FOUND
          }))
        } else if (_.get(error, 'body.params.err') === 'UNAUTHORIZE_USER') {
          reject(new AppError({
            message: 'Unauthorised user',
            status: HttpStatus.UNAUTHORIZED
          }))
        } else {
          reject(new AppError({
            message: 'Unknown error',
            status: HttpStatus.INTERNAL_SERVER_ERROR
          }))
        }
      })
    })
  }
}

module.exports = UserService
