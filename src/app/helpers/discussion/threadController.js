const _ = require('lodash')
let async = require('asyncawait/async')
let await = require('asyncawait/await') //eslint-disable-line
let HttpStatus = require('http-status-codes')
const ThreadService = require('./services/threadService.js')
let httpWrapper = require('./services/httpWrapper.js')
let AppError = require('./services/ErrorInterface.js')
let DiscouseAdapter = require('./services/adapters/discourseAdapter.js')
let UserService = require('./services/userService.js')

class ThreadController {
  constructor({
    threadModel,
    replyModel,
    actionsModel
  }) {
    /**
     * @property {instance} httpService - Instance of httpservice which is used to make a http service call
     */
    this.discouseAdapter = new DiscouseAdapter({})
    this.httpService = httpWrapper
    this.threadService = new ThreadService(this.discouseAdapter)
    this.userService = new UserService()
    this.threadModel = threadModel
    this.replyModel = replyModel
    this.actionsModel = actionsModel
  }



  /**
   * Get threads list
   *
   * @return  {[type]} return transformed data
   */
  getThreads(requestObj) {
    return this.__getThreads()(requestObj)
  }

  /**
   * Get thread by id
   *
   * @return  {[type]} return transformed data
   */
  getThreadById(requestObj) {
    return this.__getThreadById()(requestObj)
  }

  /**
   * create thread
   *
   * @return  {[type]} return transformed data
   */
  createThread(requestObj) {
    return this.__createThread()(requestObj)
  }

  /**
   * create thread
   *
   * @return  {[type]} return transformed data
   */
  replyThread(requestObj) {
    return this.__replyThread()(requestObj)
  }
  /**
   * create thread
   *
   * @return  {[type]} return transformed data
   */
  voteThread(requestObj) {
    return this.__voteThread()(requestObj)
  }
  /**
   * create thread
   *
   * @return  {[type]} return transformed data
   */
  flagThread(requestObj) {
    return this.__flagThread()(requestObj)
  }

  /**
   * create thread
   *
   * @return  {[type]} return transformed data
   */
  markAsAnswer(requestObj) {
    return this.__markAsAnswer()(requestObj)
  }

  archiveThread(requestObj) {
    return this.__archiveThread()(requestObj)
  }
  lockThread(requestObj) {
    return this.__lockThread()(requestObj)
  }
  editThread(requestObj) {
    return this.__editThread()(requestObj)
  }
  editReply(requestObj) {
    return this.__editReply()(requestObj)
  }
  checkModeration(requestObj) {
    return this.__checkModeration()(requestObj)
  }
  fileService(requestObj) {
    return this._fileService()(requestObj)
  }



  __checkModeration(requestObj) {
    return async ((requestObj) => {
      try {

        let authUserToken = await (this.userService.getToken(requestObj))

        let userProfile = await (this.userService.getUserProfile(authUserToken))

        if (userProfile) {
          return new Promise((resolve, reject) => {
            let user = {
              userName: userProfile.userName,
              userId: userProfile.userId
            }
            let threadData = {
              threadId: requestObj.body.threadId
            }
            this.threadService.checkModerationAccess(threadData, user).then((threadResponse) => {
              resolve(
                threadResponse
              )
            }, function (error) {
              reject(error)
            })
          })
        } else {
          return {
            message: 'Unauthorized User',
            status: HttpStatus.UNAUTHORIZED
          }
        }
      } catch (error) {

        return {
          message: error.message || 'Error in getting moderation info',
          status: error.status || HttpStatus.INTERNAL_SERVER_ERROR
        }
      }
    })
  }


