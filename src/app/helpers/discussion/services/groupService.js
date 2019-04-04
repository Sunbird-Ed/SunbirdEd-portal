/**
 * @author Loganathan Shanmugam <loganathan.shanmugam@tarento.com>
 */

/**
 * Class provides services for thread related requests */
let CassandraModel = require('./adapters/cassandra/CassandraModel')
let _ = require('lodash')
let httpWrapper = require('./httpWrapper.js')
const envHelper = require('../../environmentVariablesHelper.js')
const learnerURL = envHelper.LEARNER_URL
const learnerAuthorization = envHelper.PORTAL_API_AUTH_TOKEN
let batchRoleMap = require('./batchGroupRolemap.json')
let async = require('asyncawait/async')
let await = require('asyncawait/await') //
let HttpStatus = require('http-status-codes')
class GroupService {
  constructor() {
    this.cassandraModel = CassandraModel
    /**
     * @property {instance} httpService - Instance of httpservice which is used to make a http service call
     */
    this.httpService = httpWrapper
  }
  getOrCreateGroup(contextType, contextId, user) {

    let classObj = this
    classObj.userId = user.userId
    return new Promise((resolve, reject) => {
      let group = await (classObj.getGroup(contextType, contextId))
      if (!group) {
        let group = new CassandraModel.instance.Group({
          contexttype: contextType,
          contextid: contextId,
          pluginid: 'org.ekstep.discussions',
          rolemap: Buffer.from(JSON.stringify(batchRoleMap)),
          visibility: 'private',
          access: 'restricted',
          status: 1,
          createdby: user.userId,
          createddate: Date.now().toString(),
          updatedby: user.userId,
          updateddate: Date.now().toString()
        })
        let batchMembers = await (classObj.getBatchMembers(contextId, user.token))
        group.save(function (err) {
          if (err) {
            console.log(err)
            reject(err)
          } else {
            classObj.getGroup(contextType, contextId).then((group) => {
              classObj.addGroupMembers(batchMembers, group.id).then((batchMembers) => {
                resolve(group.id)
              }, (error) => {
                reject(error)
              })
            }, (error) => {
              reject(error)
            })
          }
        })
      } else {
        resolve(group.id)
      }
    }).catch(err => {
      throw err;
    })


  }


  getBatchMembers(batchId, token) {
    return new Promise((resolve, reject) => {
      let options = {
        method: 'GET',
        uri: learnerURL + 'course/v1/batch/read/' + batchId,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + learnerAuthorization,
          'x-authenticated-user-token': token
        }
      }
      this.httpService.call(options).then((data) => {
        let res = JSON.parse(data.body)
        let batchdetails = res.result.response
        let batchMembers = []
        _.forEach(batchdetails.participant, (participant, key) => {
          let member = {
            userId: key,
            roles: ['participant']
          }
          batchMembers.push(member)
        })
        _.forEach(batchdetails.mentors, (mentor) => {
          let member = {
            userId: mentor,
            roles: ['moderator']
          }
          batchMembers.push(member)
        })
        let groupOwnerIndex = _.findIndex(batchMembers, {
          userId: batchdetails.createdBy
        })
        if (groupOwnerIndex >= 0) {
          batchMembers[groupOwnerIndex].roles.push('owner')
        } else {
          batchMembers.push({
            userId: batchdetails.createdBy,
            roles: ['owner', 'moderator']
          })
        }
        resolve(batchMembers)
      }, (error) => {
        reject(error)
      })
    }).catch(err => {
      throw err;
    })

  }
  addGroupMembers(memberList, groupId) {
    return new Promise((resolve, reject) => {
      let members = []
      _.forEach(memberList, function (member) {
        let memberData = new CassandraModel.instance.GroupMember({
          groupid: groupId.toString(),
          userid: member.userId,
          roles: member.roles,
          status: 1,
          scope: '*',
          joiningdate: Date.now().toString(),
          createddate: Date.now().toString(),
          updateddate: Date.now().toString()
        })
        members.push(memberData.save({
          return_query: true
        }))
      })
      CassandraModel.doBatch(members, function (err) {
        if (err) {
          reject(err)
        } else {
          resolve(true)
        }
      })
    }).catch(err => {
      throw err;
    })

  }

  getGroup(contextType, contextId) {
    return new Promise((resolve, reject) => {
      this.cassandraModel.instance.Group.findOne({
        contextid: contextId,
        contexttype: contextType
      }, {
        raw: true,
        allow_filtering: true
      }, function (err, group) {
        if (err) {
          reject(err)
        }
        resolve(group)
      })
    }).catch(err => {
      throw err;
    })

  }

  getThreadConfig(threadId) {
    return new Promise((resolve, reject) => {
      this.cassandraModel.instance.ThreadConfig.findOne({
        threadid: threadId
      }, {
        raw: true,
        allow_filtering: true
      }, function (err, thread) {
        if (err) {
          console.log(err);
          reject(err)
        }
        resolve(thread)
      })
    }).catch(err => {
      console.log("err1", err);

      throw err;
    })

  }

  addThreadConfig(groupId, threadId, userId, config) {
    return new Promise((resolve, reject) => {

      let groupMemberData = new CassandraModel.instance.GroupMember({
        groupid: groupId.toString(),
        userid: userId,
        roles: ['owner'],
        status: 1,
        scope: threadId.toString(),
        joiningdate: Date.now().toString(),
        createddate: Date.now().toString(),
        updateddate: Date.now().toString()
      })

      let threadConfig = new CassandraModel.instance.ThreadConfig({
        threadid: threadId.toString(),
        groupid: groupId.toString(),
        config: Buffer.from(JSON.stringify(config)),
        createddate: Date.now().toString(),
        updateddate: Date.now().toString()
      })
      threadConfig.save(function (err) {
        if (err) {
          console.log(err)
          reject(err)
        } else {
          groupMemberData.save(function (err) {
            if (err) {
              console.log(err)
              reject(err)
            } else {
              resolve(true)
            }
          })
        }
      })
    }).catch(err => {
      throw err;
    })

  }

  getGroupMemberByUserId(userId, threadId) {
    return new Promise((resolve, reject) => {
      this.cassandraModel.instance.GroupMember.findOne({
        userid: userId,
        scope: threadId
      }, {
        raw: true,
        allow_filtering: true
      }, function (err, groupMember) {
        if (err) {
          reject(err)
        }
        resolve(groupMember)
      })
    }).catch(err => {
      throw err;
    })

  }

  checkModerationAccess(threadId, userId) {
    return new Promise((resolve, reject) => {
      let groupMember = await (this.getGroupMemberByUserId(userId, threadId))
      if (groupMember && groupMember.roles && (groupMember.roles.indexOf('owner') >= 0 || groupMember.roles.indexOf('moderator') >= 0)) {
        resolve(true)
      } else {
        resolve(false)
      }
    }).catch(err => {
      throw err;
    })

  }

}

module.exports = GroupService
