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
let Dataservice = require('./services/dataService.js')
let httpWrapper = require('./services/httpWrapper.js')
let AppError = require('./services/ErrorInterface.js')
let DataTransform = require("node-json-transform").DataTransform
let telemetry = require('./telemetry/telemetryHelper')

const statusConstant = {
    'ACTIVE': 'active',
    'INACTIVE': 'inactive',
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

const announcementBaseFieldsMap = {
    id: "id",
    from: "details.from",
    type: "details.type",
    title: "details.title",
    description: "details.description",
    links: "links",
    attachments: "attachments",
    createdDate: "createddate",
    status: "status"
}

const announcementResendFieldsMap = {
    target: "target"
}

const announcementInboxFieldsMap = {
    read: "read",
    received: "received"
}

const announcementOutboxFieldsMap = {
    target: "target",
    metrics: {sent: "sentcount", read: "metrics.read", received: "metrics.received"}
}

const announcementTypeMap = {
    id: "id",
    name: "name"
}

const announcementTypeMapAdmin = {
    createdDate: "createddate",
    status: "status",
    rootOrgId: "rootorgid"
}

class AnnouncementController {
    constructor({metricsModel, announcementModel, announcementTypeModel, service } = {}) {
        /**
         * @property {class}  - Metrics model class to validate the metrics object
         */
        this.metricsModel = metricsModel

        /**
         * @property {class} - announcment model class to validate the object
         * @type {[type]}
         */
        this.announcementModel = announcementModel

        /**
         * @property {class}  - announcement type class to validate the object
         * @type {[type]}
         */
        this.announcementTypeModel = announcementTypeModel

        /**
         * @property {class} - Http Service instance used ot make a http request calls
         */
        this.httpService = service || httpWrapper

        /**
         * Creating a instance of ObjectStoreRest with metrics,announcement,announcementType model classes
         */
        this.announcementStore = new ObjectStoreRest({model: this.announcementModel, service:this.httpService})
        this.announcementMetricsStore = new ObjectStoreRest({model:this.metricsModel, service:this.httpService})
        this.announcementTypeStore = new ObjectStoreRest({model:this.announcementTypeModel, service:this.httpService})
        this.dataService = new Dataservice({service:this.httpService})
    }

    /**
     * To create an announcment
     * @param   {object}  requestObj  - Request object
     */
    create(requestObj) {
        return this.__create()(requestObj)
    }

    /**
     * Initialize the create announcement, validates, manage the create workflow
     * @return Object Response of create
     */
    __create() {
        return async((requestObj) => {
            try {
                let validation = this.announcementModel.validateApi(requestObj.body)

                if (!validation.isValid) throw {
                    message: validation.error,
                    status: HttpStatus.BAD_REQUEST,
                    isCustom:true
                }

                let userId = await(this.__getLoggedinUserId()(requestObj))
                if(userId){
                    requestObj.body.request.userId = userId
                } else {
                    throw this.customError({message:'Unauthorized', status: HttpStatus.UNAUTHORIZED, isCustom:true})
                }
                let sentCount = await(this.dataService.getAudience(_.get(requestObj, 'body.request.target.geo.ids'), undefined, requestObj.reqID))
                requestObj.body.request.sentCount = sentCount
                var newAnnouncementObj = await (this.__saveAnnouncement(requestObj.body.request))
                if (newAnnouncementObj.data.id) {
                    requestObj.body.request.announcementId = newAnnouncementObj.data.id
                    this.__notify(requestObj)()
                    return {
                        announcement: newAnnouncementObj.data
                    }
                }
            } catch (error) {
                throw this.customError(error)
            }
        })
    }
    /**
     * save values in database
     * @param  Object data Data to be stored
     * @return Object      Response
     */
    __saveAnnouncement(data) {
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
                    'createddate': dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss:lo", true),
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
                    'attachments': attachments,
                    'sentcount':data.sentCount
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
     * To send an announcement notification
     * @param  Object annoucement - Request object 
     */
    __notify(requestObj) {
        try {
            return async(() => {
                //TODO check if the below code works
                let authUserToken = this.__getToken(requestObj)
                let payload = new NotificationPayload({
                    "msgid": requestObj.body.request.announcementId,
                    "title": requestObj.body.request.title,
                    "msg": requestObj.body.request.description,
                    "time": dateFormat(new Date(), "yyyy-mm-dd'T'HH:MM:sso", true),
                    "validity": "-1",
                    "actionid": "1",
                    "actiondata": {announcementId: requestObj.body.request.announcementId},
                    "icon": "",
                    "dispbehavior": "stack"
                })

                // TODO : notificationServiceInstance should be outside of this method,once session service implemented
                // then it should be outside of this method
                let notifier = new NotificationService({
                    userAccessToken: authUserToken
                })
                let target = new NotificationTarget({
                    target: _.get(requestObj, 'body.request.target')
                })
                let targetValidation = target.validate()
                if (!targetValidation.isValid) {
                    return {
                        msg: targetValidation.error
                    }
                }
                let payloadValidation = payload.validate()
                if (!payloadValidation.isValid) {
                    return {
                        msg: payloadValidation.error
                    }
                }
                notifier.send(target, payload.getPayload(), requestObj.reqID)
            })
        } catch (error) {
            throw this.customError(error)
        }
    }

    /**
     * Get announcement by id
     *
     * @param   {[type]}  requestObj  [description]
     *
     * @return  {[type]}              return transformed data
     */
    getAnnouncementById(requestObj) {
        return new Promise((resolve, reject) => {
            let announcementId = requestObj.params.id
            telemetry.addObjectData(requestObj.reqID, telemetry.getObjectData(announcementId, 'announcement'))
            let announcement = this.__getAnnouncementById(announcementId, requestObj.reqID).then((data) => {
                                let transformationMap = this.__getTransformationMap(announcementBaseFieldsMap)
                                let transformedData = this.__transformResponse(data, transformationMap)
                                return {announcement: transformedData[0]}
                            })
                            .catch((err) => {
                                reject(this.customError(err))
                            })

            resolve(announcement) 
        })
    }

    /**
     * Get definitions required to populate create announcement screen
     * @param  Object requestObj [description]
     * @return Object            [description]
     */
    getDefinitions(requestObj) {
        return this.__getDefinitions()(requestObj)
    }
    __getDefinitions() {
        return async((requestObj) => {
            try {
                let responseObj = {}
                if (requestObj.body.request.definitions) {
                    if (requestObj.body.request.definitions.includes('announcementTypes')) {
                        let announcementTypes = await (this.__getAnnouncementTypes(requestObj))
                        responseObj["announcementTypes"] = announcementTypes
                    }
                    return responseObj
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
        })
    }

    /**
     * Get a list of announcement types
     *
     * @return  {[type]}  [description]
     */
    __getAnnouncementTypes(requestObj, manageObj = false) {
        return new Promise((resolve, reject) => {
            let rootorgid = _.get(requestObj, 'body.request.rootOrgId')
            if (_.isUndefined(rootorgid)) {
                reject(this.customError({
                            message: 'Invalid input!',
                            status: HttpStatus.BAD_REQUEST,
                            isCustom:true
                        }))
            }


            let queryParams = {
                    'rootorgid': rootorgid,
                    'status': statusConstant.ACTIVE
            }

            if (manageObj) {
                queryParams = _.pick(queryParams, ['rootorgid'])
            }
            

            let queryObj = {
                query: queryParams,
                reqID: requestObj.reqID
            }

            this.announcementTypeStore.findObject(queryObj)
                .then((data) => {
                    if (data) {

                        let transformationMap = {}
                        if (manageObj) {
                            transformationMap = this.__getTransformationMap(announcementTypeMap, announcementTypeMapAdmin)
                        } else {
                            transformationMap = this.__getTransformationMap(announcementTypeMap)
                        }

                        let transformedData = this.__transformResponse(data.data.content, transformationMap)
                        
                        resolve(transformedData)
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
            let userId = await(this.__getLoggedinUserId()(requestObj))
            let status
            if (userId) {
                status = await (this.__isAuthor()(userId, _.get(requestObj, 'body.request.announcementId')))
            } else {
                throw this.customError({
                    message: 'Unauthorized User!',
                    status: HttpStatus.UNAUTHORIZED,
                    isCustom:true
                })
            }
            return new Promise((resolve, reject) => {
                if (status) {
                    let query = {
                        values: {
                            id: _.get(requestObj, 'body.request.announcementId'),
                            status: statusConstant.CANCELLED
                        },
                        reqID: requestObj.reqID
                    }

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
            let authUserToken = this.__getToken(requestObj)
            let userId = await(this.__getLoggedinUserId()(requestObj))
            if (userId) {
                requestObj.body.request.userId = userId
            }

            let userProfile = {}

            try {
                userProfile = await (this.__getUserProfile(authUserToken, requestObj.reqID))
            } catch (error) {
                console.log("Announcement - inbox userprofile - Error", error)
                return {
                    count: 0,
                    announcements: []
                }
            }

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
                let geoData = await (this.dataService.getGeoLocations(targetOrganisations, authUserToken, requestObj.reqID))
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
                console.log("Announcement - inbox geolocations - Error", error)
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
                offset: this.__getOffset(requestObj.body.request.offset),
                reqID: requestObj.reqID
            }

            try {
                let data = await (new Promise((resolve, reject) => {
                    this.announcementStore.findObject(query)
                        .then((data) => {
                            if (_.size(data) <= 0) {
                                resolve()
                            } else {
                                _.forEach(data.data.content, (announcementObj) => {
                                    this.__parseAttachments(announcementObj)
                                })
                                resolve(data.data)
                            }
                        })
                        .catch((error) => {
                            console.log("Announcement - inbox get announcements - Error", error)
                            resolve()
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
                let metricsData = await (this.__getMetricsForInbox(announcementIds, userProfile.id, requestObj.reqID))

                if (metricsData) {
                    _.forEach(metricsData, (metricsObj, k) => {
                        let announcementObj = _.find(announcements, {
                            "id": metricsObj.announcementid
                        })
                        announcementObj[metricsObj.activity] = true
                    })
                }

                let transformationMap = this.__getTransformationMap(announcementBaseFieldsMap, announcementInboxFieldsMap)
                let transformedData = this.__transformResponse(announcements, transformationMap)

                return {
                    count: data.count,
                    announcements: transformedData
                }

            } catch (error) {
                console.log("Announcement - inbox - Error", error)
                return {
                    count: 0,
                    announcements: []
                }
            }
        })
    }

    

    /**
     * Get received and read status of given announcements 
     * @param  Array announcementIds 
     * @param  String userId
     * @return Object
     */
    __getMetricsForInbox(announcementIds, userId, reqID) {
        return new Promise((resolve, reject) => {
            let query = {
                query: {
                    "announcementid": announcementIds,
                    "userid": userId
                },
                limit: 10000,
                reqID: reqID
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
            let userId = await(this.__getLoggedinUserId()(requestObj))
            if (userId) {
                requestObj.body.request.userId = userId
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
                offset: this.__getOffset(requestObj.body.request.offset),
                reqID: requestObj.reqID
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
            
            let metricsData = await (this.__getOutboxMetrics(announcementIds, requestObj.reqID))

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

            let transformationMap = this.__getTransformationMap(announcementBaseFieldsMap, announcementOutboxFieldsMap)
            let transformedData = this.__transformResponse(announcements, transformationMap)

            return {
                        count: outboxData.count,
                        announcements: transformedData
                    }
        })
    }

    /**
     * Initialize announcement objects with read and received properties
     * @param  Object announcementObj
     * @return Object
     */
    __addMetricsPlaceholder(announcementObj) {
        let metrics = {}
        metrics[metricsActivityConstant.RECEIVED] = 0
        metrics[metricsActivityConstant.READ] = 0

        announcementObj.metrics = metrics

        return announcementObj
    }

    /**
     * Get received and read count of given announcements
     * @param  Array announcementIds
     * @return Object
     */
    __getOutboxMetrics(announcementIds, reqID) {
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
            this.announcementMetricsStore.getMetrics(query, reqID)
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
                let request = this.metricsModel.validateApi(requestObj.body)
                let userId = await(this.__getLoggedinUserId()(requestObj))

                if (userId) {
                    requestObj.body.request.userId = userId
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
                    let metricsData = await (this.__createMetrics(requestObj.body.request, metricsActivityConstant.RECEIVED))
                    let response = {}
                    response[metricsActivityConstant.RECEIVED] = metricsData.data
                    return response
                    
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
            let request = this.metricsModel.validateApi(requestObj.body)
            let userId = await(this.__getLoggedinUserId()(requestObj))
            if (userId) {
                requestObj.body.request.userId = userId
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
                    let metricsData = await (this.__createMetrics(requestObj.body.request, metricsActivityConstant.READ))
                    let response = {}
                    response[metricsActivityConstant.READ] = metricsData.data
                    return response
                } catch (error) {
                    throw this.customError(error)

                }
            }

        })
    }

    /**
     * Save metrics data - received, read status for a user-announcement
     * @param  {[type]} requestObj      [description]
     * @param  {[type]} metricsActivity [description]
     * @return {[type]}                 [description]
     */
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
                    'createddate': dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss:lo", true),
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

    /**
     * Check if the metrics data already exists
     * @param  {[type]} requestObj      [description]
     * @param  {[type]} metricsActivity [description]
     * @return {[type]}                 [description]
     */
    __isMetricsExist(requestObj, metricsActivity) {
        return new Promise((resolve, reject) => {
            let query = {
                query: {
                    "announcementid": requestObj.announcementId,
                    "userid": requestObj.userId,
                    "activity": metricsActivity
                },
                reqID: requestObj.reqID
            }

            this.announcementMetricsStore.findObject(query)
                .then((data) => {
                    if (!data) {
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
                let userId = await(this.__getLoggedinUserId()(requestObj))
                let status

                if (userId) {
                    status = await (this.__isAuthor()(userId, requestObj.params.announcementId))

                    if (status) {
                        return new Promise((resolve, reject) => {
                            let announcementId = requestObj.params.announcementId
                            telemetry.addObjectData(requestObj.reqID, telemetry.getObjectData(announcementId, 'announcement'))
                            let announcement = this.__getAnnouncementById(announcementId, requestObj.reqID).then((data) => {
                                                let transformationMap = this.__getTransformationMap(announcementBaseFieldsMap, announcementResendFieldsMap)
                                                let transformedData = this.__transformResponse(data, transformationMap)
                                                return {announcement: transformedData[0]}
                                            })
                                            .catch((err) => {
                                                reject(this.customError(err))
                                            })

                            resolve(announcement) 
                        })
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
        return this.__create()(requestObj)
    }

    /**
     * Get announcement by id
     * @param  String announcementId
     * @return Object                Announcement object
     */
    __getAnnouncementById(announcementId, reqID) {
        return new Promise((resolve, reject) => {
            let query = {
                query: {
                    'id': announcementId
                },
                reqID: reqID
            }
            this.announcementStore.findObject(query)
                .then((data) => {
                    if (data) {
                        _.forEach(data.data.content, (announcementObj) => {
                            this.__parseAttachments(announcementObj)
                        })

                        resolve(data.data.content)
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


    /**
     * Verify if the logged in user is the author of the particular announcement
     * @return Boolean
     */
    __isAuthor() {
      return async((userId, announcementId) => {
          if (userId && announcementId) {
              var response = await (this.__getAnnouncementById(announcementId))
              if(response){
                 return (response[0].userid === userId) ? true : false
              } else {
                return false
              }
          } else {
              return false
          }
      })
    }

    /**
     * Validate and send the allowed limit value
     * @param  Integer requestedLimit
     * @return {Integer}
     */
    __getLimit(requestedLimit) {
        let limit = requestedLimit || LIMIT_DEFAULT
        limit = limit > LIMIT_MAX ? LIMIT_MAX : limit
        return limit
    }

    /**
     * Set the default offset when not available
     * @param  {Integer} requestedOffset
     * @return {Integer}
     */
    __getOffset(requestedOffset) {
        let offset = requestedOffset || OFFSET_DEFAULT
        return offset
    }

    /**
     * Get the logged in user's suth token or the token passed in API call
     * @return String Token
     */
    __getToken(requestObj) {
        return _.get(requestObj, 'kauth.grant.access_token.token') || _.get(requestObj, "headers['x-authenticated-user-token']")
    }

    /**
     * Validates the token and fetch the userId
     * @param  String authUserToken Auth user token
     * @return Object               For a valid token return token and user id.
     */
    __getTokenDetails(authUserToken) {
        return new Promise((resolve, reject) => {
            var keyCloak_config = {
                'authServerUrl': envVariables.PORTAL_AUTH_SERVER_URL,
                'realm': envVariables.KEY_CLOAK_REALM,
                'clientId': envVariables.PORTAL_AUTH_SERVER_CLIENT,
                'public': envVariables.KEY_CLOAK_PUBLIC
            }

            var cache_config = {
                store: envVariables.sunbird_cache_store,
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
     * Get logged in user id
     * @return {[type]} [description]
     */
    __getLoggedinUserId() {
        return async((requestObj) => {
            let authUserToken = this.__getToken(requestObj)
            let tokenDetails = await (this.__getTokenDetails(authUserToken))

            if (tokenDetails) {
                return tokenDetails.userId
            } 

            return false
        })
    }
                
    /**
     * To get a user's profile data
     * @param  String authUserToken User's access token
     * @return Object               Profile data
     */
    __getUserProfile(authUserToken, reqID) {
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
                telemetry.addObjectData(reqID, telemetry.getObjectData(tokenDetails.userId, 'user'))
                // telemetry.generateApiCallLogEvent(reqID, options, 'user/v1/read/')
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

    /**
     * To create an announcement type
     * @param  Object requestObj Request object
     * @return Object            Response
     */
    createAnnouncementType(requestObj) {
        return this.__createAnnouncementType()(requestObj)
    }

    __createAnnouncementType() {
        return async((requestObj) => {
            try {
                let validation = this.announcementTypeModel.validateApi(requestObj.body)

                if (!validation.isValid) throw {
                    message: validation.error,
                    status: HttpStatus.BAD_REQUEST,
                    isCustom:true
                }

                var newAnnouncementTypeObj = await (this.__saveAnnouncementType(requestObj.body.request))
                
                return {
                    announcementType: newAnnouncementTypeObj.data
                }
            } catch (error) {
                throw this.customError(error)
            }
        })
    }

    __saveAnnouncementType(data) {
        return new Promise((resolve, reject) => {
            let announcementTypeId = uuidv1()
            if (!data) reject(this.customError({
                message: 'Invalid Request, Values are required.',
                statusCode: HttpStatus.BAD_REQUEST,
                isCustom:true
            }))

            let query = {
                values: {
                    'id': announcementTypeId,
                    'rootorgid': data.rootOrgId,
                    'name': data.name,
                    'status': data.status,
                    'createddate': dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss:lo", true),
                }
            }
            this.announcementTypeStore.createObject(query)
                .then((data) => {
                    if (data) {
                        resolve({
                            data: {
                                id: announcementTypeId
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
     * List all the announcement types for the given root org. 
     * @param  Object requestObj Request object
     * @return Object            Response object
     */
    listAnnouncementType(requestObj) {
        return this.__listAnnouncementType()(requestObj)
    }


    __listAnnouncementType() {
        return async((requestObj) => {
            try {
                let responseObj = {}
                let announcementTypes = await (this.__getAnnouncementTypes(requestObj, true))
                responseObj["announcementTypes"] = announcementTypes
                return responseObj
            } catch (error) {
                throw this.customError(error)
            }
        })
    }

    /**
     * Update announcement type for name, status
     *
     * @param   Object  requestObj  Request object
     *
     * @return  Object              Response object
     */
    updateAnnouncementType(requestObj) {
        return this.__updateAnnouncementType()(requestObj)
    }

    __updateAnnouncementType() {
        return async((requestObj) => {


            let validation = this.announcementTypeModel.validateUpdateApi(requestObj.body)

            if (!validation.isValid) throw {
                message: validation.error,
                status: HttpStatus.BAD_REQUEST,
                isCustom:true
            }

            return new Promise((resolve, reject) => {
                let newStatus = _.get(requestObj, 'body.request.status')
                let newName = _.get(requestObj, 'body.request.name')

                let query = {
                    values: {
                        id: _.get(requestObj, 'body.request.id'),
                        name: newName,
                        status: newStatus
                    },
                    reqID: requestObj.reqID
                }

                this.announcementTypeStore.updateObjectById(query)
                    .then((data) => {
                        if (data) {
                            resolve({
                                id: requestObj.params.id
                            })
                        } else {
                            throw {
                                message: 'Unable to process!',
                                status: HttpStatus.INTERNAL_SERVER_ERROR,
                                isCustom:true
                            }
                        }
                    })
                    .catch((error) => {
                        reject(this.customError(error))
                    })
                
            })
        })
    }

    /**
     * Parse attachments string to JSON object
     * @param  {[type]} announcement [description]
     * @return {[type]}              [description]
     */
    __parseAttachments(announcement) {
        let parsedAttachments = []
        _.forEach(announcement.attachments, (attachment, k) => {
            let parsedAttachment = this.__parseJSON(attachment)

            if (parsedAttachment && _.isObject(parsedAttachment)) {
                parsedAttachments.push(parsedAttachment)
            }
        })

        announcement.attachments = parsedAttachments
    }

    /**
     * Parse a json string to object
     * @param  {[type]} jsonString [description]
     * @return {[type]}            [description]
     */
    __parseJSON(jsonString) {
        try {
            return JSON.parse(jsonString)
        } catch (error) {
            return false
        }
    }

    /**
     * Get the declarative map for response transformation
     * @param  {Object}  baseMap
     * @param  {Object} addonMap
     * @return {Object}           [description]
     */
    __getTransformationMap(baseMap, addonMap = {}) {
        let transformations = _.merge({}, baseMap, addonMap)
        return {item: transformations}
    }

    /**
     * [__transformResponse description]
     * @param  {[type]} data [description]
     * @param  {[type]} map  [description]
     * @return {[type]}      [description]
     */
    __transformResponse(data, map) {
        let dataTransform = DataTransform(data, map)
        let transformedData = dataTransform.transform()

        return transformedData
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