  /*
   *create thread flow
   *
   */
  __markAsAnswer(requestObj) {
    return async ((requestObj) => {
      try {

        let authUserToken = await (this.userService.getToken(requestObj))

        let userProfile = await (this.userService.getUserProfile(authUserToken))

        let validation = this.replyModel.validatemarkAnswerApi(requestObj.body)
        let markAnswerRequest = requestObj.body.request
        if (!validation.isValid) throw {
          message: validation.error,
          status: HttpStatus.BAD_REQUEST,
          isCustom: true
        }
        if (userProfile) {
          return new Promise((resolve, reject) => {
            let user = {
              userName: userProfile.userName,
            }
            let answerData = {
              postId: markAnswerRequest.postId,
              undo: markAnswerRequest.undo
            }

            this.threadService.markAsAnswer(answerData, user).then((threadResponse) => {
              resolve({
                status: threadResponse
              })
            }, function (error) {
              reject(error)
            })
          })
        } else {
          throw {
            message: 'Unauthorized User',
            status: HttpStatus.UNAUTHORIZED
          }
        }
      } catch (error) {
        throw {
          message: error.message || 'Error in marking answer',
          status: error.status || HttpStatus.INTERNAL_SERVER_ERROR
        }
      }
    })
  }

  __archiveThread(requestObj) {
    return async ((requestObj) => {
      try {

        let authUserToken = await (this.userService.getToken(requestObj))

        let userProfile = await (this.userService.getUserProfile(authUserToken))
        let validation = this.actionsModel.validateArchiveThreadApi(requestObj.body)
        let archiveThreadRequest = requestObj.body.request
        if (!validation.isValid) throw {
          message: validation.error,
          status: HttpStatus.BAD_REQUEST,
          isCustom: true
        }
        if (userProfile) {
          return new Promise((resolve, reject) => {
            let user = {
              userName: userProfile.userName,
              userId: userProfile.userId
            }
            let threadData = {
              threadId: archiveThreadRequest.threadId
            }
            this.threadService.archiveThread(threadData, user).then((threadResponse) => {
              resolve({
                status: threadResponse
              })
            }, function (error) {
              reject(error)
            })
          })
        } else {
          throw {
            message: 'Unauthorized User',
            status: HttpStatus.UNAUTHORIZED
          }
        }
      } catch (error) {
        throw {
          message: error.message || 'Error in archiving thread',
          status: error.status || HttpStatus.INTERNAL_SERVER_ERROR
        }
      }
    })
  }

  __lockThread(requestObj) {
    return async ((requestObj) => {
      try {

        let authUserToken = await (this.userService.getToken(requestObj))

        let userProfile = await (this.userService.getUserProfile(authUserToken))
        let validation = this.actionsModel.validateLockThreadApi(requestObj.body)
        let lockThreadRequest = requestObj.body.request
        if (!validation.isValid) throw {
          message: validation.error,
          status: HttpStatus.BAD_REQUEST,
          isCustom: true
        }
        if (userProfile) {
          return new Promise((resolve, reject) => {
            let user = {
              userName: userProfile.userName,
              userId: userProfile.userId
            }
            let threadData = {
              threadId: lockThreadRequest.threadId
            }
            this.threadService.lockThread(threadData, user).then((threadResponse) => {
              resolve({
                status: threadResponse
              })
            }, function (error) {
              reject(error)
            })
          })
        } else {
          return {
            message: 'Unauthorized User',
            status: HttpStatus.UNAUTHORIZED
          }
        }
      } catch (error) {
        return {
          message: error.message || 'Error in locking thread',
          status: error.status || HttpStatus.INTERNAL_SERVER_ERROR
        }
      }
    })
  }

