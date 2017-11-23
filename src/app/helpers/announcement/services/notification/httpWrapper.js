let webService = require('request')
let envVariables = require('../../../environmentVariablesHelper.js')

/**
 * It used to invoke http request calls 
 */
class HttpWrapper {
    /**
     * It used to invoke the http request 
     * @param  {object} options - Request object it should have header and body.
     */
    static call(options) {
        return new Promise((resolve, reject) => {
            if (!options) reject('options required!')
            options.headers = options.headers || HttpWrapper.getRequestHeader()
            webService(options, (error, response, body) => {
                if (error || response.statusCode >= 400) {
                    reject(error)
                } else {
                    resolve(body)
                }
            })
        })
    }

    /**
     * Which is used to get the request header object structure
     * @param  {string} token - User authenticated token
     * @return {object}       request header
     */
    static getRequestHeader(token) {
        return {
            'x-device-id': 'x-device-id',
            'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
            'x-consumer-id': envVariables.PORTAL_API_AUTH_TOKEN,
            'content-type': 'application/json',
            'accept': 'application/json',
            'Authorization': 'Bearer ' + envVariables.PORTAL_API_AUTH_TOKEN,
            'x-authenticated-user-token': token || '',
        }
    }
}
module.exports = HttpWrapper