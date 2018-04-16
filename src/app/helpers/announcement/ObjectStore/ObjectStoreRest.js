let _ = require('lodash')
let async = require('asyncawait/async')
let await = require('asyncawait/await')
let ObjectStore = require('./ObjectStore.js')
let envVariables = require('../../environmentVariablesHelper.js')
let AppError = require('../services/ErrorInterface.js')
let HttpStatus = require('http-status-codes')
let telemetry = require('./../telemetry/telemetryHelper')

class ObjectStoreRest extends ObjectStore {

    /**
     * Create Object store instance.
     * Call can instantiate the ObjectStore as follows
     *
     * let ObjectStore = new ObjectStoreRest({model:MetricsModel, service:httpService})
     */

    constructor({model, service } = {}) {
        super({model:model, service: service}) 
        /**
         * @property {class} - Defines the model instance ex: MetricsModel, AnnouncementModel
         */
        this.model = model;

        /**
         * @property {class} - Defines the service which is used to invoke http calls ex: Httpservice, casandra service.
         */
        this.service = service;
    }

    /**
     * Which is used to create a announcemet.
     * @param  {object} data        - Query object which is used to interact with casandra/elastic search.
     * @param  {String} reqID       - Request ID for generate telemetry
     * @return {object}             - Response object.
     */
    createObject(data, reqID) {
        return this.__createObject()(data, reqID)
    }

    __createObject() {
        return async((data, reqID) => {
            try {
                let validation = await (this.model.validateModel(data.values))
                if (!validation.isValid) throw {
                    message: validation.error,
                    status: HttpStatus.BAD_REQUEST,
                    isCustom:true
                }
                let options = {
                    method: 'POST',
                    uri: envVariables.DATASERVICE_URL + 'data/v1/object/create',
                    body: {
                        request: {
                            'entityName': this.model.table,
                            'indexed': true,
                            'payload': data.values
                        }
                    },
                    json: true
                }
                console.log("Announcement - create object - Request", JSON.stringify(options))

                //Generate api call event
                telemetry.generateApiCallLogEvent(reqID, options, 'data/v1/object/create')
                let result = await (this.service.call(options))

                console.log("Announcement - create object - Response", result)
                return {
                    data: _.get(result, 'body.result'),
                }
            } catch (error) {
                console.log("Announcement - create object - Error", error)
                throw error
            }
        })
    }

    /**
     * Which is used to find a model from the casandra/elastic search.
     * @param  {Object} data       - Query object which is need to interact with casandra/elastic search.
     *
     * @return {Object}             - Response object.
     */
    findObject(data) {
        return this.__findObject()(data)
    }

    __findObject() {
            return async((data) => {
                try {
                    let options = {
                        method: 'POST',
                        uri: envVariables.DATASERVICE_URL + 'data/v1/object/search',
                        body: {
                            request: {
                                'filters': data.query,
                                'entityName': this.model.table,
                                "facets": data.facets,
                                "limit": data.limit,
                                "offset": data.offset,
                                "sort_by": data.sort_by
                            }
                        },
                        json: true
                    }
                    options.body.request = _.pickBy(options.body.request, _.identity); // Removes all falsey values
                    console.log("Announcement - find object - Request", JSON.stringify(options))

                    telemetry.generateApiCallLogEvent(data.reqID, options, 'data/v1/object/search')
                    let result = await (this.service.call(options))

                    console.log("Announcement - find object - Response", result)
                    return _.get(result, 'body.result.response.count') > 0 ? {
                        data: _.get(result, 'body.result.response')
                    } : {
                        data: []
                    }
                } catch (error) {
                    console.log("Announcement - find object - Error", error)
                    throw error
                }
            })
        }
        /**
         * Which is used to update the object in casandra/elastic search based on the identifier.
         * @param  {Object} data  - Query object search.
         * @return {Object}       - Response object.
         */
    updateObjectById(data) {
        return this.__updateObjectById()(data)
    }

    __updateObjectById() {
        return async((data) => {
            try {
                if (!data.values) throw {
                    message: 'Values are required!.',
                    status: HttpStatus.BAD_REQUEST,
                    isCustom:true
                }
                if (!data.values.id) throw {
                    message: 'Identifier is required!.',
                    status: HttpStatus.BAD_REQUEST,
                    isCustom:true
                }
                let options = {
                    method: 'POST',
                    uri: envVariables.DATASERVICE_URL + 'data/v1/object/update',
                    body: {
                        request: {
                            'entityName':this.model.table,
                            'indexed': true,
                            'payload': data.values
                        }
                    },
                    json: true
                }

                console.log("Announcement - update object - Request", JSON.stringify(options))
                telemetry.generateApiCallLogEvent(data.reqID, options, 'data/v1/object/update')
                let result = await (this.service.call(options))

                console.log("Announcement - find object - Response", result)
                return {
                    data: result
                }
            } catch (error) {
                console.log("Announcement - find object - Error", error)
                throw error
            }
        })
    }

    /**
     * To fetch metrics data from elastic search.
     * @param  {Object} query       - Query object which is need to interact with elastic search.
     * @param {String} reqID        - Request ID to generate telemetry
     * @return {Object}             - Response object.
     */
    getMetrics(query, reqID) {
        return this.__getMetrics()(query, reqID)
    }

    __getMetrics() {
        return async((query, reqID) => {
            try {
                let options = {
                    method: 'POST',
                    uri: envVariables.DATASERVICE_URL + 'data/v1/object/metrics',
                    body: {
                        request: {
                            "entityName": this.model.table,
                            "rawQuery": query
                        }
                    },
                    json: true,
                }
                options.body.request = _.pickBy(options.body.request, _.identity); // Removes all falsey values

                console.log("Announcement - get metrics - Request", JSON.stringify(options))
                telemetry.generateApiCallLogEvent(reqID, options, 'data/v1/object/metrics')
                
                let result = await (this.service.call(options))

                console.log("Announcement - get metrics - Response", result)
                let response = _.get(result, 'body.responseCode') === 'OK' ? {
                                        data: _.get(result, 'body.result.response')
                                    } : false

                let metricsData = []

                if (response && response.data.aggregations.announcementid.buckets) {
                    let responseBuckets = response.data.aggregations.announcementid.buckets

                    _.forEach(responseBuckets, (responseBucket, k) => {
                        let metricsDataUnit = {}
                        metricsDataUnit['announcementid'] = responseBucket.key

                        _.forEach(responseBucket.activity.buckets, (activityData, k) => {
                            metricsDataUnit[activityData.key] = activityData.doc_count
                        })

                        metricsData.push(metricsDataUnit)

                    })
                }

                return metricsData
            } catch (error) {
                console.log("Announcement - get metrics - Error", error)
                throw error
            }
        })
    }
}

module.exports = ObjectStoreRest