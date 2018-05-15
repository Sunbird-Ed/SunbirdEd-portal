/**
 * @author Manjunath Davanam <manjunathd@ilimi.in>
 */

class AppError extends Error {
  constructor ({message, status, stack } = {}) {
    /**
     * Calling Parent class constructor
     */
    super(message)

    /**
     * @property {string}  - Error Message which is need to be log.
     */
    this.message = message

    /**
     * @property {number}  - statusCode for the error, Default value is `500` if status is not specified.
     */
    this.status = status || 500

    /**
     * @property - Defines the name of the Error.
     */
    this.name = this.constructor.name

    /**
     * @property {object} - Error stack information.
     */
    this.stack = stack

    /**
     * @property {boolean} - Which defines it's a custom error
     */
    this.isCustom = true

    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = AppError
