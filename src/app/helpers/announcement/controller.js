let Joi = require('joi')
let HttpStatus = require('http-status-codes')
const _ = require('lodash')
let async = require('asyncawait/async')
let await = require('asyncawait/await')
const ObjectStoreRest = require('./ObjectStore/ObjectStoreRest.js')
let uuidv1 = require('uuid/v1')
let dateFormat = require('dateformat')
let webService = require('request')
let envVariables = require('../environmentVariablesHelper.js')
let ApiInterceptor = require('sb_api_interceptor')
let NotificationService = require('./services/notification/notificationService.js')
let NotificationPayload = require('./services/notification/notificationPayload.js')
let NotificationTarget = require('./services/notification/notificationTarget.js')
let httpWrapper = require('./services/httpWrapper.js')
let AppError = require('./services/ErrorInterface.js')

const statusConstant = {
    'ACTIVE': 'active',
    'CANCELLED': 'cancelled',
    'DRAFT': 'draft'
}

const metricsActivityConstant = {
    'READ': 'read',
    'RECEIVED': 'received'
}

const LIMIT_DEFAULT = 10
const LIMIT_MAX = 200
const OFFSET_DEFAULT = 0

class AnnouncementController {
    constructor({metricsModel, announcementModel, announcementTypeModel, service } = {}) {
        /**
         * @property {class}  - Metrics model class to validate the metrics object
         */
        this.metricsModel = metricsModel;

        /**
         * @property {class} - announcment model class to validate the object
         * @type {[type]}
         */
        this.announcementModel = announcementModel;

        /**
         * @property {class}  - announcement type class to validate the object
         * @type {[type]}
         */
        this.announcementTypeModel = announcementTypeModel;

        /**
         * @property {class} - Http Service instance used ot make a http request calls
         */
        this.httpService = service || httpWrapper;

        /**
         * Creating a instance of ObjectStoreRest with metrics,announcement,announcementType model classes
         */
        this.announcementStore = new ObjectStoreRest({model: this.announcementModel, service:this.httpService});
        this.announcementMetricsStore = new ObjectStoreRest({model:this.metricsModel, service:this.httpService});
        this.announcementTypeStore = new ObjectStoreRest({model:this.announcementTypeModel, service:this.httpService})
    }

    /**
     * Which is used to create a announcment
     * @param   {object}  requestObj  - Request object
     */
    create(requestObj) {
        return this.__create()(requestObj)
    }
    __create() {
        return async((requestObj) => {
            try {
                let validation = this.announcementModel.validateApi(requestObj.body)
                if (!validation.isValid) throw {
                    message: validation.error,
                    status: HttpStatus.BAD_REQUEST,
                    isCustom:true
                }
                let authUserToken = _.get(requestObj, 'kauth.grant.access_token.token') || _.get(requestObj, "headers['x-authenticated-user-token']")
                let tokenDetails = await(this.__getTokenDetails(authUserToken))
                if(tokenDetails){
                    requestObj.body.request.userId = tokenDetails.userId
                }else{
                    throw this.customError({message:'Unauthorized', status: HttpStatus.UNAUTHORIZED, isCustom:true})
                }
                var newAnnouncementObj = await (this.__createAnnouncement(requestObj.body.request))
                if (newAnnouncementObj.data.id) {
                    requestObj.body.request.announcementId = newAnnouncementObj.data.id
                    this.__createAnnouncementNotification(requestObj)()
                    return {
                        announcement: newAnnouncementObj.data
                    }
                }
            } catch (error) {
                throw this.customError(error)
            }
        })
    }

