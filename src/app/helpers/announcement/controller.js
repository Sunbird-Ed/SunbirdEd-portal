let AnnouncementTypeModel = require('./model/AnnouncementTypeModel.js')
//let AttachmentModel = require('./model/AttachmentModel.js')
let MetricsModel = require('./model/MetricsModel.js')
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


class AnnouncementController {

  constructor({metrics, announcement, announcementtype } = {}) {
    this.metrics = metrics;
    this.announcementCreate = announcement;
    this.announcementType = announcementtype;


    let modelConstant = {
      'ANNOUNCEMENT': 'announcement',
      'ANNOUNCEMENTTYPE': 'announcementtype',
      'ATTACHMENT': 'attachment',
      'METRICS': 'metrics'
    }

    let statusConstant = {
        'ACTIVE': 'active',
        'CANCELLED': 'cancelled',
        'DRAFT': 'draft'
    }

    let metricsActivityConstant = {
        'READ': 'read',
        'RECEIVED': 'received'
    }
    this.objectStoreRest = new ObjectStoreRest({
        metrics: this.metrics,
        announcement: this.announcementCreate,
        announcementtype: this.announcementType
    })
    this.statusConstant = statusConstant
    this.metricsActivityConstant = metricsActivityConstant
  }

  /**
   * Public method to accept create announcement call
   *
   * @param   {[type]}  requestObj  [description]
   *
   * @return  {[type]}              [description]
   */
  create(requestObj) {
    return this.__create()(requestObj)
  }

