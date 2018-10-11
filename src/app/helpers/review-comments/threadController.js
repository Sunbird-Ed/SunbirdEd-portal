const _ = require('lodash')
let async = require('asyncawait/async')
let await = require('asyncawait/await') //eslint-disable-line

class ThreadController {
  constructor({   
  }) {
    /**
     * @property {instance} httpService - Instance of httpservice which is used to make a http service call
     */
   
  }

  getThreads(requestObj) {
    return this.__getThreads()(requestObj)
  }

  __getThreads(requestObj) {
    return async ((requestObj) => {
          return new Promise((resolve, reject) => {
            resolve({
              'contentId': 'do_112584109936099328189',
              'contentVer': '1538720793170',
              'contentType': 'ecml',
              'stageId': 'eelk12hj45',
              'comments': [{
                'userId': 'd5efd1ab-3cad-4034-8143-32c480f5cc9e',
                'userName': 'Sourav Dey',
                'userImage': 'https://dev.open-sunbird.org/assets/images/sunbird_logo.png',
                'message': 'Cannot see the content clearly on desktop. Please check the dimensions',
                'createdOn': '2018-10-03 13:33:35:868+0000'
              },
              {
                'userId': 'd5efd1ab-3cad-4034-8143-32c480f5cc9e',
                'userName': 'Gourav More',
                'userImage': 'https://dev.open-sunbird.org/assets/images/sunbird_logo.png',
                'message': 'The image is distorted. Upload a bigger resolution image.',
                'createdOn': '2018-10-03 13:33:35:868+0000'
              },
              {
                'userId': 'd5efd1ab-3cad-4034-8143-32c480f5cc9e',
                'userName': 'Vivek Kasture',
                'userImage': 'https://dev.open-sunbird.org/assets/images/sunbird_logo.png',
                'message': 'Inapropiate tags such as Resource type and tags',
                'createdOn': '2018-10-03 13:33:35:868+0000'
              }
              ]
            })
          })
    })
  }

  createThread(requestObj) {
    return this.__createThread()(requestObj)
  }

  __createThread(requestObj) {
    return async ((requestObj) => {
          return new Promise((resolve, reject) => {
            resolve({
              id: '1'
            })
          })
    })
  }

  /**
   * Which is used to create a custom error object
   * @param  {Object} error  - Error object it should contain message and status attribute
   *                           For example error = {message:'Invalid request object', status:'400'}
   * @return {Object}        - Error object
   */
  customError(error) {
    console.log("419 error ", error)
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
module.exports = ThreadController