    __getUserProfile(authUserToken) {
        return new Promise((resolve, reject) => {
            try {
                let tokenDetails = await(this.__getTokenDetails(authUserToken))
                if (!tokenDetails) {
                    throw {message: 'Unauthorized User!', status: HttpStatus.UNAUTHORIZED,isCustom:true } 
                }
                let options = {
                    method: 'GET',
                    uri: envVariables.DATASERVICE_URL + 'user/v1/read/' + tokenDetails.userId,
                    headers: this.httpService.getRequestHeader(authUserToken)
                }
                this.httpService.call(options).then((data) => {
                        data.body = JSON.parse(data.body)
                        resolve(_.get(data, 'body.result.response'))
                    })
                    .catch((error) => {
                        if (_.get(error, 'body.params.err') === 'USER_NOT_FOUND') {
                            reject(this.customError({
                                message: 'User not found!',
                                status: HttpStatus.NOT_FOUND,
                                isCustom:true
                            }))
                        } else if (_.get(error, 'body.params.err') === 'UNAUTHORIZE_USER') {
                            reject(this.customError({
                                message: 'Unauthorized User!',
                                status: HttpStatus.UNAUTHORIZED,
                                isCustom:true
                            }))
                        } else {
                            reject(this.customError({
                                message: 'Unknown Error!',
                                status: HttpStatus.BAD_GATEWAY,
                                isCustom:true
                            }))
                        }
                    })
            } catch (error) {
                reject(this.customError(error))
            }
        })
    }

    __createAnnouncement(data) {
        return new Promise((resolve, reject) => {
            let announcementId = uuidv1()
            if (!data) reject(this.customError({
                message: 'Invalid Request, Values are required.',
                statusCode: HttpStatus.BAD_REQUEST,
                isCustom:true
            }))

            let attachments = data.attachments ? _.map(data.attachments, JSON.stringify) : []
            let query = {
                values: {
                    'id': announcementId,
                    'sourceid': data.sourceId,
                    'createddate': dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss:lo"),
                    'userid': data.userId,
                    'details': {
                        'title': data.title,
                        'type': data.type,
                        'description': data.description || '',
                        'from': data.from,
                    },
                    'target': data.target,
                    'links': data.links || [],
                    'status': statusConstant.ACTIVE,
                    'attachments': attachments
                }
            }

            this.announcementStore.createObject(query)
                .then((data) => {
                    if (data) {
                        resolve({
                            data: {
                                id: announcementId
                            }
                        })
                    } else {
                        throw {
                            message: 'Unable to create!',
                            status: HttpStatus.INTERNAL_SERVER_ERROR,
                            isCustom:true
                        }
                    }
                })
                .catch((error) => {
                    reject(this.customError(error))
                })
        })
    }
    
    /**
     * Which is used to create a announcements notification
     * @param  {object} annoucement - Request object 
     */
    __createAnnouncementNotification(annoucement) {
        try {
            return async(() => {
                let authUserToken = _.get(annoucement, 'kauth.grant.access_token.token') || annoucement.headers['x-authenticated-user-token']
                let payload = new NotificationPayload({
                    "msgid": annoucement.body.request.announcementId,
                    "title": annoucement.body.request.title,
                    "msg": annoucement.body.request.description,
                    "icon": "",
                    "validity": "-1",
                    "actionid": "1",
                    "actiondata": "",
                    "dispbehavior": "stack"
                })

                // TODO : notificationServiceInstance should be outside of this method,once session service implemented
                // then it should be outside of this method
                let notifier = new NotificationService({
                    userAccessToken: authUserToken
                })
                let target = new NotificationTarget({
                    target: _.get(annoucement, 'body.request.target')
                })
                let targetValidation = target.validate();
                if (!targetValidation.isValid) {
                    return {
                        msg: targetValidation.error
                    }
                }
                let payloadValidation = payload.validate();
                if (!payloadValidation.isValid) {
                    return {
                        msg: payloadValidation.error
                    }
                }
                notifier.send(target, payload)
            })
        } catch (error) {
            throw this.customError(error)
        }
    }

    /**
     * Get announcement
     *
     * @param   {[type]}  requestObj  [description]
     *
     * @return  {[type]}              [description]
     */
    getAnnouncementById(requestObj) {
        return this.__getAnnouncementById(requestObj)
    }

    __getAnnouncementById(requestObj) {
        return new Promise((resolve, reject) => {
            let query = {
                query: {
                    'id': requestObj.params.id
                }
            }
            this.announcementStore.findObject(query)
                .then((data) => {
                    if (data) {
                        _.forEach(data.data.content, (announcementObj) => {
                            this.__parseAttachments(announcementObj)
                        })
                        resolve(_.get(data.data, 'content[0]'))
                    } else {
                        throw this.customError({
                            message: 'Unable to find!',
                            status: HttpStatus.NOT_FOUND,
                            isCustom:true
                        })
                    }
                })
                .catch((error) => {
                    reject(this.customError(error))
                })
        })
    }