  __create() {
      return async((requestObj) => {
          const CREATE_ROLE = 'ANNOUNCEMENT_SENDER'
          let validation = this.announcementCreate.validateApi(requestObj.body)
          if (!validation.isValid) throw {
              msg: validation.error,
              statusCode: HttpStatus.BAD_REQUEST
          }
          let authUserToken = _.get(requestObj, 'kauth.grant.access_token.token') || _.get(requestObj, "headers['x-authenticated-user-token']")
          try {
              var newAnnouncementObj = await (this.__createAnnouncement(requestObj.body.request))
          } catch (error) {
              throw {
                  msg: 'unable to process the request!',
                  statusCode: HttpStatus.INTERNAL_SERVER_ERROR
              }
          }
          try {
              if (newAnnouncementObj.data.id) {
                  requestObj.body.request.announcementId = newAnnouncementObj.data.id
                  this.createNotification(requestObj)
                  return {
                      announcement: newAnnouncementObj.data
                  }
              }
          } catch (e) {
              return {
                  announcement: newAnnouncementObj.data
              }
          }
      })
  }
  /**
   * Get permissions list of the given user
   *
   * @param   {[type]}  data  [description]
   *
   * @return  {[type]}        [description]
   */
  __getUserProfile(data, authUserToken) {
    return new Promise((resolve, reject) => {
      if (_.isEmpty(data.id)) {
        reject('user id is required!')
      }

      let options = {
        method: 'GET',
        uri: envVariables.DATASERVICE_URL + 'user/v1/read/' + data.id,
        headers: this.getRequestHeader({ xAuthUserToken: authUserToken })
      }
      this.httpService(options).then((data) => { 
        data.body = JSON.parse(data.body)  
        resolve(_.get(data, 'body.result.response'))
      })

      .catch((error) => {
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

  __createAnnouncement(data) {
    return new Promise((resolve, reject) => {
      let announcementId = uuidv1()
      if (!data) reject({ msg: 'invalid request' })

        if(!data.description) {data.description = ''}
        if(!data.links) {data.links = []}
        if (!data.attachments) {data.attachments = []}


      let query = {
        table: 'announcement',
        values: {
          'id': announcementId,
          'sourceid': data.sourceId,
          'createddate': dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss:lo"),
          'userid': data.createdBy,
          'details': {
            'title': data.title,
            'type': data.type,
            'description': data.description,
            'from':data.from,
          },
          'target': data.target,
          'links': data.links,
          'status': this.statusConstant.ACTIVE,
          'attachments': data.attachments
        }
      }

      this.objectStoreRest.createObject(query)
        .then((data) => {
          if (!_.isObject(data)) {
            reject({ msg: 'unable to create announcement' })
          } else {
            resolve({ data: { id: announcementId } })
          }
        })
        .catch((error) => {
          reject({ msg: 'unable to create announcement' })
        })
    })
  }

  /**
   * Call the notification service to send notifications about the announcement.
   *
   * @return  {[type]}  [description]
   */
  createNotification(data) {
     return this.__createAnnouncementNotification()(data);
  }

  __createAnnouncementNotification() {
        return async((data) => {
            let requestObj = {"to": "", "type": "fcm", "data": {"notificationpayload": {"msgid": data.body.request.announcementId, "title": data.body.request.title, "msg": data.body.request.description, "icon": "", "time": dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss:lo"), "validity": "-1", "actionid": "1", "actiondata": "", "dispbehavior": "stack"} } }
            let options = {"method": "POST", "uri": envVariables.DATASERVICE_URL + "data/v1/notification/send", "body": {"request": requestObj }, "json": true }
            let authUserToken = _.get(data, 'kauth.grant.access_token.token') || data.headers['x-authenticated-user-token']
            options.headers =this.getRequestHeader({ xAuthUserToken: authUserToken })
            var targetIds = []
            if (data.body.request.target) {
                _.forIn(data.body.request.target, (value, key) => {
                    if (_.isObject(value)) {
                        _.forEach(value.ids, (v, k) => {
                            targetIds.push(v)
                        });
                    }
                });
            }
            this.forEachPromise(targetIds, this.sendNotification, options, this).then(() => {
                // console.log('done')
            });
        })

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
        table: 'announcement',
        query: {
          'id': requestObj.params.id
        }
      }

      this.objectStoreRest.findObject(query)
        .then((data) => {
          if (!_.isObject(data)) {
            reject({ msg: 'unable to fetch announcement', statusCode: HttpStatus.INTERNAL_SERVER_ERROR })
          } else {
            _.forEach(data.data.content, (announcementObj) => {
              if (_.isString(announcementObj.target)) announcementObj.target = JSON.parse(announcementObj.target)
            })
            resolve(_.get(data.data, 'content[0]'))
          }
        })
        .catch((error) => {
          reject({ msg: 'unable to fetch announcement', statusCode: HttpStatus.INTERNAL_SERVER_ERROR })
        })
    })
  }

  getDefinitions(requestObj){
    return this.__getDefinitions()(requestObj)
  }
  __getDefinitions() {
      return async((requestObj) => {
          let responseObj = {};
          if (requestObj.body.request.definitions) {
              if (requestObj.body.request.definitions.includes('announcementtypes')) {
                  let announcementTypes = await (this.__getAnnouncementTypes(requestObj));
                  responseObj["announcementtypes"] = announcementTypes;
              }
              if (requestObj.body.request.definitions.includes('senderlist')) {
                  let senderlist = await (this.__getSenderList()(requestObj));
                  responseObj["senderlist"]= senderlist;
              }
              return responseObj;
          }else{
             return { msg: 'unable to fetch ', statusCode: HttpStatus.INTERNAL_SERVER_ERROR }
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
        table: 'announcement',
        query: {
          'rootorgid': _.get(requestObj, 'body.request.rootorgid')
        }
      }
      this.objectStoreRest.findObject(query)
        .then((data) => {
          if (!_.isObject(data)) {
            resolve({ msg: 'unable to fetch announcement types', statusCode: HttpStatus.INTERNAL_SERVER_ERROR })
          } else {
            resolve(data.data)
          }
        })
        .catch((error) => {
          reject({ msg: 'unable to fetch announcement types', statusCode: HttpStatus.INTERNAL_SERVER_ERROR })
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
                table: 'announcement',
                values: {
                    id: _.get(requestObj, 'body.request.announcenmentid'),
                    status: this.statusConstant.CANCELLED
                }
            }
            let authUserToken = _.get(requestObj, 'kauth.grant.access_token.token') || _.get(requestObj, "headers['x-authenticated-user-token']")
            let tokenDetails = await(this.__getTokenDetails(authUserToken));
            let status;
            if (tokenDetails) {
                status = await (this.__checkPermission()(requestObj, tokenDetails.userId, _.get(requestObj, 'body.request.announcenmentid')));
            }else{
                return {msg: 'UNAUTHORIZE_USER', status: HttpStatus.UNAUTHORIZED }
            }
            return new Promise((resolve, reject) => {
                if (status) {
                    this.objectStoreRest.updateObjectById(query)
                        .then((data) => {
                            if (!_.isObject(data)) {
                                reject({
                                    msg: 'unable to cancel the announcement',
                                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR
                                })
                            } else {
                                resolve({
                                    id: requestObj.params.announcementId,
                                    status: this.statusConstant.CANCELLED
                                })
                            }
                        })
                        .catch((error) => {
                            reject({
                                msg: 'unable to cancel the announcement',
                                statusCode: HttpStatus.INTERNAL_SERVER_ERROR
                            })
                        })
                } else {
                    reject({
                        msg: 'UNAUTHORIZE_USER',
                        statusCode: HttpStatus.UNAUTHORIZED
                    })
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

            let tokenDetails = await(this.__getTokenDetails(authUserToken));
            if(tokenDetails){
              requestObj.body.request.userId = tokenDetails.userId
            }

            let userProfile = await(this.__getUserProfile({ id: _.get(requestObj, 'body.request.userId') }, authUserToken))

            // Parse the list of Organisations (User > Orgs) from the response
            let targetOrganisations = []
            _.forEach(userProfile.organisations, function(userOrg) {
                targetOrganisations.push(userOrg.organisationId)
            })
            if (_.isEmpty(targetOrganisations)) return { count:0, announcements: [] }

            // Parse the list of Geolocations (Orgs > Geolocations) from the response
            let targetGeolocations = []
            try {
                let geoData = await (this.__getGeolocations(targetOrganisations, authUserToken))
                //handle emty target list
                _.forEach(geoData.content, function(geo) {
                    if (geo.locationId) {targetGeolocations.push(geo.locationId)} 
                })

                if (_.isEmpty(targetGeolocations)) return { count:0, announcements: [] }
            } catch(error) {
                return { count:0, announcements: [] }
            }

            // Query announcements where target is listed Geolocations
            let query = {
                table: 'announcement',
                query: {
                    "target.geo.ids": targetGeolocations,
                    "status": this.statusConstant.ACTIVE
                },
                sort_by: {
                    "createddate":"desc"
                },
                limit: requestObj.body.request.limit
            }

            try {
                let data = await (new Promise((resolve, reject) => {
                    this.objectStoreRest.findObject(query)
                    .then((data) => {
                        if (!_.isObject(data)) {
                            reject({ msg: 'unable to fetch announcement inbox', statusCode: HttpStatus.INTERNAL_SERVER_ERROR })
                        } else {
                            resolve(data.data)
                        }
                    })
                    .catch((error) => {
                        reject({ msg: 'unable to fetch announcement inbox', statusCode: HttpStatus.INTERNAL_SERVER_ERROR })
                    })
                }))

                let announcements = []
                if (_.size(data) <= 0) {
                    return { count:0, announcements: [] }
                } else {
                    announcements = data.content
                }

                //Get read and received status and append to response
                let announcementIds = []
                _.forEach(announcements, (announcement, k) => {
                    announcementIds.push(announcement.id)
                    announcement[this.metricsActivityConstant.READ] = false
                    announcement[this.metricsActivityConstant.RECEIVED] = false
                })
                let metricsData = await(this.__getMetricsForInbox(announcementIds, userProfile.id))

                if (metricsData) {
                    _.forEach(metricsData, (metricsObj, k) => {
                        let announcementObj = _.find(announcements, {"id": metricsObj.announcementid})
                        announcementObj[metricsObj.activity] = true
                    })
                }

                return  {count:_.size(announcements), announcements: announcements}

            } catch(error) {
                throw { msg: 'unable to process your request', statusCode: HttpStatus.INTERNAL_SERVER_ERROR }
            }
        })
    }

    __getGeolocations(orgIds, authUserToken) {
        return new Promise((resolve, reject) => {
            let requestObj = {
                                "filters": {
                                    "id": orgIds
                                },
                                "fields": ["id","locationId"]
                            }

            let options = {"method": "POST", "uri": envVariables.DATASERVICE_URL + "org/v1/search", "body": {"request": requestObj }, "json": true }
            options.headers =this.getRequestHeader({ xAuthUserToken: authUserToken })

            try {
                let data = new Promise((resolve, reject) => {
                    this.httpService(options).then((data) => {
                        resolve(data.body.result.response)
                    }).catch((error) => {
                        reject(error)
                    })
                })
                resolve(data)
            } catch(error) {
                reject(false)
            }

        })
    }

    __getMetricsForInbox(announcementIds, userId) {
        return new Promise((resolve, reject) => {
            let query = {
                table: 'metrics',
                query: {
                    "announcementid" : announcementIds,
                    "userid": userId
                },
                limit: 10000
            }

            this.objectStoreRest.findObject(query)
            .then((data) => {
                if (!_.isObject(data)) {
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
        return new Promise((resolve, reject) => {

            // validate request
            let authUserToken = _.get(requestObj, 'kauth.grant.access_token.token') || _.get(requestObj, "headers['x-authenticated-user-token']")
            let tokenDetails = await (this.__getTokenDetails(authUserToken));
            if (tokenDetails) {
                requestObj.body.request.userId = tokenDetails.userId
            }else{
              reject({msg:'UNAUTHORIZE_USER', statusCode: HttpStatus.UNAUTHORIZED})
            }

            let request = this.__validateOutboxRequest(requestObj.body)
            if (!request.isValid) throw { msg: request.error, statusCode: HttpStatus.BAD_REQUEST }

            // build query
            let query = {
                table: 'announcement',
                query: {
                    'userid': _.get(requestObj, 'body.request.userId')
                },
                sort_by: {
                    "createddate":"desc"
                }
            }
            let metrics_clone = undefined;

            // execute query and process response
            this.objectStoreRest.findObject(query)
            .then((data) => {
                if (!_.isObject(data)) {
                    reject({ msg: 'unable to fetch sent announcements', statusCode: HttpStatus.INTERNAL_SERVER_ERROR })
                } else {
                    let response = {count: _.size(data.data), announcements: data.data }
                    resolve(response)
                }
            })
            .catch((error) => {
                reject({ msg: 'unable to fetch sent announcements', statusCode: HttpStatus.INTERNAL_SERVER_ERROR })
            })
        })
    }

  /**
   * Validate the incoming request for creating an announcement
   *
   * @param   {[type]}  requestObj  [description]
   *
   * @return  {[type]}              [description]
   */
  __validateOutboxRequest(requestObj) {
    let validation = Joi.validate(requestObj, Joi.object().keys({
      "request": Joi.object().keys({
        'userId': Joi.string().required()
      }).required()
    }), { abortEarly: false })

    if (validation.error != null) {
      let messages = []
      _.forEach(validation.error.details, (error, index) => {
        messages.push({ field: error.path[0], description: error.message })
      })
      return { error: messages, isValid: false }
    }
    return { isValid: true }
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
          try {
              return await (new Promise((resolve, reject) => {
                  this.__getUserProfile({
                          id: _.get(requestObj, 'body.request.userid')
                      }, authUserToken)
                      .then((data) => {
                          if (!_.isObject(data)) {
                              reject({ msg: 'unable to fetch senderlist', statusCode: HttpStatus.INTERNAL_SERVER_ERROR })
                          } else {
                              userData[data.id] = data.firstName + " " + data.lastName
                              resolve(userData)
                          }
                      })
                      .catch((error) => {
                          reject(error)
                      })
              }))
          } catch (e) {
              throw {msg: 'Unable to fetch the senderlist', statusCode: HttpStatus.INTERNAL_SERVER_ERROR } }
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
                if (tokenDetails) {
                    requestObj.body.request.userId = tokenDetails.userId
                } else {
                    return {
                        'msg': 'UNAUTHORIZE_USER',
                        statusCode: HttpStatus.UNAUTHORIZED
                    }
                }
                // validate request
                let request = this.metrics.validateApi(requestObj.body)
                if (!request.isValid) throw {
                    msg: request.error,
                    statusCode: HttpStatus.BAD_REQUEST
                }
                let metricsExists = false
                metricsExists = await (this.__isMetricsExist(requestObj.body.request, this.metricsActivityConstant.RECEIVED))
                if (metricsExists) {
                    return {
                        'msg': 'Entry exists',
                        statusCode: HttpStatus.OK
                    }
                } else {
                    var metricsData = await (this.__createMetrics(requestObj.body.request, this.metricsActivityConstant.RECEIVED))
                    return {
                        metrics: metricsData.data
                    }
                }
            } catch (error) {
                throw { msg: 'unable to update status!', statusCode: HttpStatus.INTERNAL_SERVER_ERROR }
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
            let tokenDetails = await(this.__getTokenDetails(authUserToken));
            if(tokenDetails){
              requestObj.body.request.userId = tokenDetails.userId
            }else{
              return {'msg':'UNAUTHORIZE_USER', statusCode:HttpStatus.UNAUTHORIZED}
            }
            let request = this.metrics.validateApi(requestObj.body)
            if (!request.isValid) throw { msg: request.error, statusCode: HttpStatus.BAD_REQUEST }

            let metricsExists = false
            try {
                metricsExists = await (this.__isMetricsExist(requestObj.body.request, this.metricsActivityConstant.READ))
            } catch (error) {
                // throw { msg: 'unable to update status!', statusCode: HttpStatus.INTERNAL_SERVER_ERROR }
            }


            if (metricsExists) {
                return {'msg':'Entry exists', statusCode:HttpStatus.OK}
            } else {
                try {
                    var metricsData = await (this.__createMetrics(requestObj.body.request, this.metricsActivityConstant.READ))
                    return {metrics: metricsData.data}
                } catch (error) {
                    throw { msg: 'unable to update status!', statusCode: HttpStatus.INTERNAL_SERVER_ERROR }
                }
            }
            
        })      
    }    

    // /**
    //  * Validate the incoming request for creating a metrics
    //  *
    //  * @param   {[type]}  requestObj  [description]
    //  *
    //  * @return  {[type]}              [description]
    //  */
    // __validateMetricsRequest(requestObj) {
    //     let validation = Joi.validate(requestObj, Joi.object().keys({
    //         "request": Joi.object().keys({
    //             'userId': Joi.string().required(),
    //             'announcementId': Joi.string().required(),
    //             'channel': Joi.string().required()
    //         }).required()
    //     }), { abortEarly: false })

    //     if (validation.error != null) {
    //         let messages = []
    //         _.forEach(validation.error.details, (error, index) => {
    //             messages.push({ field: error.path[0], description: error.message })
    //         })
    //         return { error: messages, isValid: false }
    //     }
    //     return { isValid: true }
    // }


    __createMetrics(requestObj, metricsActivity) {
        return new Promise((resolve, reject) => {
            // build query
            let metricsId = uuidv1()
            let query = {
                table: 'metrics',
                values: {
                    'id': metricsId,
                    'userid': requestObj.userId,
                    'announcementid': requestObj.announcementId,
                    'channel': requestObj.channel,
                    'activity': metricsActivity,
                    'createddate': dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss:lo"),
                }
            }

            this.objectStoreRest.createObject(query)
            .then((data) => {
                if (!_.isObject(data)) {
                    reject({ msg: 'unable to update metrics' })
                } else {
                    resolve({ data: { id: metricsId } })
                }
            })
            .catch((error) => {
                reject({ msg: 'unable to update metrics' })
            })

        })
    }

    __isMetricsExist(requestObj, metricsActivity) {
        return new Promise((resolve, reject) => {
            let query = {
                table: 'metrics',
                query: {
                    "announcementid" : requestObj.announcementId,
                    "userid": requestObj.userId,
                    "activity": metricsActivity
                }            }

            this.objectStoreRest.findObject(query)
            .then((data) => {
                if (!_.isObject(data)) {
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
            let authUserToken = _.get(requestObj, 'kauth.grant.access_token.token') || _.get(requestObj, "headers['x-authenticated-user-token']")
            let tokenDetails = await (this.__getTokenDetails(authUserToken));
            let status;
            if (tokenDetails) {
                status = await (this.__checkPermission()(requestObj, tokenDetails.userId, requestObj.params.announcementId));
                if (status) {
                    return this.__getAnnouncementById(requestObj)
                }else{
                  return {msg:'UNAUTHORIZE_USER', statusCode:HttpStatus.UNAUTHORIZED}
                }
            } else {
                return {
                    msg: 'UNAUTHORIZE_USER',
                    status: HttpStatus.UNAUTHORIZED
                }
            }
        })
    }

    /**
     * Resend the edited announcement
     * @param  {[type]} requestObj [description]
     * @return {[type]}            [description]
     */
    resend(requestObj) {
        // TODO: duplicate file data??

        return this.__create()(requestObj)
    }





  httpService(options) {
      return new Promise((resolve, reject) => {
          if (!options) reject('options required!')
          options.headers = options.headers || this.getRequestHeader();
          webService(options, (error, response, body) => {
              if (error || response.statusCode >= 400) {
                  reject(error)
              } else {
                  resolve({response, body }) }
          })
      })
  }

  getRequestHeader(opt) {
    return {
      'x-device-id': 'x-device-id',
      'ts': dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss:lo"),
      'x-consumer-id': envVariables.PORTAL_API_AUTH_TOKEN,
      'content-type': 'application/json',
      'accept': 'application/json',
      'x-authenticated-user-token': opt.xAuthUserToken || '',
      'Authorization': 'Bearer ' + envVariables.PORTAL_API_AUTH_TOKEN
    }
  }

  forEachPromise(items, fn, options, context) {
    return items.reduce(function (promise, item) {
        return promise.then(function () {
            return fn(item, options, context);
        });
    }, Promise.resolve());
  }

  sendNotification(item, options, context) {
      options.body.request.to = item;
      return new Promise((resolve, reject) => {
          context.httpService(options).then((data) => {
            resolve(data);
          }).catch((error) => {
              reject(error);
          })
      });
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
 }

module.exports = AnnouncementController