  __editThread(requestObj) {
    return async ((requestObj) => {
      try {

        let authUserToken = await (this.userService.getToken(requestObj))

        let userProfile = await (this.userService.getUserProfile(authUserToken))
        let validation = this.threadModel.validateEditThreadApi(requestObj.body)
        let editThreadRequest = requestObj.body.request
        if (!validation.isValid) throw {
          message: validation.error,
          status: HttpStatus.BAD_REQUEST,
          isCustom: true
        }
        if (userProfile) {
          return new Promise((resolve, reject) => {

            let user = {
              userName: userProfile.userName,
              userId: userProfile.userId
            }
            let threadData = {
              threadId: editThreadRequest.threadId,
              title: editThreadRequest.title,
              body: editThreadRequest.body,
              postId: editThreadRequest.descId
            }
            this.threadService.editThread(threadData, user).then((threadResponse) => {
              resolve({
                status: threadResponse
              })
            }, function (error) {
              reject(error)
            })
          })
        } else {
          throw {
            message: 'Unauthorized User',
            status: HttpStatus.UNAUTHORIZED,
            isCustom: true
          }
        }
      } catch (error) {
        throw {
          message: error.message || 'Error in editing thread',
          status: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
          isCustom: true
        }
      }
    })
  }


  __editReply(requestObj) {
    console.log("Edit Reply called");

    return async ((requestObj) => {
      try {

        let authUserToken = await (this.userService.getToken(requestObj))

        let userProfile = await (this.userService.getUserProfile(authUserToken))

        let validation = this.replyModel.validateeditReplyApi(requestObj.body)
        let editReplyRequest = requestObj.body.request
        if (!validation.isValid) throw {
          message: validation.error,
          status: HttpStatus.BAD_REQUEST,
          isCustom: true
        }
        if (userProfile) {
          return new Promise((resolve, reject) => {
            let user = {
              userName: userProfile.userName,
              userId: userProfile.userId
            }
            let postData = {
              postId: editReplyRequest.postId,
              body: editReplyRequest.body
            }
            this.threadService.editReply(postData, user).then((threadResponse) => {
              resolve({
                status: threadResponse
              })
            }, function (error) {
              reject(error)
            })
          })
        } else {
          throw {
            message: 'Unauthorized User',
            status: HttpStatus.UNAUTHORIZED
          }
        }
      } catch (error) {
        throw {
          message: error.message || 'Error in editing thread',
          status: error.status || HttpStatus.INTERNAL_SERVER_ERROR
        }
      }
    })
  }



  /*
   *create thread flow
   *
   */
  __flagThread(requestObj) {
    return async ((requestObj) => {
      try {

        let authUserToken = await (this.userService.getToken(requestObj))

        let userProfile = await (this.userService.getUserProfile(authUserToken))
        let validation = this.actionsModel.validateFlagApi(requestObj.body)
        let flagThreadRequest = requestObj.body.request
        if (!validation.isValid) throw {
          message: validation.error,
          status: HttpStatus.BAD_REQUEST,
          isCustom: true
        }
        if (userProfile) {
          return new Promise((resolve, reject) => {
            let user = {
              userName: userProfile.userName
            }
            let threadData = {
              postId: flagThreadRequest.postId,
              undo: flagThreadRequest.undo
            }
            this.threadService.flagThread(threadData, user).then((threadResponse) => {
              resolve({
                status: threadResponse
              })
            }, function (error) {
              reject(error)
            })
          })
        } else {
          throw {
            message: 'Unauthorized User',
            status: HttpStatus.UNAUTHORIZED
          }
        }
      } catch (error) {
        throw {
          message: error.message || 'Error in flagging thread',
          status: error.status || HttpStatus.INTERNAL_SERVER_ERROR
        }
      }
    })
  }

  /*
   *create thread flow
   *
   */
  __voteThread(requestObj) {
    return async ((requestObj) => {
      try {

        let authUserToken = await (this.userService.getToken(requestObj))

        let userProfile = await (this.userService.getUserProfile(authUserToken))
        let validation = this.actionsModel.validateVoteApi(requestObj.body)
        let voteThreadRequest = requestObj.body.request
        console.log("validation=================", validation);

        if (!validation.isValid) throw {
          message: validation.error,
          status: HttpStatus.BAD_REQUEST,
          isCustom: true
        }
        if (userProfile) {
          return new Promise((resolve, reject) => {
            let user = {
              userName: userProfile.userName
            }
            let threadData = {
              postId: voteThreadRequest.postId,
              value: voteThreadRequest.value,
              undo: voteThreadRequest.undo
            }
            this.threadService.voteThread(threadData, user).then((threadResponse) => {
              resolve({
                status: threadResponse
              })
            }, function (error) {
              reject(error)
            })
          })
        } else {
          throw {
            message: 'Unauthorized User',
            status: HttpStatus.UNAUTHORIZED
          }
        }
      } catch (error) {

        throw {
          message: error.message || 'Error in voting thread',
          status: error.status || HttpStatus.INTERNAL_SERVER_ERROR
        }
      }
    })
  }


