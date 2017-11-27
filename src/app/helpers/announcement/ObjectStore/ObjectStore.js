let Joi = require('joi')
let webService = require('request')
let _ = require('lodash')
let async = require('asyncawait/async')
let await = require('asyncawait/await')

class ObjectStore {
    constructor({metrics, announcement, announcementtype } = {}) {
        /**
         * @property {class} - Metrics model instance, Which is used to validate the metrics model object.
         */
        this.metrics = metrics;
        /**
         * @property {class} - Announcement Create instance, Which is used to validate the model object.
         */
        this.announcementCreate = announcement;

        /**
         * @property {class} - Announcement type instance, Which is used to validate the announcement Type object.
         * @type {[type]}
         */
        this.announcementType = announcementtype;

        /**
         * @property {object} - Which is having map of instance of all model classes.
         */
        this.modelMap = {announcement, metrics, announcementtype}
    }

    get MODEL() {
        return this.__MODEL
    }

    createObject() {
        return new Promise((resolve, reject) => {
            reject('cannot call abstract method')
        })
    }

    findObject() {
        return new Promise((resolve, reject) => {
            reject('cannot call abstract method')
        })
    }

    getObjectById() {
        return new Promise((resolve, reject) => {
            reject('cannot call abstract method')
        })
    }

    updateObjectById() {
        return new Promise((resolve, reject) => {
            reject('cannot call abstract method')
        })
    }

    deleteObjectById() {
        return new Promise((resolve, reject) => {
            reject('cannot call abstract method')
        })
    }
}

module.exports = ObjectStore