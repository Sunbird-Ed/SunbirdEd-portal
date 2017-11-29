/**
 * @author Loganathan Shanmugam <loganathan.shanmugam@tarento.com>
 */

let webService = require('request')
let envVariables = require('../../../environmentVariablesHelper.js')
let httpWrapper = require('./httpWrapper.js')
let async = require('async')
const _ = require('lodash')
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

		/**
		 * @property {object} userProfile - object used to store user profile data
		 */
		this.userProfile = {}
	}


	/**
	 * map the profile service response values to user profile object keys
	 */
	__mapProfileResponse(profileResponse) {
        this.userProfile.userId = profileResponse.userId
		this.userProfile.name = profileResponse.firstName + ' ' + profileResponse.lastName
        this.userProfile.loginId = profileResponse.userName
        this.userProfile.email = profileResponse.email
        this.userProfile.phone = profileResponse.phone
        this.userProfile.dob = profileResponse.dob
        this.userProfile.location = profileResponse.location
        this.userProfile.rootOrg = profileResponse.rootOrg
        this.userProfile.regOrgId = profileResponse.regOrgId
        this.userProfile.organisations = profileResponse.organisations
        this.userProfile.roles = profileResponse.roles
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
				var res = JSON.parse(data);
				__mapProfileResponse(res.result.response)
				resolve(this.userProfile)
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