  /*
   *reply thread flow
   *
   */
  __replyThread(requestObj) {
    return async ((requestObj) => {
      try {
        let authUserToken = await (this.userService.getToken(requestObj))
        // validate request
        let userProfile = await (this.userService.getUserProfile(authUserToken))
        let validation = this.replyModel.validatereplyThreadApi(requestObj.body)
        let replyThreadRequest = requestObj.body.request
        if (!validation.isValid) throw {
          message: validation.error,
          status: HttpStatus.BAD_REQUEST,
          isCustom: true
        }
        if (userProfile) {
          return new Promise((resolve, reject) => {
            let threadData = {
              threadId: replyThreadRequest.threadId,
              body: replyThreadRequest.body,
              replyPostNumber: _.get(replyThreadRequest, 'replyPostNumber') || null
            }
            let user = {
              userName: userProfile.userName,
              firstName: userProfile.firstName,
              email: userProfile.email
            }
            this.threadService.replyThread(threadData, user).then((threadResponse) => {
              resolve({
                id: threadResponse
              })
            }, function (error) {
              reject(error)
            })
          })
        } else {
          throw {
            message: 'Unauthorized User',
            status: HttpStatus.UNAUTHORIZED
          }
        }
      } catch (error) {

        throw {
          message: error.message || 'Error in reply thread',
          status: error.status || HttpStatus.INTERNAL_SERVER_ERROR
        }
      }
    })
  }

  /*
   *create thread flow
   *
   */
  __createThread(requestObj) {
    return async ((requestObj) => {
      try {
        console.log('requestObj', requestObj.body);

        let validation = this.threadModel.validateApi(requestObj.body)
        let createThreadRequest = requestObj.body.request
        console.log('requestObj', validation, createThreadRequest);
        if (!validation.isValid) {
          console.log("validation",validation);

          throw {
          message: validation.error,
          status: HttpStatus.BAD_REQUEST,
          isCustom: true
        }}

        let authUserToken = await (this.userService.getToken(requestObj))
        // validate request
        let userProfile = await (this.userService.getUserProfile(authUserToken))

        if (userProfile) {
          return new Promise((resolve, reject) => {
            let threadData = {
              title: createThreadRequest.title,
              body: createThreadRequest.body,
              contextId: createThreadRequest.contextId,
              type: createThreadRequest.type,
              contextType: createThreadRequest.contextType,
              config: createThreadRequest.config
            }
            let user = {
              userName: userProfile.userName,
              firstName: userProfile.firstName,
              email: userProfile.email,
              userId: userProfile.userId,
              token: authUserToken
            }
            console.log("threadData", threadData, user);

            this.threadService.createThread(threadData, user).then((threadResponse) => {
              console.log("threadResponse___________", threadResponse)
              resolve({
                id: threadResponse
              })
            }, function (error) {
              console.log("error____________", error)
              reject(error)
            })
          })
        } else {
          console.log("error____________Else",)
          throw ({
            message: 'Unauthorized User',
            status: HttpStatus.UNAUTHORIZED
          })
        }
      } catch (error) {
        console.log("error____________", error)
        throw ({
          message: error.message || 'Error in creating thread',
          status: error.status || HttpStatus.INTERNAL_SERVER_ERROR
        })
      }
    })
  }

