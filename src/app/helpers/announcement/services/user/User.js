/**
 * @author Loganathan Shanmugam <loganathan.shanmugam@tarento.com>
 */

/**
 * Class provides user details for user related services
 */

class User {
  constructor ({
    id,
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
    this.id = id

    /**
		 * @property {string} firstName - first name of the user
		 */
    this.firstName = firstName

    /**
		 * @property {string} lastName - last name of the user
		 */
    this.lastName = lastName

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
module.exports = User
