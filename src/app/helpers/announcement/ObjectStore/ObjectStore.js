let httpService = require('./httpWrapper.js')

class ObjectStore {
  constructor ({metrics, announcement, announcementtype, httpWrapper } = {}) {
    /**
     * @property {Class} - Metrics model instance, Which is used to validate the metrics model object.
     */
    this.metrics = metrics

    /**
     * @property {Class} - Announcement Create instance, Which is used to validate the model object.
     */
    this.announcementCreate = announcement

    /**
     * @property {Class} - Announcement type instance, Which is used to validate the announcement Type object.
     */
    this.announcementType = announcementtype

    /**
     * @property {Object} - Which is having map of instance of all model classes.
     */
    this.modelMap = {announcement, metrics, announcementtype }

    /**
     * @property {Class} - Whichc is used to make a http service calls
     */
    this.httpService = httpWrapper || httpService

    /**
     * @property {Object} - Which is used to map the table names.
     */
    this.model = {
      ANNOUNCEMENT: 'announcement',
      METRICS: 'metrics',
      ANNOUNCEMENTTYPE: 'announcementtype'
    } || {}
  }

  get MODEL () {
    return this.model
  }

    /**
     * Abstract method, Child class should implement.
     */
  createObject () {
    return new Promise((resolve, reject) => {
      reject('cannot call abstract method')
    })
  }

    /**
     * Abstract method, Child class should implement.
     * @return {[type]} [description]
     */
  findObject () {
    return new Promise((resolve, reject) => {
      reject('cannot call abstract method')
    })
  }

    /**
     * Abstract method,Child class should implement to get the object by identifier.
     * @return {[type]} [description]
     */
  getObjectById () {
    return new Promise((resolve, reject) => {
      reject('cannot call abstract method')
    })
  }

    /**
     * Abstract method, Child class should implement to update the object by identifier.
     * @return {[type]} [description]
     */
  updateObjectById () {
    return new Promise((resolve, reject) => {
      reject('cannot call abstract method')
    })
  }

    /**
     * Abstract method, Child class should implement to delete the object by identifier.
     * @return {[type]} [description]
     */
  deleteObjectById () {
    return new Promise((resolve, reject) => {
      reject('cannot call abstract method')
    })
  }
}

module.exports = ObjectStore