    getDefinitions(requestObj) {
        return this.__getDefinitions()(requestObj)
    }
    __getDefinitions() {
        return async((requestObj) => {
            try {
                let responseObj = {};
                if (requestObj.body.request.definitions) {
                    if (requestObj.body.request.definitions.includes('announcementTypes')) {
                        let announcementTypes = await (this.__getAnnouncementTypes(requestObj));
                        responseObj["announcementTypes"] = announcementTypes;
                    }
                    if (requestObj.body.request.definitions.includes('senderList')) {
                        let senderlist = await (this.__getSenderList()(requestObj));
                        responseObj["senderList"] = senderlist;
                    }
                    return responseObj;
                } else {
                    throw {
                        message: 'Invalid request!',
                        status: HttpStatus.BAD_REQUEST,
                        isCustom:true
                    }
                }
            } catch (error) {
                throw this.customError(error)
            }
        });
    }

    /**
     * Get a list of announcement types
     *
     * @return  {[type]}  [description]
     */
    __getAnnouncementTypes(requestObj) {
        return new Promise((resolve, reject) => {
            let query = {
                query: {
                    'rootorgid': _.get(requestObj, 'body.request.rootOrgId'),
                    'status': statusConstant.ACTIVE
                }
            }
            this.announcementTypeStore.findObject(query)
                .then((data) => {
                    if (data) {
                        resolve(data.data)
                    } else {
                        resolve()
                    }
                })
                .catch((error) => {
                    reject(this.customError(error))
                })
        })
    }

    /**
     * Cancel announcement
     *
     * @param   {[type]}  requestObj  [description]
     *
     * @return  {[type]}              [description]
     */
    cancelAnnouncementById(requestObj) {
        return this.__cancelAnnouncementById()(requestObj)
    }

    __cancelAnnouncementById() {
        return async((requestObj) => {
            let query = {
                values: {
                    id: _.get(requestObj, 'body.request.announcenmentId'),
                    status: statusConstant.CANCELLED
                }
            }
            let authUserToken = _.get(requestObj, 'kauth.grant.access_token.token') || _.get(requestObj, "headers['x-authenticated-user-token']")
            let tokenDetails = await (this.__getTokenDetails(authUserToken));
            let status;
            if (tokenDetails) {
                status = await (this.__checkPermission()(requestObj, tokenDetails.userId, _.get(requestObj, 'body.request.announcenmentId')));
            } else {
                throw this.customError({
                    message: 'Unauthorized User!',
                    status: HttpStatus.UNAUTHORIZED,
                    isCustom:true
                })
            }
            return new Promise((resolve, reject) => {
                if (status) {
                    this.announcementStore.updateObjectById(query)
                        .then((data) => {
                            if (data) {
                                resolve({
                                    id: requestObj.params.announcementId,
                                    status: statusConstant.CANCELLED
                                })
                            } else {
                                throw {
                                    message: 'Unable to cancel!',
                                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                                    isCustom:true
                                }
                            }
                        })
                        .catch((error) => {
                            reject(this.customError(error))
                        })
                } else {
                    reject(this.customError({
                        message: 'Unauthorized User!',
                        status: HttpStatus.UNAUTHORIZED,
                        isCustom:true
                    }))
                }
            })
        })
    }


    /**
     * Get inbox of announcements for a given user
     *
     * @param   {[type]}  requestObj  [description]
     *
     * @return  {[type]}              [description]
     */
    getUserInbox(requestObj) {
        return this.__getUserInbox()(requestObj)
    }

