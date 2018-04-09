'use strict'

angular.module('playerApp')
  .controller('BatchController', ['$rootScope', '$timeout', '$state', '$scope', '$stateParams',
    'batchService', '$filter', 'permissionsService', 'toasterService', 'courseService',
    'learnService', '$window', 'userService', 'telemetryService',
    function ($rootScope, $timeout, $state, $scope, $stateParams, batchService, $filter,
      permissionsService, toasterService, courseService, learnService, $window, userService,
      telemetryService) {
      var batch = this
      batch.userList = []
      batch.menterList = []
      batch.userId = $rootScope.userId
      batch.courseId = $stateParams.courseId
      batch.coursecreatedby = $stateParams.coursecreatedby
      batch.submitted = false
      batch.showBatchCard = $scope.showbatchcard
      batch.quantityOfBatchs = 3
      batch.isMentor = false
      batch.status = 1
      batch.batchInfo = ''
      batch.statusOptions = [
        { name: 'Ongoing', value: 1 },
        { name: 'Upcoming', value: 0 }
      ]
      batch.showEnroll = true
      batch.searchUserMap = {}
      batch.userSearchTime = 0

      batch.showCreateBatchModal = function () {
        batch.getUserList()
        $timeout(function () {
          batch.data = { enrollmentType: 'invite-only' }
          $('input:radio[name="enrollmentType"]').filter('[value="invite-only"]').attr('checked', true)
          $('#users,#mentors').dropdown({ forceSelection: false, fullTextSearch: true })
          $('.ui.calendar').calendar({ refresh: true })
          $('#createBatchModal').modal({
            closable: false,
            onShow: function () {
              var today = new Date()
              $('.ui.calendar#rangestartAdd').calendar({
                type: 'date',
                minDate: new Date(today.setDate(today.getDate())),
                formatter: {
                  date: function (date, settings) {
                    return $filter('date')(date, 'yyyy-MM-dd')
                  }
                },
                onChange: function (date, text, mode) {
                  if (_.isUndefined(batch)) {
                    batch = { data: { startDate: text } }
                  } else if (_.isUndefined(batch.data)) {
                    batch.data = { startDate: text }
                  } else {
                    batch.data.startDate = text
                  }
                  $('.ui.calendar#rangeendAdd').calendar({
                    type: 'date',
                    minDate: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
                    formatter: {
                      date: function (date, settings) {
                        return $filter('date')(date, 'yyyy-MM-dd')
                      }
                    },
                    onChange: function (date, text, mode) {
                      if (_.isUndefined(batch)) {
                        batch = { data: { endDate: text } }
                      } else if (_.isUndefined(batch.data)) {
                        batch.data = { endDate: text }
                      } else {
                        batch.data.endDate = text
                      }
                    }
                  })
                }

              })
              $('.ui.calendar#rangeendAdd').calendar({
                type: 'date',
                minDate: new Date(today.setDate(today.getDate() + 1)),
                formatter: {
                  date: function (date, settings) {
                    return $filter('date')(date, 'yyyy-MM-dd')
                  }
                },
                startCalendar: $('.ui.calendar#rangestartAdd')
              })
              $('.ui.modal.transition.hidden').remove()
            },
            onHide: function () {
              var previousUrl = JSON.parse(window.localStorage.getItem('previousURl'))
              $state.go(previousUrl.name, previousUrl.params)
            }
          }).modal('show')
        }, 10)
      }

      batch.hideCreateBatchModal = function () {
        $('#createBatchModal').modal('hide')
        $('#createBatchModal').modal('hide others')
        $('#createBatchModal').modal('hide dimmer')
      }

      batch.addBatch = function (data) {
        if ($scope.createBatch.$valid) {
          if (data.enrollmentType !== 'open') {
            data.users = $('#users').dropdown('get value').split(',')
            data.mentors = $('#mentors').dropdown('get value').split(',')
          } else {
            data.users = []
            data.mentors = []
          }
          var request = {
            request: {
              courseId: batch.courseId,
              name: data.name,
              description: data.description,
              enrollmentType: data.enrollmentType,
              startDate: data.startDate,
              endDate: data.endDate,
              createdBy: batch.userId,
              createdFor: $rootScope.organisationIds,
              mentors: _.compact(data.mentors)
            }
          }
          batchService.create(request).then(function (response) {
            if (response && response.responseCode === 'OK') {
              if (data.users && data.users.length > 0) {
                var userRequest = {
                  request: {
                    userIds: _.compact(data.users)
                  }
                }
                $timeout(function () {
                  batchService.addUsers(userRequest, response.result.batchId).then(function (response) {
                    if (response && response.responseCode === 'OK') {
                      batch.getCouserBatchesList()
                      batch.hideCreateBatchModal()
                    } else {
                      toasterService.error($rootScope.messages.fmsg.m0053)
                    }
                  }).catch(function () {
                    toasterService.error($rootScope.messages.fmsg.m0053)
                  })
                }, 100)
              } else {
                batch.hideCreateBatchModal()
              }
            } else {
              toasterService.error($rootScope.messages.fmsg.m0052)
            }
          }).catch(function () {
            toasterService.error($rootScope.messages.fmsg.m0052)
          })
        }
      }

      batch.clearBatchData = function () {
        $('#createBatch').form('clear')
        $('#createBatch').find('.search').val('')
      }

      batch.getCouserBatchesList = function () {
        var request = {
          request: {
            filters: {
              courseId: batch.courseId
            },
            sort_by: { createdDate: 'desc' }
          }
        }
        request.request.filters.status = (_.isUndefined(batch.status)) ? '1' : batch.status.toString()
        if (_.intersection(permissionsService.getCurrentUserRoles(),
          ['COURSE_MENTOR']).length > 0) {
          batch.isMentor = true
          request.request.filters.createdBy = batch.userId
        } else {
          request.request.filters.enrollmentType = 'open'
        }
        batchService.getAllBatchs(request).then(function (response) {
          if (response && response.responseCode === 'OK') {
            batch.userList = []
            batch.userNames = {}
            _.forEach(response.result.response.content, function (val) {
              batch.userList.push(val.createdBy)
            })
            batch.userList = _.compact(_.uniq(batch.userList))
            if (batch.userList.length > 0) {
              var req = {
                request: {
                  filters: {
                    identifier: batch.userList
                  }
                }
              }
              batchService.getUserList(req).then(function (res) {
                if (res && res.responseCode === 'OK') {
                  _.forEach(res.result.response.content, function (val) {
                    batch.userNames[val.identifier] = val
                  })
                  batch.batchList = response.result.response.content || []
                } else {
                  toasterService.error($rootScope.messages.fmsg.m0056)
                }
              }).catch(function () {
                toasterService.error($rootScope.messages.fmsg.m0056)
              })
            } else {
              batch.batchList = response.result.response.content || []
            }
          } else {
            toasterService.error($rootScope.messages.fmsg.m0004)
          }
        }).catch(function () {
          toasterService.error($rootScope.messages.fmsg.m0004)
        })
      }

      batch.showUpdateBatchModal = function (batchData, coursecreatedby) {
        batchService.setBatchData(batchData)
        $state.go('updateBatch', { batchId: batchData.identifier, coursecreatedby: coursecreatedby })
      }

      // User search status = 1, Mentor search status = 2, Normal status = 0
      $timeout(function () {
        $('#users').dropdown({
          forceSelection: false,
          fullTextSearch: true,
          onAdd: function () {
            $('#createBatchModal').modal('refresh')
            batch.isUserSearch = 1
            batch.getUserListWithQuery('')
          }
        })
        $('#mentors').dropdown({
          fullTextSearch: true,
          forceSelection: false,
          onAdd: function () {
            $('#createBatchModal').modal('refresh')
            batch.isUserSearch = 2
            batch.getUserListWithQuery('')
          }
        })
        $('#users input.search').on('keyup', function (e) {
          batch.isUserSearch = 1
          batch.getUserListWithQuery(this.value)
        })
        $('#mentors input.search').on('keyup', function (e) {
          batch.isUserSearch = 2
          batch.getUserListWithQuery(this.value)
        })
      }, 1000)

      batch.getUserListWithQuery = function (query) {
        if (batch.userSearchTime) {
          clearTimeout(batch.userSearchTime)
        }
        batch.userSearchTime = setTimeout(function () {
          var users = batch.searchUserMap[query]
          if (users) {
            batch.isUserSearch = 0
            batch.userList = users.user
            batch.menterList = users.mentor
            $('#users').dropdown('refresh')
            $('#mentors').dropdown('refresh')
          } else {
            batch.getUserList(query)
          }
        }, 1000)
      }

      batch.getUserList = function (query) {
        var request = batchService.getRequestBodyForUserSearch(query)
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
                      batch.menterList.push(user)
                    }
                  })
                  batch.userList.push(user)
                }
              }
            })
            batch.userList = _.uniqBy(batch.userList, 'id')
            batch.menterList = _.uniqBy(batch.menterList, 'id')
            batch.searchUserMap[query || ''] = {
              mentor: _.clone(batch.menterList),
              user: _.clone(batch.userList)
            }
            $('#users').dropdown('refresh')
            $('#mentors').dropdown('refresh')
            batch.isUserSearch = 0
          } else {
            batch.isUserSearch = 0
            toasterService.error($rootScope.messages.fmsg.m0056)
          }
        }).catch(function () {
          batch.isUserSearch = 0
          toasterService.error($rootScope.messages.fmsg.m0056)
        })
      }

      batch.showBatchDetails = function (batchData) {
        batch.participants = {}
        if (!_.isUndefined(batchData.participant)) {
          var req = {
            request: {
              filters: {
                identifier: _.keys(batchData.participant)
              }
            }
          }
          batchService.getUserList(req).then(function (res) {
            if (res && res.responseCode === 'OK') {
              _.forEach(res.result.response.content, function (val) {
                batch.participants[val.identifier] = val
              })
              batchData.userList = batch.participants
              console.log('batchData ', batchData)
              $rootScope.$broadcast('batchDetails', batchData)
              $('#batchDetails').modal('show')
            } else {
              toasterService.error($rootScope.messages.fmsg.m0056)
            }
          }).catch(function () {
            toasterService.error($rootScope.messages.fmsg.m0056)
          })
        } else {
          $rootScope.$broadcast('batchDetails', batchData)
          $('#batchDetails').modal('show')
        }
        // batchData.userList = batch.userNames;
        // console.log('batchData ', batchData);
        // $rootScope.$broadcast('batchDetails', batchData);
        // $('#batchDetails').modal('show');
      }

      batch.enrollUserToCourse = function (batchId) {
        var req = {
          request: {
            courseId: batch.courseId,
            userId: batch.userId,
            batchId: batchId
          }
        }
        courseService.enrollUserToCourse(req).then(function (response) {
          if (response && response.responseCode === 'OK') {
            batch.showEnroll = false
            toasterService.success($rootScope.messages.smsg.m0036)
            $timeout(function () {
              $window.location.reload()
            }, 2000)
          } else {
            toasterService.error($rootScope.messages.emsg.m0001)
          }
        }).catch(function () {
          toasterService.error($rootScope.messages.emsg.m0001)
        })
      }
    }
  ])
