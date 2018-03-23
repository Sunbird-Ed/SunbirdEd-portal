class GroupController {
  constructor () {
  }
  /*
  * create thread
  *
  * @return  {[type]} return transformed data
  */
  createGroup (requestObj) {
    return this.__createGroup()(requestObj)
  }
  __createGroup (requestObj) {
    return async ((requestObj) => {
        try {
  
          let authUserToken = await (this.__getToken(requestObj))
  
          let userProfile = await (this.__getUserProfile(authUserToken))
  
          if (userProfile) {
            return new Promise((resolve, reject) => {
              let user = {
                userName: userProfile.userName,
              }
              let answerData = {
                postId: requestObj.body.postId
              }  
              this.threadService.markAsAnswer(answerData, user).then((threadResponse) => {
                resolve({
                  status: threadResponse
                })
              }, function (error) {
                reject({
                  error: error
                })
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
            message: 'Error',
            status: HttpStatus.INTERNAL_SERVER_ERROR
          }
        }
      })
  }
}
module.exports = GroupController
