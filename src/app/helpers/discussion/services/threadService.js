/**
 * @author Loganathan Shanmugam <loganathan.shanmugam@tarento.com>
 */

/**
 * Class provides services for thread related requests */
let GroupService = require('./groupService')
let async = require('asyncawait/async')
let await = require('asyncawait/await') //eslint-disable-line
let HttpStatus = require('http-status-codes')
class ThreadService {
  /**
   *
   * Callers of the constructor can invoke as follows:
   *
   * let threadService = new ThreadService({discourseWrapper:instance })
   */
  constructor(discussionAdapter) {
    /**
     * @property {instance} discussionAdapter - Instance of any discussion engine's adapter like discourse which is used to make a discussion related api calls
     */
    this.discussionAdapter = discussionAdapter
    this.groupService = new GroupService()
  }

  /*
   *create thread
   *
   */
  createThread(threadData, user) {
    return new Promise((resolve, reject) => {
      try {
        console.log("=================createThread S===========================================", threadData);

        let group = await (this.groupService.getOrCreateGroup(threadData.contextType, threadData.contextId, user))
        console.log("=================createThread GROUP===========================================", group);

        if (group) {
          let threadId = await (this.discussionAdapter.createThread(threadData, user))
          this.groupService.addThreadConfig(group, threadId.toString(), user.userId, threadData.config).then((success) => {
              resolve(threadId)
            },
            (error) => {
              console.log('error', error);

              reject(error)
            })
        } else {
          reject({
            message: 'Error in getting group info',
            status: HttpStatus.INTERNAL_SERVER_ERROR
          })
        }
      } catch (error) {
        reject({
          message: error.message || 'Error in getting group info',
          status: error.status || HttpStatus.INTERNAL_SERVER_ERROR
        })
      }
    })
  }

  editThread(threadData, user) {
    return new Promise((resolve, reject) => {
      try {
        let moderationAllowed = await (this.groupService.checkModerationAccess(threadData.threadId.toString(), user.userId))
        console.log('moderationAllowed', moderationAllowed);

        if (moderationAllowed === true) {
          let grantModeration = await (this.discussionAdapter.grantModeration(user.userName))
          let status = await (this.discussionAdapter.editThread(threadData, user))
          let descStatus = await (this.editReply(threadData, user))
          let revokeModeration = await (this.discussionAdapter.revokeModeration(user.userName))
          resolve(descStatus)
        } else {
          reject({
            message: 'This action requires moderation rights',
            status: HttpStatus.FORBIDDEN
          })
        }
      } catch (error) {
        reject({
          message: error.message || 'Error in checking moderation rights',
          status: error.status || HttpStatus.INTERNAL_SERVER_ERROR
        })
      }
    })
  }


  editReply(postData, user) {
    // console.log("addasdasddddddddddddddddddddddd");

    return new Promise((resolve, reject) => {
      try {
        let moderationAllowed = false
        let replyData = await (this.discussionAdapter.getReplyById(postData.postId, user))
        if (replyData.username == user.userName) {
          moderationAllowed = true
        } else {
          moderationAllowed = await (this.groupService.checkModerationAccess(replyData.topic_id.toString(), user.userId))
        }

        if (moderationAllowed === true) {
          let grantModeration = await (this.discussionAdapter.grantModeration(user.userName))
          let status = await (this.discussionAdapter.editReply(postData, user))
          let revokeModeration = await (this.discussionAdapter.revokeModeration(user.userName))
          resolve(status)
        } else {
          reject({
            message: 'This action requires moderation rights',
            status: HttpStatus.FORBIDDEN
          })
        }
      } catch (error) {
        reject({
          message: error.message || 'Error in editing this reply',
          status: error.status || HttpStatus.INTERNAL_SERVER_ERROR
        })
      }
    })
  }

  checkModerationAccess(threadData, user) {
    return new Promise((resolve, reject) => {
      try {
        let moderationAllowed = await (this.groupService.checkModerationAccess(threadData.threadId.toString(), user.userId))
        if (moderationAllowed === true) {
          resolve({
            access: true
          })
        } else {
          resolve({
            access: false
          })
        }
      } catch (error) {
        reject({
          message: 'Error in checking moderation rights',
          status: HttpStatus.INTERNAL_SERVER_ERROR
        })
      }
    })
  }

