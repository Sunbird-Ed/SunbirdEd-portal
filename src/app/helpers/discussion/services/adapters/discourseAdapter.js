/**
 * @author Loganathan Shanmugam <loganathan.shanmugam@tarento.com>
 */

let httpWrapper = require('../httpWrapper.js')
const _ = require('lodash')
let fs = require('fs')
let queryString = require('querystring')
let async = require('asyncawait/async')
let await = require('asyncawait/await')
let HttpStatus = require('http-status-codes')
var Path = require('path');
var fm = require("form-data")
let webService = require('request')
/**
 * Class provides services for thread related requests */

class DiscourseAdapter {
  /**
   *
   * Callers of the constructor can invoke as follows:
   *
   * let discourseAdapter = new DiscourseAdapter()
   */
  constructor({
    userName
  } = {}) {
    /**
     * @property {instance} httpService - Instance of httpservice which is used to make a http service call
     */
    this.httpService = httpWrapper

    /**
     * @property {string} discourseEndPoint - An endpoint url for discourse api
     */
    this.discourseEndPoint = 'http://discourse.idc.tarento.com/'
    /**
     * @property {object} discourseUriList - List of discourse uri's
     */
    this.discourseUris = {
      list: '/search.json',
      getOne: '/t/',
      postThread: '/posts',
      users: '/users',
      postActions: '/post_actions',
      acceptAsSolution: '/solution/accept',
      unAcceptSolution: '/solution/unaccept',
      retort: '/retorts',
      adminUsers: '/admin/users/',
      grantModeration: '/grant_moderation',
      revokeModeration: '/revoke_moderation',
      filePath: 'uploads.json',
      downloadFilePath: 'uploads/default/original/1X'
    }

    this.userName = userName
    this.apiAuth = {
      apiKey: 'ad70c8761eef0b379c8c22104dbc597023322536ec8f6757b8a780f7d3d9c0ae',
      // apiUserName: 'ntptest102'
      apiUserName: 'jamespj'
    }
  }

  grantModeration(userName) {
    return new Promise((resolve, reject) => {
      let discourseUser = await (this.getUserByUserName(userName))
      let options = {
        method: 'PUT',
        uri: this.discourseEndPoint + this.discourseUris.adminUsers + discourseUser.id + this.discourseUris.grantModeration,
        form: {
          api_key: this.apiAuth.apiKey,
          api_username: this.apiAuth.apiUserName
        }
      }
      this.httpService.call(options).then((data) => {
        let res = JSON.parse(data.body)

        resolve(true)
        // } else {
        //   reject(res)
        // }
      }, (error) => {
        reject(error)
      })
    })
  }

  revokeModeration(userName) {
    let discourseUser = await (this.getUserByUserName(userName))
    return new Promise((resolve, reject) => {
      let options = {
        method: 'PUT',
        uri: this.discourseEndPoint + this.discourseUris.adminUsers + discourseUser.id + this.discourseUris.revokeModeration,
        form: {
          api_key: this.apiAuth.apiKey,
          api_username: this.apiAuth.apiUserName
        }
      }
      this.httpService.call(options).then((data) => {
        resolve(true)
      }, (error) => {
        reject(error)
      })
      resolve(true)
    })
  }


  /*
   *create discourse user
   */
  createUser(user) {
    console.log("Create User Called");

    return new Promise((resolve, reject) => {
      let options = {
        method: 'POST',
        uri: this.discourseEndPoint + this.discourseUris.users + '.json',
        form: {
          api_key: this.apiAuth.apiKey,
          api_username: this.apiAuth.apiUserName,
          name: user.firstName || user.userName,
          email: user.email || user.userName + '@sunbird.org',
          password: 'testU1234567890',
          username: user.userName,
          active: 'true',
          approved: 'true'
        }
      }
      this.httpService.call(options).then((data) => {
        let res = JSON.parse(data.body)
        if (res.user_id) {
          // let moderator = await (this.grantModeration(res.user_id))
          resolve(true)
        } else {
          reject(res)
        }
      }, (error) => {
        reject(error)
      })
    })
  }

  getUserByUserName(userName) {
    return new Promise((resolve, reject) => {
      let options = {
        method: 'GET',
        uri: this.discourseEndPoint + this.discourseUris.users + '/' + userName + '.json'
      }
      this.httpService.call(options).then((data) => {
        let res = JSON.parse(data.body)
        if (data.response.statusCode == HttpStatus.OK && res.user) {
          resolve(res.user)
        } else {
          reject({
            message: res.errors[0] || 'Error in getting user info',
            status: data.response.statusCode
          })
        }
      }, (error) => {
        reject(error)
      })
    })
  }

