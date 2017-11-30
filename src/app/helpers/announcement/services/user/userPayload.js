/**
 * @author Loganathan Shanmugam <loganathan.shanmugam@tarento.com>
 */




/**
 * Class provides user object for user related services */

class UserPayload {
	constructor({
		userId,
		userName,
		firstName,
		lastName,
		email,
		phone,
		dob,
		location,
		rootOrg,
		regOrgId,
		organisations,
		roles
	} = {}) {
		/**
		 * @property {string} userId - a unqiue id for the user
		 */
		this.userId = userId

		/**
		 * @property {string} name - combination of firstname and lastname for the user
		 */
		this.name = firstName + ' ' + lastName

		/**
		 * @property {string} loginId - login username of the user
		 */
		this.loginId = userName

		/**
		 * @property {string} email - email id of the user
		 */
		this.email = email

		/**
		 * @property {string} phone - contact number of the user
		 */
		this.phone = phone

		/**
		 * @property {date} dob - date of birth of the user
		 */
		this.dob = dob

		/**
		 * @property {string} location - place or location of the user
		 */
		this.location = location

		/**
		 * @property {string} rootOrg - root organisation to which user belongs to
		 */
		this.rootOrg = rootOrg

		/**
		 * @property {string} regOrgId - organisation id to which user belongs to
		 */
		this.regOrgId = regOrgId

		/**
		 * @property {array} organisations - list of organisations to which user belongs to
		 */
		this.organisations = organisations

		/**
		 * @property {array} roles - list of roles to which user assigned to
		 */
		this.roles = roles
	}
}
