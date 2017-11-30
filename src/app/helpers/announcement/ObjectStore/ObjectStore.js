class ObjectStore {
  constructor () {}

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