  /*
   *check discourse user and create if not found
   */
  createUserIfNotExists(user) {
    console.log('-------------------------createUserIfNotExists-----------------------------------------------');
    // console.log('user:',user);

    return new Promise((resolve, reject) => {
      let options = {
        method: 'GET',
        uri: this.discourseEndPoint + this.discourseUris.users + '/' + user.userName + '.json'
      }
      console.log('options:', options);
      this.httpService.call(options).then((data) => {
        console.log('User::::::::::::::::::::::::::::', data);
        let res = JSON.parse(data.body)
        if (data.response.statusCode == HttpStatus.OK && res.user) {
          resolve(true)
        } else {
          this.createUser(user).then((success) => {
            resolve(true)
          }, (error) => {
            console.log('error_______________________________', error);

            reject(error)
          })
        }
      }, (error) => {
        reject(error)
      })
    })

  }

  /*
   *create discourse topic
   *
   */
  createThread(threadData, user) {
    console.log("create thread Called ===============================================================", threadData);
    return new Promise((resolve, reject) => {
      let formData = {
        api_key: this.apiAuth.apiKey,
        api_username: this.apiAuth.apiUserName,
        title: threadData.title,
        raw: threadData.body,
        // category: "5",
        category: threadData.type,
        created_at: new Date()
      }
      formData['tags[]'] = threadData.contextType + '__' + threadData.contextId
      console.log("formData", formData);
      let options = {
        method: 'POST',
        uri: this.discourseEndPoint + this.discourseUris.postThread,
        form: formData
      }

      console.log("options", options);
      this.httpService.call(options).then((data) => {
        console.log('data', data.body);

        let res = JSON.parse(data.body)

        if (data.response.statusCode == HttpStatus.OK && res.topic_id) {
          resolve(res.topic_id)
        } else {
          reject({
            message: res.errors || 'Error in thread creation',
            status: data.response.statusCode
          })
        }
      }, (error) => {
        reject(error)
      })
    })
  }

  /*
   *reply discourse topic
   *
   */
  replyThread(threadData, user) {
    return new Promise((resolve, reject) => {
      let formData = {
        api_key: this.apiAuth.apiKey,
        api_username: this.userName,
        raw: threadData.body,
        // Title:threadData.body,
        topic_id: threadData.threadId,
        // topic_id: threadData.threadId,
        nested_post: true,
        // reply_to_post_number: 2
      }

      console.log('threadData.replyPostNumber', threadData);

      if (threadData.replyPostNumber) {
        formData.reply_to_post_number = threadData.replyPostNumber
      }
      let options = {
        method: 'POST',
        uri: this.discourseEndPoint + this.discourseUris.postThread,
        form: formData
      }
      console.log(options);

      this.httpService.call(options).then((data) => {
        let res = JSON.parse(data.body)
        // console.log("Success in reply thread", data.response.statusCode,res.post.topic_id);
        if (data.response.statusCode == HttpStatus.OK && res.post.topic_id) {
          resolve(res.topic_id)
        } else {
          console.log("Error in reply thread", res);

          reject({
            message: res.errors[0] || 'Error in reply to this thread',
            status: data.response.statusCode
          })
        }
      }, (error) => {
        reject(error)
      }).catch((error) => {
        reject(error)
      })
    })
  }

  extractThreadList(topics, posts) {
    console.log(topics, posts);

    let threadList = []
    _.forEach(topics, function (topic) {
      let postData = _.find(posts, {
        topic_id: topic.id,
        post_number: 1
      })
      let threadData = {
        id: topic.id,
        author: {
          userName: postData.username,
          name: postData.name
        },
        body: postData.blurb,
        title: topic.title,
        createdDate: topic.created_at,
        repliesCount: topic.posts_count - 1,
        voteCount: postData.like_count,
        seen: !topic.unseen,
        archived: topic.archived,
        locked: topic.closed
      }
      threadList.push(threadData)
    })
    return threadList
  }

