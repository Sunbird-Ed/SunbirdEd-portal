class ObjectStore {
  constructor ({ model, service } = {}) {
    /**
     * @property {class} - Defines the model instance ex: MetricsModel, AnnouncementModel
     */
    this.model = model

    /**
     * @property {class} - Defines the service which is used to invoke http calls ex: Httpservice, casandra service.
     */
    this.service = service
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