    __getUserInbox() {
        return async((requestObj) => {
            let authUserToken = _.get(requestObj, 'kauth.grant.access_token.token') || _.get(requestObj, "headers['x-authenticated-user-token']")

            let tokenDetails = await (this.__getTokenDetails(authUserToken));
            if (tokenDetails) {
                requestObj.body.request.userId = tokenDetails.userId
            }

            let userProfile = await (this.__getUserProfile(authUserToken))

            // Parse the list of Organisations (User > Orgs) from the response
            let targetOrganisations = []
            _.forEach(userProfile.organisations, function(userOrg) {
                targetOrganisations.push(userOrg.organisationId)
            })
            if (_.isEmpty(targetOrganisations)) return {
                count: 0,
                announcements: []
            }

            // Parse the list of Geolocations (Orgs > Geolocations) from the response
            let targetGeolocations = []
            try {
                let geoData = await (this.__getGeolocations(targetOrganisations, authUserToken))
                    //handle emty target list
                _.forEach(geoData.content, function(geo) {
                    if (geo.locationId) {
                        targetGeolocations.push(geo.locationId)
                    }
                })

                if (_.isEmpty(targetGeolocations)) return {
                    count: 0,
                    announcements: []
                }
            } catch (error) {
                return {
                    count: 0,
                    announcements: []
                }
            }

            // Query announcements where target is listed Geolocations
            let query = {
                query: {
                    "target.geo.ids": targetGeolocations,
                    "status": statusConstant.ACTIVE
                },
                sort_by: {
                    "createddate": "desc"
                },
                limit: this.__getLimit(requestObj.body.request.limit),
                offset: this.__getOffset(requestObj.body.request.offset)
            }

            try {
                let data = await (new Promise((resolve, reject) => {
                    this.announcementStore.findObject(query)
                        .then((data) => {
                            if (!data) {
                                throw {
                                    message: 'Unable to fetch!',
                                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                                    isCustom:true
                                }
                            } else {
                                _.forEach(data.data.content, (announcementObj) => {
                                    this.__parseAttachments(announcementObj)
                                })
                                resolve(data.data)
                            }
                        })
                        .catch((error) => {
                            reject(this.customError(error))
                        })
                }))

                let announcements = []
                if (_.size(data) <= 0) {
                    return {
                        count: 0,
                        announcements: []
                    }
                } else {
                    announcements = data.content
                }

                //Get read and received status and append to response
                let announcementIds = []
                _.forEach(announcements, (announcement, k) => {
                    announcementIds.push(announcement.id)
                    announcement[metricsActivityConstant.READ] = false
                    announcement[metricsActivityConstant.RECEIVED] = false
                })
                let metricsData = await (this.__getMetricsForInbox(announcementIds, userProfile.id))

                if (metricsData) {
                    _.forEach(metricsData, (metricsObj, k) => {
                        let announcementObj = _.find(announcements, {
                            "id": metricsObj.announcementid
                        })
                        announcementObj[metricsObj.activity] = true
                    })
                }

                return {
                    count: data.count,
                    announcements: announcements
                }

            } catch (error) {
                throw this.customError(error)
            }
        })
    }

    __parseAttachments(announcement) {
        let parsedAttachments = []
        _.forEach(announcement.attachments, (attachment, k) => {
            let parsedAttachment = this.__parseJSON(attachment)

            if (parsedAttachment) {
                parsedAttachments.push(parsedAttachment)
            } else {
                parsedAttachments = []
                return false
            }
        })

        announcement.attachments = parsedAttachments
    }

    __parseJSON(jsonString) {
        try {
            return JSON.parse(jsonString)
        } catch (error) {
            return false
        }
    }

    __getGeolocations(orgIds, authUserToken) {
        return new Promise((resolve, reject) => {
            let requestObj = {
                "filters": {
                    "id": orgIds
                },
                "fields": ["id", "locationId"]
            }

            let options = {
                "method": "POST",
                "uri": envVariables.DATASERVICE_URL + "org/v1/search",
                "body": {
                    "request": requestObj
                },
                "json": true
            }
            options.headers = this.httpService.getRequestHeader(authUserToken)
            try {
                let data = new Promise((resolve, reject) => {
                    this.httpService.call(options).then((data) => {
                        resolve(data.body.result.response)
                    }).catch((error) => {
                        reject(this.customError(error))
                    })
                })
                resolve(data)
            } catch (error) {
                reject(this.customError(error))
            }

        })
    }
    __getMetricsForInbox(announcementIds, userId) {
        return new Promise((resolve, reject) => {
            let query = {
                query: {
                    "announcementid": announcementIds,
                    "userid": userId
                },
                limit: 10000
            }

            this.announcementMetricsStore.findObject(query)
                .then((data) => {
                    if (!data) {
                        resolve(false)
                    } else {
                        resolve(data.data.content)
                    }
                })
                .catch((error) => {
                    resolve(false)
                })
        })
    }