  extractThreadData(topicData) {
    // console.log('extractThreadD/ata: data====================================================', JSON.stringify(topicData));
    let posts = topicData.post_stream.posts
    let postData = _.find(posts, {
      topic_id: topicData.id,
      post_number: 1
    })
    let posters = []
    _.forEach(topicData.details.participants, function (participant) {
      posters.push({
        userId: participant.id,
        userName: participant.username
      })
    })

    let threadData = {
      id: topicData.id,
      author: {
        userName: postData.username,
        name: postData.name
      },

      body: postData.cooked.substring(postData.cooked.indexOf('>') + 1, postData.cooked.lastIndexOf('<')),
      title: topicData.title,
      createdDate: topicData.created_at,
      repliesCount: posts.length - 1,
      voteCount: topicData.like_count,
      read: postData.read,
      posters: posters,
      replies: [],
      actions: this.getThreadActions(postData, false),
      descId: postData.id,
      archived: topicData.archived,
      locked: topicData.closed
    }
    let adapter = this
    _.forEach(posts, function (post, index) {
      if (post.post_number !== 1 && post.post_type === 1) {
        let replyData = {
          id: post.id,
          author: {
            userName: post.username,
            name: post.name
          },
          body: post.cooked.substring(post.cooked.indexOf('>') + 1, post.cooked.lastIndexOf('<')),
          actions: adapter.getThreadActions(post, true),
          createdDate: post.created_at,
          voteCount: post.like_count,
          acceptedAnswer: post.accepted_answer,
          read: post.read
        }
        threadData.replies.push(replyData)
      }
    })
    return threadData
  }

  getThreadActions(threadData, isPost) {
    let actions = {}
    _.forEach(threadData.actions_summary, function (action) {
      if (action.id === 2) {
        actions['vote'] = (action.acted === true) ? 1 : (action.can_act === true) ? 0 : -1
      }
      if (action.id === 8) {
        actions['flag'] = (action.acted === true) ? 1 : (action.can_act === true) ? 0 : -1
      }
    })

    if (threadData.retorts) {
      let downVoteData = _.find(threadData.retorts, {
        emoji: '-1'
      })
      if (downVoteData && downVoteData.usernames && downVoteData.usernames.indexOf(this.userName) >= 0) {
        actions['downVote'] = 1
      } else {
        actions['downVote'] = (threadData.username === this.userName) ? -1 : 0
      }
    }

    if (isPost) {
      actions['acceptAnswer'] = (threadData.can_accept_answer && threadData.can_accept_answer === true) ? 0 : (threadData.accepted_answer === true && threadData.can_unaccept_answer === true) ? 1 : -1
    }
    return actions
  }

  /*
   *get discourse topics
   *
   */
  getThreadsList(threadData, user) {
    console.log("--------------------------getThreadsList-------------------------------------------------------------");

    console.log(threadData, user)
    this.userName = user.userName
    return new Promise((resolve, reject) => {
      let searchTerm = threadData.keyword === undefined ? '' : threadData.keyword + ' '
      this.createUserIfNotExists(user).then((success) => {
        let filters = {
          q: searchTerm + '#' + threadData.type + ' tags:batch__' + threadData.contextId,
          page: 1,
          api_key: this.apiAuth.apiKey,
          api_username: user.userName
        }
        console.log("filters", filters);

        let options = {
          method: 'GET',
          uri: this.discourseEndPoint + this.discourseUris.list + '?' + queryString.stringify(filters)
        }
        console.log("options", options);
        this.httpService.call(options).then((data) => {
          let res = JSON.parse(data.body)
          console.log(res)
          if (res && data.response.statusCode == HttpStatus.OK) {
            resolve(this.extractThreadList(res.topics, res.posts))
          } else {
            console.log("res1", res)
            reject(res)
          }
        }, (error) => {
          console.log("error1", error)
          reject(error)
        })
      }, (error) => {
        console.log("error2", error)

        reject(error)
      }).catch((error) => {
        console.log("error3", error)

        reject(error)
      })
    })
  }

  /*
   *get discourse topics
   *
   */
  getThreadById(threadId, user) {
    this.userName = user.userName
    return new Promise((resolve, reject) => {
      this.createUserIfNotExists(user).then((success) => {
        let filters = {
          api_key: this.apiAuth.apiKey,
          api_username: this.userName
        }
        let options = {
          method: 'GET',
          uri: this.discourseEndPoint + this.discourseUris.getOne + '/' + threadId + '.json?' + queryString.stringify(filters)
        }
        console.log(options)
        this.httpService.call(options).then((data) => {

          console.log('data/httpcall====================================================', data.response.statusCode);
          if (data.response.statusCode == HttpStatus.OK && data.body) {
            let res = JSON.parse(data.body)
            var aaa = this.extractThreadData(res)
            console.log('aaa', aaa)
            return resolve(aaa)
          } else {
            console.log("error0", data.response.statusCode)
            reject({
              status: data.response.statusCode,
              message: data.response.statusMessage
            })
          }
        }, (error) => {
          console.log("error1", error)
          reject(error)
        }).catch((error) => {
          console.log("error2", error)
          reject(error)
        })
      }, (error) => {
        console.log("error3", error)
        reject(error)
      }).catch((error) => {
        console.log("error4", error)
        reject(error)
      })
    })
  }

