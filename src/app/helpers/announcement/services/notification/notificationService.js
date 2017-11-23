/**
 * @author Manjunath Davanam <manjunathd@ilimi.in>
 */

let webService = require('request')
let envVariables = require('../../../environmentVariablesHelper.js')
let httpWrapper = require('./httpWrapper.js')
let async = require('async')
const _ = require('lodash')
    /**
     * Class provides service to send a notfication to enduser.
     */
class NotificationService {
    /**
     * Create a notification
     * Callers of the constructor can invoke as follows:
     * 
     * let notifier = new NotificationService({userAccessToken: 135-5435-6456, httpService:instance })
     */
    constructor({userAccessToken, httpService} = {}) {
        /**
         * @property {string} userAccessToken - A user authenticated user token [ TODO: Remove this property once session service is implemented ]
         */
        this.userAccessToken = userAccessToken

        /**
         * @property {instance} httpService - Instance of httpservicew which is used to make a http service call 
         */
        this.httpService = httpService || httpWrapper

        /**
         * @property {string} - Which defines the notification type. By default it's `fcm`
         */
        this.type = 'fcm'

        /**
         * @property {string} - router path used to send a notification. By default it's `data/v1/notification/send`
         */
        this.uri = 'data/v1/notification/send'

        /**
         * @property {string} method - Which is used to make a post request call
         */
        this.method = 'POST'
    }

    /**
     * Which is used to send a notification.
     * @param  {instance} target - Instance of notificatonTarget.
     * @param  {instance} payload - Instance of notificationPayload.
     */
    send(target, payload) {
        return new Promise((resolve, reject) => {
            let config = {
                uri: envVariables.DATASERVICE_URL + this.uri,
                method: this.method,
                json: true,
                body: {request: {data: {notificationpayload: {} } } }
            }
            config.headers = this.httpService.getRequestHeader(this.userAccessToken)
            config.body.request.data.notificationpayload = payload
            config.body.request.type = this.type
            async.each(target.getIds(), (targetId, callback) => {
                config.body.request.to = targetId;
                this.httpService.call(config)
                callback()
            }, (error) => {
                if (error) {
                    reject(error)
                } else {
                    resolve()
                }
            })
        })
    }
}

module.exports = NotificationService