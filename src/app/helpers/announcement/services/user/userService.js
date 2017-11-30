/**
 * @author Loganathan Shanmugam <loganathan.shanmugam@tarento.com>
 */

let webService = require('request')
let envVariables = require('../../../environmentVariablesHelper.js')
let httpWrapper = require('./httpWrapper.js')
let async = require('async')
const _ = require('lodash')
let UserPayload = require('./userPayload.js')
/**
 * Class provides services for user related requests */

class UserService {
	/**
	 *
	 * Callers of the constructor can invoke as follows:
	 *
	 * let notifier = new UserService({userAccessToken: 135-5435-6456, httpService:instance })
	 */
	constructor({
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
	getUserProfile() {
		return new Promise((resolve, reject) => {
			if (_.isEmpty(this.userId)) {
				reject('user id is required!')
			}
			let options = {
				method: 'GET',
				uri: envVariables.DATASERVICE_URL + this.profileUri + this.userId,
				headers: this.httpService.getRequestHeader(this.userAccessToken)
			}
			this.httpService.call(options).then((data) => {
				let res = JSON.parse(data);
				let user = new UserPayload(res.result.response)
				resolve(user)
			}).catch((error) => {
				console.log(error)
				if (_.get(error, 'body.params.err') === 'USER_NOT_FOUND') {
					reject('USER_NOT_FOUND')
				} else if (_.get(error, 'body.params.err') === 'UNAUTHORIZE_USER') {
					reject('UNAUTHORIZE_USER')
				} else {
					reject("UNKNOWN_ERROR")
				}
			})
		})
	}

}

module.exports = UserService