  postAction(actionData, user) {
    this.userName = user.userName
    return new Promise((resolve, reject) => {
      let options = {
        method: 'POST',
        uri: this.discourseEndPoint + this.discourseUris.postActions,
        form: {
          id: actionData.postId,
          api_key: this.apiAuth.apiKey,
          api_username: this.userName,
          post_action_type_id: actionData.type
        }

      }
      console.log(options);

      this.httpService.call(options).then((data) => {
        let res = JSON.parse(data.body)
        console.log(res, data.response.statusCode);

        if (res && data.response.statusCode == HttpStatus.OK) {
          resolve('done')
        } else {
          reject({
            message: res.errors || 'Error occured.Please try again later',
            status: data.response.statusCode
          })
        }
      }, (error) => {
        console.log("Error1", error);

        reject(error)
      })
    })
  }
  postUndoAction(actionData, user) {
    this.userName = user.userName
    return new Promise((resolve, reject) => {
      let options = {
        method: 'DELETE',
        uri: this.discourseEndPoint + this.discourseUris.postActions + '/' + actionData.postId,
        form: {
          api_key: this.apiAuth.apiKey,
          api_username: this.userName,
          post_action_type_id: actionData.type
        }
      }
      this.httpService.call(options).then((data) => {
        let res = JSON.parse(data.body)
        if (res && data.response.statusCode == HttpStatus.OK) {
          resolve('done')
        } else {
          reject({
            message: res.errors[0] || 'Error occured.Please try again later',
            status: data.response.statusCode
          })
        }
      }, (error) => {
        reject(error)
      })
    })
  }
  retort(actionData, user) {
    this.userName = user.userName
    return new Promise((resolve, reject) => {
      let options = {
        method: 'POST',
        uri: this.discourseEndPoint + this.discourseUris.retort + '/' + actionData.postId + '.json',
        form: {
          api_key: this.apiAuth.apiKey,
          api_username: this.userName,
          retort: actionData.type
        }

      }
      this.httpService.call(options).then((data) => {
        let res = JSON.parse(data.body)
        if (res && data.response.statusCode == HttpStatus.OK) {
          resolve('done')
        } else {
          reject({
            message: res.errors[0] || 'Error occured.Please try again later',
            status: data.response.statusCode
          })
        }
      }, (error) => {
        reject(error)
      })
    })
  }
  acceptSoution(answerData, user) {
    this.userName = user.userName
    return new Promise((resolve, reject) => {
      let options = {
        method: 'POST',
        uri: this.discourseEndPoint + this.discourseUris.acceptAsSolution,
        form: {
          api_key: this.apiAuth.apiKey,
          api_username: this.userName,
          id: answerData.postId
        }
      }
      if (answerData.undo) {
        options.uri = this.discourseEndPoint + this.discourseUris.unAcceptSolution
      }
      this.httpService.call(options).then((data) => {
        let res = JSON.parse(data.body)
        if (res && data.response.statusCode == HttpStatus.OK) {
          resolve('done')
        } else {
          reject({
            message: res.errors[0] || 'Error occured.Please try again later',
            status: data.response.statusCode
          })
        }
      }, (error) => {
        reject(error)
      })
    })
  }

  moderationAction(threadData, user) {
    this.userName = user.userName
    return new Promise((resolve, reject) => {
      let options = {
        method: 'PUT',
        uri: this.discourseEndPoint + '/t/' + threadData.threadId + '/status',
        form: {
          api_key: this.apiAuth.apiKey,
          api_username: this.userName,
          status: threadData.status,
          enabled: true
        }
      }
      this.httpService.call(options).then((data) => {
        let res = JSON.parse(data.body)

        if (res && data.response.statusCode == HttpStatus.OK) {
          resolve('done')
        } else {
          reject({
            message: res.errors[0] || 'Error occured.Please try again later',
            status: data.response.statusCode
          })
        }
      }, (error) => {
        reject(error)
      })
    })
  }