    /**
     * Get outbox of announcements for a given user
     *
     * @param   {[type]}  requestObj  [description]
     *
     * @return  {[type]}              [description]
     */
    getUserOutbox(requestObj) {
        return this.__getUserOutbox()(requestObj)
    }

    __getUserOutbox() {
        return async((requestObj) => {

            // validate request
            let authUserToken = _.get(requestObj, 'kauth.grant.access_token.token') || _.get(requestObj, "headers['x-authenticated-user-token']")
            let tokenDetails = await (this.__getTokenDetails(authUserToken));
            if (tokenDetails) {
                requestObj.body.request.userId = tokenDetails.userId
            } else {
                reject({
                    message: 'Unauthorized User',
                    status: HttpStatus.UNAUTHORIZED
                })
            }

            let query = {
                query: {
                    'userid': _.get(requestObj, 'body.request.userId')
                },
                sort_by: {
                    "createddate": "desc"
                },
                limit: this.__getLimit(requestObj.body.request.limit),
                offset: this.__getOffset(requestObj.body.request.offset)
            }

            // execute query and process response
            let outboxData = await (new Promise((resolve, reject) => {
                this.announcementStore.findObject(query)
                    .then((data) => {
                        if (!data) {
                            throw {
                                message: 'Unable to fetch!',
                                status: HttpStatus.INTERNAL_SERVER_ERROR,
                                isCustom:true
                            }
                        } else {
                            _.forEach(data.data.content, (announcementObj) => {
                                this.__parseAttachments(announcementObj)
                            })

                            let response = {
                                count: data.data.count,
                                announcements: data.data.content
                            }

                            resolve(response)
                        }
                    })
                    .catch((error) => {
                        reject(this.customError(error))
                    })

                }))

            let announcementIds = _.map(outboxData.announcements, 'id')
            let announcements = _.map(outboxData.announcements, this.__addMetricsPlaceholder)

            //Get read and received status and append to response
            
            let metricsData = await (this.__getOutboxMetrics(announcementIds, authUserToken))

            if (metricsData) {
                _.forEach(metricsData, (metricsObj, k) => {
                    let announcementObj = _.find(announcements, {
                        "id": metricsObj.announcementid
                    })

                    announcementObj.metrics[metricsActivityConstant.RECEIVED] = 
                        metricsObj[metricsActivityConstant.RECEIVED] ? 
                        metricsObj[metricsActivityConstant.RECEIVED] : 0

                    announcementObj.metrics[metricsActivityConstant.READ] = 
                        metricsObj[metricsActivityConstant.READ] ? 
                        metricsObj[metricsActivityConstant.READ] : 0
                    
                })
            }

            let response = {
                            count: outboxData.count,
                            announcements: announcements
                        }

            return response
        })
    }

    __addMetricsPlaceholder(announcementObj) {
        let metrics = {}
        metrics[metricsActivityConstant.RECEIVED] = 0
        metrics[metricsActivityConstant.READ] = 0

        announcementObj.metrics = metrics

        return announcementObj
    }

