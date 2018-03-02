'use strict'

angular.module('playerApp')
  .controller('BatchUpdateController', ['$rootScope', '$timeout', '$state', '$scope', '$stateParams',
    'config', 'batchService', '$filter', 'toasterService', 'userService', 'permissionsService',
    function ($rootScope, $timeout, $state, $scope,
      $stateParams, config, batchService, $filter, toasterService, userService, permissionsService) {
      var batchUpdate = this
      batchUpdate.userList = []
      batchUpdate.menterList = []
      batchUpdate.userId = $rootScope.userId
      batchUpdate.submitted = false
      batchUpdate.batchId = $stateParams.batchId
      batchUpdate.coursecreatedby = $stateParams.coursecreatedby
      batchUpdate.searchUserMap = {}
      batchUpdate.userSearchTime = 0
      batchUpdate.selectedUsers = []
      batchUpdate.selectedMentors = []

      batchUpdate.init = function () {
        batchUpdate.getBatchDetails()
        batchUpdate.getUserList()
      }

      batchUpdate.getSelectedUser = function (participant) {
        var users = []
        for (var key in participant) {
          if (participant[key]) {
            users.push(key)
          }
        }
        return users
      }

      batchUpdate.getBatchDetails = function () {
        batchUpdate.batchData = batchService.getBatchData()
        if (_.isEmpty(batchUpdate.batchData)) {
          batchService.getBatchDetails({ batchId: batchUpdate.batchId }).then(function (response) {
            if (response && response.responseCode === 'OK') {
              batchUpdate.batchData = response.result.response
              var selectedParticipants = batchUpdate.getSelectedUser(batchUpdate.batchData.participant)
              var users = _.concat(selectedParticipants, batchUpdate.batchData.mentors)
              batchUpdate.getUserList(undefined, users)
            } else {
              toasterService.error($rootScope.messages.fmsg.m0054)
            }
          }).catch(function () {
            toasterService.error($rootScope.messages.fmsg.m0054)
          })
        } else {
          var selectedParticipants = batchUpdate.getSelectedUser(batchUpdate.batchData.participant)
          var users = _.concat(selectedParticipants, batchUpdate.batchData.mentors)
          batchUpdate.getUserList(undefined, users)
        }
      }

      batchUpdate.showUpdateBatchModal = function (batchData, coursecreatedby) {
        batchUpdate.coursecreatedby = batchUpdate.coursecreatedby || batchUpdate.batchData.courseCreator
        _.forEach(batchUpdate.batchData.participant, function (value, key) {
          if (!_.isUndefined(_.find(batchUpdate.userList, ['id', key]))) {
            batchUpdate.selectedUsers.push(_.find(batchUpdate.userList, ['id', key]))
            batchUpdate.userList = _.reject(batchUpdate.userList, ['id', key])
            batchUpdate.selectedUsers = _.uniqBy(batchUpdate.selectedUsers, 'id')
          }
        })
        _.forEach(batchUpdate.batchData.mentors, function (mentorVal, key) {
          if (!_.isUndefined(_.find(batchUpdate.menterList, ['id', mentorVal]))) {
            batchUpdate.selectedMentors.push(_.find(batchUpdate.menterList, ['id', mentorVal]))
            batchUpdate.menterList = _.reject(batchUpdate.menterList, ['id', mentorVal])
            batchUpdate.selectedMentors = _.uniqBy(batchUpdate.selectedMentors, 'id')
          }
        })
        batchUpdate.isUserSearch = 0
        $('#users').dropdown('refresh')
        $('#mentors').dropdown('refresh')
        if (Object.keys(batchUpdate.searchUserMap).length <= 2) {
          batchUpdate.initializeUI()
        }
      }

      batchUpdate.initializeUI = function () {
        $timeout(function () {
          batchUpdate.initializeEvent()
          if (batchUpdate.batchData.enrollmentType === 'open') {
            $('input:radio[name="enrollmentType"]').filter('[value="open"]').attr('checked', true)
          } else {
            $('input:radio[name="enrollmentType"]').filter('[value="invite-only"]').attr('checked', true)
          }
          $('.ui.calendar').calendar({ refresh: true })
          var today = new Date()
          var startDate = new Date(batchUpdate.batchData.startDate)
          var currentDate = new Date(today.setDate(today.getDate() + 1))
          if (currentDate < startDate) {
            startDate = currentDate
          }
          $('#updateBatchModal').modal({
            closable: false,
            onShow: function () {
              $('.ui.calendar#rangestartAdd').calendar({
                type: 'date',
                minDate: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()),
                formatter: {
                  date: function (date, settings) {
                    return $filter('date')(date, 'yyyy-MM-dd')
                  }
                },
                onChange: function (date, text, mode) {
                  batchUpdate.batchData.startDate = text
                  $('.ui.calendar#rangeendAdd').calendar({
                    type: 'date',
                    minDate: new Date(startDate.getFullYear(), startDate.getMonth(), parseInt(startDate.getDate()) + 1),
                    formatter: {
                      date: function (date, settings) {
                        return $filter('date')(date, 'yyyy-MM-dd')
                      }
                    },
                    onChange: function (date, text, mode) {
                      batchUpdate.batchData.endDate = text
                    }
                  })
                }

              })
              $('.ui.calendar#rangeendAdd').calendar({
                type: 'date',
                minDate: new Date(startDate.getFullYear(), startDate.getMonth(), parseInt(startDate.getDate()) + 1),
                formatter: {
                  date: function (date, settings) {
                    return $filter('date')(date, 'yyyy-MM-dd')
                  }
                },
                startCalendar: $('.ui.calendar#rangestartAdd'),
                onChange: function (date, text, mode) {
                  batchUpdate.batchData.endDate = text
                }
              })
              $('.ui.calendar #startDate').val(batchUpdate.batchData.startDate)
              $('.ui.calendar #endDate').val(batchUpdate.batchData.endDate)
              $('.ui.modal.transition.hidden').remove()
            },
            onHide: function () {
              var previousUrl = JSON.parse(window.localStorage.getItem('previousURl'))
              if ($stateParams.name !== previousUrl.name) {
                $state.go(previousUrl.name, previousUrl.params)
              } else {
                $state.go('Toc', { courseId: batchUpdate.batchData.courseId, lectureView: 'yes' })
              }
            }
          }).modal('show')
        }, 10)
      }
      batchUpdate.clearForm = function () {
        $('#updateBatch').form('clear')
        $('#updateBatch').find('.search').val('')
      }

      batchUpdate.initializeEvent = function () {
        $('#users,#mentors').dropdown({ forceSelection: false, fullTextSearch: true })
        $('#users input.search').on('keyup', function (e) {
          batchUpdate.isUserSearch = 1
          batchUpdate.getUserListWithQuery(this.value)
        })
        $('#mentors input.search').on('keyup', function (e) {
          batchUpdate.isUserSearch = 2
          batchUpdate.getUserListWithQuery(this.value)
        })
      }

      batchUpdate.getUserListWithQuery = function (query) {
        if (batchUpdate.userSearchTime) {
          clearTimeout(batchUpdate.userSearchTime)
        }
        batchUpdate.userSearchTime = setTimeout(function () {
          var users = batchUpdate.searchUserMap[query]
          if (users) {
            batchUpdate.isUserSearch = 0
            batchUpdate.userList = users.user
            batchUpdate.menterList = users.mentor
            $('#users').dropdown('refresh')
            $('#mentors').dropdown('refresh')
          } else {
            batchUpdate.getUserList(query)
          }
        }, 1000)
      }

      batchUpdate.getUserList = function (query, users) {
        var request = batchService.getRequestBodyForUserSearch(query, users)
        batchService.getUserList(request).then(function (response) {
          if (response && response.responseCode === 'OK') {
            _.forEach(response.result.response.content, function (userData) {
              if (userData.identifier !== $rootScope.userId) {
                if (batchService.filterUserSearchResult(userData, query)) {
                  var user = {
                    id: userData.identifier,
                    name: userData.firstName + (userData.lastName ? ' ' + userData.lastName : ''),
                    avatar: userData.avatar,
                    otherDetail: batchService.getUserOtherDetail(userData)
                  }
                  _.forEach(userData.organisations, function (userOrgData) {
                    if (_.indexOf(userOrgData.roles, 'COURSE_MENTOR') !== -1) {
                      batchUpdate.menterList.push(user)
                    }
                  })
                  batchUpdate.userList.push(user)
                }
              }
            })
            batchUpdate.userList = _.uniqBy(batchUpdate.userList, 'id')
            batchUpdate.menterList = _.uniqBy(batchUpdate.menterList, 'id')
            if (!users) {
              batchUpdate.searchUserMap[query || ''] = {
                mentor: _.clone(batchUpdate.menterList),
                user: _.clone(batchUpdate.userList)
              }
            }
            batchUpdate.isUserSearch = 0
            batchUpdate.showUpdateBatchModal()
          } else {
            batchUpdate.isUserSearch = 0
            toasterService.error($rootScope.messages.fmsg.m0056)
          }
        }).catch(function () {
          batchUpdate.isUserSearch = 0
          toasterService.error($rootScope.messages.fmsg.m0056)
        })
      }

      batchUpdate.hideUpdateBatchModal = function () {
        $('#updateBatchModal').modal('hide')
        $('#updateBatchModal').modal('hide others')
        $('#updateBatchModal').modal('hide dimmer')
      }

      batchUpdate.updateBatchDetails = function (data) {
        if ($scope.updateBatch.$valid) {
          var request = {
            request: {
              name: data.name,
              description: data.description,
              enrollmentType: data.enrollmentType,
              startDate: data.startDate,
              endDate: data.endDate,
              createdFor: data.createdFor,
              id: data.id
            }
          }
          if (data.enrollmentType !== 'open') {
            data.mentors = $('#mentorSelList').val().split(',')
            var selected = []
            _.forEach(batchUpdate.selectedMentors, function (value) {
              selected.push(value.id)
            })
            request.request.mentors = _.concat(_.compact(data.mentors), selected)
          }
          batchService.update(request).then(function (response) {
            if (response && response.responseCode === 'OK') {
              if (data.enrollmentType !== 'open') {
                data.users = _.compact($('#userSelList').val().split(','))
                if (data.users && data.users.length > 0) {
                  var userRequest = {
                    request: {
                      userIds: data.users
                    }
                  }
                  batchService.addUsers(userRequest, data.id).then(function (response) {
                    if (response && response.responseCode === 'OK') {
                      batchUpdate.hideUpdateBatchModal()
                    } else {
                      toasterService.error($rootScope.messages.fmsg.m0053)
                    }
                  }).catch(function () {
                    toasterService.error($rootScope.messages.fmsg.m0053)
                  })
                } else {
                  batchUpdate.hideUpdateBatchModal()
                }
              } else {
                batchUpdate.hideUpdateBatchModal()
              }
            } else {
              toasterService.error($rootScope.messages.fmsg.m0055)
            }
          }).catch(function (ex) {
            toasterService.error($rootScope.messages.fmsg.m0055)
          })
        }
      }
    }
  ])