  archiveThread(threadData, user) {
    return new Promise((resolve, reject) => {
      try {
        let moderationAllowed = await (this.groupService.checkModerationAccess(threadData.threadId.toString(), user.userId))
        if (moderationAllowed === true) {
          let grantModeration = await (this.discussionAdapter.grantModeration(user.userName))
          threadData.status = 'archived'
          let status = await (this.discussionAdapter.moderationAction(threadData, user))
          let revokeModeration = await (this.discussionAdapter.revokeModeration(user.userName))
          resolve(status)
        } else {
          reject({
            message: 'This action requires moderation rights',
            status: HttpStatus.FORBIDDEN
          })
        }
      } catch (error) {
        reject({
          message: error.message || 'Error in archiving this thread',
          status: error.status || HttpStatus.INTERNAL_SERVER_ERROR
        })
      }
    })
  }

  lockThread(threadData, user) {
    return new Promise((resolve, reject) => {
      try {
        let moderationAllowed = await (this.groupService.checkModerationAccess(threadData.threadId.toString(), user.userId))
        if (moderationAllowed === true) {
          threadData.status = 'closed'
          let grantModeration = await (this.discussionAdapter.grantModeration(user.userName))
          let status = await (this.discussionAdapter.moderationAction(threadData, user))
          let revokeModeration = await (this.discussionAdapter.revokeModeration(user.userName))
          resolve(status)
        } else {
          reject({
            message: 'This action requires moderation rights',
            status: HttpStatus.FORBIDDEN
          })
        }
      } catch (error) {
        reject({
          message: error.message || 'Error in locking this thread',
          status: error.status || HttpStatus.INTERNAL_SERVER_ERROR
        })
      }
    })
  }


  /*
   *reply thread
   *
   */
  replyThread(threadData, user) {
    return this.discussionAdapter.replyThread(threadData, user)
  }

  getThreadsList(threadData, user) {
    return this.discussionAdapter.getThreadsList(threadData, user)
  }
  getThreadById(threadId, user) {
    return new Promise((resolve, reject) => {
      try {
        let threadDetails = await (this.discussionAdapter.getThreadById(threadId, user))
        console.log("::::::::::::::::::", threadId, threadDetails)
        let threadConfig = await (this.groupService.getThreadConfig(threadId.toString()))
        console.log("::::::::::::::::::", threadConfig, threadId, threadDetails);

        threadDetails.config = JSON.parse(threadConfig.config.toString())
        resolve(threadDetails)
      } catch (error) {
        reject(error)
      }
    })
  }


  fileService(threadData, user) {
    console.log('fileService called');
  //  console.log(threadData, user);

    return new Promise((resolve, reject) => {
      // let actionData = {
      //   postId: threadData.type
      // }
      switch (threadData.type) {
        case 'upload':
          return this.discussionAdapter.uploadFile(threadData, user).then(resolve).catch(reject)
        case 'download':
          return this.discussionAdapter.downloadFile(threadData, user).then(resolve).catch(reject)
        default:
        return reject({
          message: 'error While calling FileService',
          status: HttpStatus.FORBIDDEN
        })
      }
    });
  }

  voteThread(threadData, user) {
    let actionData = {
      postId: threadData.postId
    }
    switch (threadData.value) {
      case 'up':
        actionData.type = 2
        if (!threadData.undo) {
          return this.discussionAdapter.postAction(actionData, user)
        } else {
          return this.discussionAdapter.postUndoAction(actionData, user)
        }

      case 'down':
        actionData.type = -1
        if (!threadData.undo) {
          return this.discussionAdapter.retort(actionData, user)
        } else {
          return this.discussionAdapter.retort(actionData, user)
        }
    }
  }
  flagThread(threadData, user) {
    let actionData = {
      postId: threadData.postId,
      type: 8
    }
    if (!threadData.undo) {
      return this.discussionAdapter.postAction(actionData, user)
    } else {
      return this.discussionAdapter.postUndoAction(actionData, user)
    }
  }
  markAsAnswer(answerData, user) {
    return this.discussionAdapter.acceptSoution(answerData, user)
  }
}

module.exports = ThreadService