    __getOutboxMetrics(announcementIds, authUserToken) {
        return new Promise((resolve, reject) => {
            let query = {
                    "aggs": {
                        "announcementid": {
                            "terms": {
                                "field": "announcementid.raw",
                                "include": announcementIds
                            },
                            "aggs": {
                                "activity": {
                                    "terms": {
                                        "field": "activity.raw",
                                        "include": [
                                            metricsActivityConstant.READ,
                                            metricsActivityConstant.RECEIVED
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            this.announcementMetricsStore.getMetrics(query, authUserToken)
                .then((response) => {
                    if (!response) {
                        resolve(false)
                    } else {
                        resolve(response)
                    }
                })
                .catch((error) => {
                    resolve(false)
                })
        })
    }

    __getLimit(requestedLimit) {
        let limit = requestedLimit || LIMIT_DEFAULT
        limit = limit > LIMIT_MAX ? LIMIT_MAX : limit
        return limit
    }

    __getOffset(requestedOffset) {
        let offset = requestedOffset || OFFSET_DEFAULT
        return offset
    }

    
    /**
     * Get a list of senders on whose behalf the user can send announcement
     *
     * @param   {[type]}  requestObj  [description]
     *
     * @return  {[type]}              [description]
     */

    __getSenderList() {
        return async((requestObj) => {
            let authUserToken = _.get(requestObj, 'kauth.grant.access_token.token') || _.get(requestObj, "headers['x-authenticated-user-token']")
            let userData = {}
            return await (new Promise((resolve, reject) => {
                this.__getUserProfile(authUserToken)
                    .then((data) => {
                        if (!data) {
                            throw {
                                message: 'Unable to fetch!',
                                status: HttpStatus.INTERNAL_SERVER_ERROR,
                                isCustom:true
                            }
                        } else {
                            userData[data.id] = data.firstName + " " + data.lastName
                            resolve(userData)
                        }
                    })
                    .catch((error) => {
                        reject(this.customError(error))
                    })
            }))
        })
    }

    /**
     * Mark announcement(s) received for a given user
     *
     * @param   {[type]}  requestObj  [description]
     *
     * @return  {[type]}              [description]
     */
    received(requestObj) {
        return this.__received()(requestObj)
    }

    __received(requestObj) {
        return async((requestObj) => {
            try {
                let authUserToken = _.get(requestObj, 'kauth.grant.access_token.token') || _.get(requestObj, "headers['x-authenticated-user-token']")
                let tokenDetails = await (this.__getTokenDetails(authUserToken));
                let request = this.metricsModel.validateApi(requestObj.body)
                if (tokenDetails) {
                    requestObj.body.request.userId = tokenDetails.userId
                } else {
                    throw new AppError({
                        message: 'Unable to fetch!',
                        status: HttpStatus.UNAUTHORIZE_USER
                    })
                }
                // validate request
                if (!request.isValid) throw new AppError({
                    message: request.error,
                    statusCode: HttpStatus.BAD_REQUEST
                })
                let metricsExists = false
                metricsExists = await (this.__isMetricsExist(requestObj.body.request, metricsActivityConstant.RECEIVED))
                if (metricsExists) {
                    return {
                        'msg': 'Entry exists',
                        statusCode: HttpStatus.OK
                    }
                } else {
                    var metricsData = await (this.__createMetrics(requestObj.body.request, metricsActivityConstant.RECEIVED))
                    return {
                        metrics: metricsData.data
                    }
                }
            } catch (error) {
                throw this.customError(error)
            }
        })
    }

    /**
     * Mark announcement(s) read for a given user
     *
     * @param   {[type]}  requestObj  [description]
     *
     * @return  {[type]}              [description]
     */
    read(requestObj) {
        return this.__read()(requestObj)
    }

    __read(requestObj) {
        return async((requestObj) => {
            // validate request
            let authUserToken = _.get(requestObj, 'kauth.grant.access_token.token') || _.get(requestObj, "headers['x-authenticated-user-token']")
            let tokenDetails = await (this.__getTokenDetails(authUserToken));
            let request = this.metricsModel.validateApi(requestObj.body)
            if (tokenDetails) {
                requestObj.body.request.userId = tokenDetails.userId
            } else {
                throw this.customError({
                    message: 'Unauthorized User!',
                    status: HttpStatus.UNAUTHORIZED,
                    isCustom:true
                })
            }
            if (!request.isValid) throw {
                message: request.error,
                status: HttpStatus.BAD_REQUEST,
                isCustom:true
            }

            let metricsExists = false
            try {
                metricsExists = await (this.__isMetricsExist(requestObj.body.request, metricsActivityConstant.READ))
            } catch (error) {
                throw this.customError(error)
            }


            if (metricsExists) {
                return {
                    'msg': 'Entry exists',
                    statusCode: HttpStatus.OK
                }
            } else {
                try {
                    var metricsData = await (this.__createMetrics(requestObj.body.request, metricsActivityConstant.READ))
                    return {
                        metrics: metricsData.data
                    }
                } catch (error) {
                    throw this.customError(error)

                }
            }

        })
    }
    __createMetrics(requestObj, metricsActivity) {
        return new Promise((resolve, reject) => {
            // build query
            let metricsId = uuidv1()
            let query = {
                values: {
                    'id': metricsId,
                    'userid': requestObj.userId,
                    'announcementid': requestObj.announcementId,
                    'channel': requestObj.channel,
                    'activity': metricsActivity,
                    'createddate': dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss:lo"),
                }
            }
            this.announcementMetricsStore.createObject(query)
                .then((data) => {
                    if (!data) {
                        throw {
                            message: 'Unable to create',
                            status: HttpStatus.INTERNAL_SERVER_ERROR,
                            isCustom:true
                        }
                    } else {
                        resolve({
                            data: {
                                id: metricsId
                            }
                        })
                    }
                })
                .catch((error) => {
                    reject(this.customError(error))
                })
        })
    }

    __isMetricsExist(requestObj, metricsActivity) {
        return new Promise((resolve, reject) => {
            let query = {
                query: {
                    "announcementid": requestObj.announcementId,
                    "userid": requestObj.userId,
                    "activity": metricsActivity
                }
            }

            this.announcementMetricsStore.findObject(query)
                .then((data) => {
                    if (!data.status) {
                        resolve(false)
                    } else {
                        if (_.size(data.data)) {
                            resolve(true)
                        } else {
                            resolve(false)
                        }
                    }
                })
                .catch((error) => {
                    resolve(false)
                })
        })
    }

    /**
     * Get the announcement data to duplicate for resending
     *
     * @param   {[type]}  requestObj  [description]
     *
     * @return  {[type]}              [description]
     */
    getResend() {
        return async((requestObj) => {
            try {
                let authUserToken = _.get(requestObj, 'kauth.grant.access_token.token') || _.get(requestObj, "headers['x-authenticated-user-token']")
                let tokenDetails = await (this.__getTokenDetails(authUserToken));
                let status;
                if (tokenDetails) {
                    status = await (this.__checkPermission()(requestObj, tokenDetails.userId, requestObj.params.announcementId));
                    if (status) {
                        return this.__getAnnouncementById(requestObj)
                    } else {
                        throw {
                            message: 'Unauthorized user',
                            status: HttpStatus.UNAUTHORIZED,
                            isCustom:true
                        }
                    }
                } else {
                    throw {
                        message: 'Unauthorized user',
                        status: HttpStatus.UNAUTHORIZED,
                        isCustom:true
                    }
                }
            } catch (error) {
                throw this.customError(error)
            }
        })

    }

    /**
     * Resend the edited announcement
     * @param  {[type]} requestObj [description]`
     * @return {[type]}            [description]
     */
    resend(requestObj) {
        // TODO: duplicate file data??

        return this.__create()(requestObj)
    }

  __checkPermission() {
      return async((requestObj, userid, announcementId) => {
          if (requestObj) {
              requestObj.params = {};
              requestObj.params.id = announcementId
              var response = await (this.getAnnouncementById(requestObj));
              if(response){
                return response.userid === userid ? true : false
              }else{
                return false
              }
          } else {
              return false;
          }
      });
  }
    __getTokenDetails(authUserToken) {
        return new Promise((resolve, reject) => {
            var keyCloak_config = {
                'authServerUrl': envVariables.PORTAL_AUTH_SERVER_URL,
                'realm': envVariables.KEY_CLOAK_REALM,
                'clientId': envVariables.PORTAL_AUTH_SERVER_CLIENT,
                'public': envVariables.KEY_CLOAK_PUBLIC
            }

            var cache_config = {
                stroe: envVariables.sunbird_cache_store,
                ttl: envVariables.sunbird_cache_ttl
            }
            if (authUserToken) {
                var apiInterceptor = new ApiInterceptor(keyCloak_config, cache_config)
                apiInterceptor.validateToken(authUserToken, function(err, token) {
                    if (token) {
                        resolve(token)
                    } else {
                        resolve(false)
                    }
                })
            } else {
                resolve(false)
            }
        })
    }

    /**
     * Which is used to create a custom error object
     * @param  {Object} error  - Error object it should contain message and status attribute 
     *                           For example error = {message:'Invalid request object', status:'400'}
     * @return {Object}        - Error object
     */
    customError(error) {
        if (error.isCustom) {
            return new AppError({
                message: error.message || 'Unable to process the request!',
                status: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
            })
        } else {
            return new AppError({
                message: 'Unable to process the request!',
                status: HttpStatus.INTERNAL_SERVER_ERROR
            })
        }
    }
}
module.exports = AnnouncementController