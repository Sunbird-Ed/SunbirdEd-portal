let _ = require('lodash')
let async = require('asyncawait/async')
let await = require('asyncawait/await')
let ObjectStore = require('./ObjectStore.js')
let envVariables = require('../../environmentVariablesHelper.js')
let AppError = require('../services/ErrorInterface.js')
let HttpStatus = require('http-status-codes')

class ObjectStoreRest extends ObjectStore {

    /**
     * Create Object store instance.
     * Call can instantiate the ObjectStore as follows
     *
     * let ObjectStore = new ObjectStoreRest({metrics:metricsModelInst, announcement: announcmentModelInst, announcementtype: announcmentTypeModelInst, httpWrapper:httpWrapperInstance})
     */

    constructor({model, service } = {}) {
        super() 
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
     * @param  {Boolean} indexStore - It defines weather object should create in elastic search or not.
     *                                If indexStore is FALSE then Object will not create in the elastic search.
     * @return {object}             - Response object.
     */
    createObject(data, indexStore) {
        return this.__createObject()(data, indexStore)
    }

    __createObject() {
        return async((data, indexStore) => {
            try {
                let validation = await (this.model.validateModel(data.values))
                if (!validation.isValid) throw {
                    message: 'Invalid model request!',
                    status: HttpStatus.BAD_REQUEST
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
                if (indexStore == false) {
                    options.body.request = _.omit(options.body.request, ['documentName']);
                }
                let result = await (this.service.call(options))
                return {
                    data: _.get(result, 'body.result'),
                }
            } catch (error) {
                throw new AppError({
                    message: error.message || 'Unable to create!',
                    status: error.status || HttpStatus.INTERNAL_SERVER_ERROR
                })
            }
        })
    }

    /**
     * Which is used to find a model from the casandra/elastic search.
     * @param  {Object} data       - Query object which is need to interact with casandra/elastic search.
     * @param  {Boolean} indexStore - It defines wheather object should create in elastic search or not.
     *                                If indexStore is FALSE then Object will not create in the elastic search.
     * @return {Object}             - Response object.
     */
    findObject(data, indexStore) {
        return this.__findObject()(data, indexStore)
    }

    __findObject() {
            return async((data, indexStore) => {
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
                                "sort_by": data.sort_by
                            }
                        },
                        json: true
                    }
                    options.body.request = _.pickBy(options.body.request, _.identity); // Removes all falsey values
                    if (indexStore == false) {
                        options.body.request = _.omit(options.body.request, ['documentName']);
                        options.body.request.tableName = this.model.table;
                    }
                    let result = await (this.service.call(options))
                    return _.get(result, 'body.result.response.count') > 0 ? {
                        data: _.get(result, 'body.result.response')
                    } : {
                        data: []
                    }
                } catch (error) {
                    throw new AppError({
                        message: error.message || 'Unable to fetch!',
                        status: error.status || HttpStatus.INTERNAL_SERVER_ERROR
                    })
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
                    status: HttpStatus.BAD_REQUEST
                }
                if (!data.values.id) throw {
                    message: 'Identifier is required!.',
                    status: HttpStatus.BAD_REQUEST
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
                let result = await (this.service.call(options))
                return {
                    data: result
                }
            } catch (error) {
                throw new AppError({
                    message: error.message || 'Unable to update!',
                    status: error.status || HttpStatus.INTERNAL_SERVER_ERROR
                })
            }
        })
    }
}

module.exports = ObjectStoreRest