  editThread(threadData, user) {
    this.userName = user.userName
    return new Promise((resolve, reject) => {
      let options = {
        method: 'PUT',
        uri: this.discourseEndPoint + '/t/-/' + threadData.threadId + '.json',
        form: {
          api_key: this.apiAuth.apiKey,
          api_username: this.userName,
          title: threadData.title
        }
      }
      this.httpService.call(options).then((data) => {
        let res = JSON.parse(data.body)
        if (data.response.statusCode == HttpStatus.OK && res.basic_topic.id) {
          resolve('done')
        } else {
          reject({
            message: res.errors[0] || 'Error in editing thread',
            status: data.response.statusCode
          })
        }
      }, (error) => {
        reject(error)
      })
    })
  }

  getReplyById(postId, user) {
    this.userName = user.userName
    return new Promise((resolve, reject) => {
      let filters = {
        api_key: this.apiAuth.apiKey,
        api_username: this.userName
      }
      let options = {
        method: 'GET',
        uri: this.discourseEndPoint + this.discourseUris.postThread + '/' + postId + '.json?' + queryString.stringify(filters)
      }
      this.httpService.call(options).then((data) => {
        let res = JSON.parse(data.body)
        if (res && data.response.statusCode == HttpStatus.OK) {
          resolve(res)
        } else {
          reject({
            message: res.errors[0] || 'Error in getting reply info',
            status: data.response.statusCode
          })
        }
      }, (error) => {
        reject(error)
      })
    });
  }

  editReply(replyData, user) {
    this.userName = user.userName
    return new Promise((resolve, reject) => {
      let options = {
        method: 'PUT',
        uri: this.discourseEndPoint + '/posts/' + replyData.postId + '.json',
        form: {
          'api_key': this.apiAuth.apiKey,
          'api_username': this.userName,
          'post[raw]': replyData.body,
          'cooked': replyData.body
        }
      }
      this.httpService.call(options).then((data) => {
        let res = JSON.parse(data.body)
        if (res.post && res.post.id && data.response.statusCode == HttpStatus.OK) {
          resolve('done')
        } else {
          reject({
            message: res.errors[0] || 'Error in editing reply',
            status: data.response.statusCode
          })
        }
      }, (error) => {
        reject(error)
      })
    })

  }

  // Upload files
  uploadFile(file, user) {
    console.log('uploadFile called');
    this.userName = user.userName
    return new Promise((resolve, reject) => {
      // console.log(file);
      let options = {
          'api_key': this.apiAuth.apiKey,
          'api_username': this.userName, //this.apiAuth.apiUserName
          'type': 'upload',
          'file': fs.createReadStream("./" + file.file.path),//fs.createReadStream("./"+file.file.path,'utf8'),

      }
      console.log(JSON.stringify(options));

      webService.post({url: this.discourseEndPoint + this.discourseUris.filePath, formData: options}, function (err,data,body) {
        console.log(err,data.statusCode,body);

        if(err){
          console.log("uploadFile: Error in catch block", error)
            // error.reqObj = options
            return reject(error)
        }
        //  let res = JSON.parse(body)
        console.log("==================================================================================");
        // console.log(res, data.response.statusCode);
        if (data.statusCode == HttpStatus.OK) {
          return resolve(JSON.parse(data.body))
        } else {
          return reject({
            message: res.message || 'Error in uploadFile',
            status: data.response.statusCode,
            // reqObject: options
          })
        }
        // return resolve({err,data,body})
      })


      // this.httpService.call(options).then((data) => {
      //   let res = JSON.parse(data.body)
      //   console.log("==================================================================================");
      //   console.log(res, data.response.statusCode);
      //   if (data.response.statusCode == HttpStatus.OK) {
      //     return resolve(data.response)
      //   } else {
      //     return reject({
      //       message: res.message || 'Error in uploadFile',
      //       status: data.response.statusCode,
      //       // reqObject: options
      //     })
      //   }
      // }).catch(function (error) {
      //   console.log("uploadFile: Error in catch block", error)
      //   error.reqObj = options
      //   return reject(error)
      // })
    });
  }

  // Downlod Files
  downloadFile(fileData, user) {
    console.log('downloadFile called');
    console.log(fileData)
    this.userName = user.userName
    return new Promise((resolve, reject) => {
      if (fileData.fileName) {
        resolve(this.discourseEndPoint + this.discourseUris.downloadFilePath + fileData.fileName)
      } else {
        reject({
          message: 'Error in downloadFile',
          status: HttpStatus.NO_CONTENT
        })
      }
    });
  }

}

module.exports = DiscourseAdapter
