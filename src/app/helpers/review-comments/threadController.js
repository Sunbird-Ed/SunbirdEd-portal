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
                'comments': [{
                  "postId": "91176a19-8eae-426b-8750-418742ccf014",
                  "threadId": "23d2cfa0-d2d7-11e8-b535-8794514fb191",
                  "body": "comment for stage eelk12hj45",
                  "createdOn": "2018-10-18T16:32:07.148Z",
                  "userId": "NCF",
                  "tag": "do_112584109936099328189_1_ecml",
                  "userInfo": {
                      "logo": "https://dev.open-sunbird.org/assets/images/sunbird_logo.png",
                      "name": "sham"
                  },
                  "stageId": "eelk12hj45"
              },
              {
                  "postId": "23512478-1b84-4e7e-b94f-2a3bc328d7a8",
                  "threadId": "23d2cfa0-d2d7-11e8-b535-8794514fb191",
                  "body": "sample comments for stage kelkghhj35",
                  "createdOn": "2018-10-18T16:32:06.330Z",
                  "userId": "NCF",
                  "tag": "do_112584109936099328189_1_ecml",
                  "userInfo": {
                      "logo": "https://dev.open-sunbird.org/assets/images/sunbird_logo.png",
                      "name": "ram"
                  },
                  "stageId": "kelkghhj35"
              },
              {
                "postId": "34512478-1b84-4e7e-b94f-2a3bc328d7a8",
                "threadId": "23d2cfa0-d2d7-11e8-b535-8794514fb191",
                "body": "sample comments for stage eelk12hj45",
                "createdOn": "2018-10-18T16:32:06.330Z",
                "userId": "NCF",
                "tag": "do_112584109936099328189_1_ecml",
                "userInfo": {
                    "logo": "https://dev.open-sunbird.org/assets/images/sunbird_logo.png",
                    "name": "ram"
                },
                "stageId": "eelk12hj45"
            }]
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