  /**
   * Initialize the get threads flow
   * @return Object Response of getThreads
   */
  __getThreads(requestObj) {
    return async ((requestObj) => {
      try {
        let authUserToken = await (this.userService.getToken(requestObj))
        // validate request
        let userProfile = await (this.userService.getUserProfile(authUserToken))
        console.log("====================================================")
        console.log(authUserToken, userProfile);

        let validation = this.threadModel.validateListThreadApi(requestObj.body)
        let listThreadRequest = requestObj.body.request
        if (!validation.isValid) {
          console.log("validation", validation);
          throw {
          message: validation.error,
          status: HttpStatus.BAD_REQUEST,
          isCustom: true
        }
      }
        if (userProfile && userProfile.userId) {
          return new Promise((resolve, reject) => {
            let threadFilters = {
              contextId: listThreadRequest.contextId,
              type: listThreadRequest.type,
              keyword: listThreadRequest.keyword
            }
            let user = {
              userName: userProfile.userName
            }
            this.threadService.getThreadsList(threadFilters, user).then((threadResponse) => {
              resolve({
                threads: threadResponse
              })
            }, function (error) {
              console.log("Internal", error);
              reject(error)
            })
          })
        } else {
          console.log("Else---------------------");

          throw ({
            message: 'Unauthorized User',
            status: HttpStatus.UNAUTHORIZED
          })
        }
      } catch (error) {
        console.log("Internal", error);

        throw ({
          message: error.message || 'Error in getting threads',
          status: error.status || HttpStatus.INTERNAL_SERVER_ERROR
        })
      }
    })
  }

  /**
   * Initialize the get threads by idflow
   * @return Object Response of getThreadByID
   */
  __getThreadById() {
    return async ((requestObj) => {
      try {
        let authUserToken = await (this.userService.getToken(requestObj))
        // validate request
        let userProfile = await (this.userService.getUserProfile(authUserToken))

        console.log("User data", authUserToken, userProfile);

        if (userProfile && userProfile.userId) {
          return new Promise((resolve, reject) => {
            let user = {
              userName: userProfile.userName
            }
            this.threadService.getThreadById(requestObj.params.id, user).then((threadResponse) => {
              resolve({
                thread: threadResponse
              })
            }).catch(function (error) {
              console.log("Error in catch:", error);

              reject(error)
            })
          })
        } else {
          console.log("error Un user");
          throw {
            message: 'Unauthorized User',
            status: HttpStatus.UNAUTHORIZED,
            isCustom: true
          }
        }
      } catch (error) {
        console.log("error Un1 user:", error);
        throw {
          message: error.message || 'Error in getting thread details',
          status: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
          isCustom: true
        }
      }
    })
  }
  _fileService() {
    console.log("_fileService Called");

    return async ((requestObj) => {
      try {
        let authUserToken = await (this.userService.getToken(requestObj))
        // validate request
        let userProfile = await (this.userService.getUserProfile(authUserToken))

        // console.log("User data", authUserToken, userProfile);

        if (userProfile && userProfile.userId) {
          let user = {
            userName: userProfile.userName //'AmitSengar'
          }

          var newObject = {};
          console.log('requestObj', requestObj.body.type);

          if (requestObj.body.type === 'upload') {
            newObject = {
              file: requestObj.file,
              type: requestObj.body.type
            };
          } else {
            newObject = {
              fileName: requestObj.body.fileName,
              type: requestObj.body.type
            };
          }
          return new Promise((resolve, reject) => {
            this.threadService.fileService(newObject, user).then((threadResponse) => {
              resolve({
                response: threadResponse
              })
            }, function (error) {
              console.log(error);
              reject(error)
            })
          });
        } else {
          console.log("error In user");
          throw {
            message: 'Unauthorized User',
            status: HttpStatus.UNAUTHORIZED,
            isCustom: true
          }
        }

      } catch (error) {
        console.log("error Un1 user:::", error);
        throw {
          message: error.message || 'Error in getting thread details',
          status: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
          isCustom: true
        }
      }
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
