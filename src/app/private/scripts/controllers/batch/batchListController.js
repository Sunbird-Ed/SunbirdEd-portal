'use strict'

angular.module('playerApp')
  .controller('BatchListController', ['$rootScope', 'toasterService', 'batchService', '$state',
    'userService', 'PaginationService', 'permissionsService', 'telemetryService',
    function ($rootScope, toasterService, batchService, $state, userService, PaginationService,
      permissionsService, telemetryService) {
      var batch = this
      batch.userId = $rootScope.userId
      batch.list = []
      batch.status = 1
      batch.statusOptions = [
        { name: 'Ongoing Batches', value: 1 },
        { name: 'Upcoming Batches', value: 0 },
        { name: 'Previous Batches', value: 2 }
      ]
      $('#batchStatusOptions').dropdown()
      batch.pageLimit = 9
      batch.pager = {}

      function showErrorMessage (isClose, message, messageType, messageText) {
        var error = {}
        error.showError = true
        error.isClose = isClose
        error.message = message
        error.messageType = messageType
        if (messageText) {
          error.messageText = messageText
        }
        return error
      }

      batch.listBatches = function (pageNumber) {
        pageNumber = pageNumber || 1
        var req = {
          request: {
            filters: {
              status: batch.status.toString(),
              createdFor: permissionsService.getRoleOrgMap() && permissionsService.getRoleOrgMap()['COURSE_MENTOR'],
              createdBy: batch.userId
            },
            sort_by: { createdDate: 'desc' },
            offset: (pageNumber - 1) * batch.pageLimit,
            limit: batch.pageLimit
          }
        }

        batchService.getAllBatchs(req).then(function (response) {
          if (response && response.responseCode === 'OK') {
            batch.userList = []
            batch.userNames = []
            batch.participants = []
            _.forEach(response.result.response.content, function (val) {
              batch.userList.push(val.createdBy)
              batch.participants[val.id] = !_.isUndefined(val.participant) ? _.size(val.participant) : 0
            })
            batch.userList = _.compact(_.uniq(batch.userList))
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
                  batch.userNames[val.identifier] = val.firstName + ' ' + val.lastName
                })
              } else {
                toasterService.error($rootScope.messages.fmsg.m0056)
              }
            }).catch(function () {
              toasterService.error($rootScope.messages.fmsg.m0056)
            })
            batch.batchList = response.result.response.content || []
            batch.totalCount = response.result.response.count
            batch.pager = PaginationService.GetPager(response.result.response.count,
              pageNumber, batch.pageLimit)
            if (batch.batchList.length === 0) {
              batch.error = showErrorMessage(true,
                $rootScope.messages.stmsg.m0020,
                $rootScope.messages.stmsg.m0008)
            } else {
              batch.error = {}
            }
          } else {
            toasterService.error($rootScope.messages.fmsg.m0004)
          }
        }).catch(function () {
          toasterService.error($rootScope.messages.fmsg.m0004)
        })
      }

      batch.listBatches()

      batch.showUpdateBatchModal = function (batchData) {
        batchService.setBatchData(batchData)
        $state.go('updateBatch', { batchId: batchData.identifier })
      }

      batch.setPage = function (page) {
        if (page < 1 || page > batch.pager.totalPages) {
          return
        }
        batch.listBatches(page)
      }

      // telemetry intaract event
      batch.generateInteractEvent = function (edataId, batchId) {
        telemetryService.interactTelemetryData('workspace', batchId, edataId, '1.0',
          edataId, 'workspace-course-batches')
      }

      // telemetry visit spec
      var inviewLogs = []
      batch.lineInView = function (index, inview, item, section) {
        var obj = _.filter(inviewLogs, function (o) {
          return o.objid === item.identifier
        })
        if (inview === true && obj.length === 0) {
          inviewLogs.push({
            objid: item.identifier,
            objtype: 'batch',
            section: section,
            index: index
          })
        }
        console.log('------', inviewLogs)
        telemetryService.setVisitData(inviewLogs)
      }
    }
  ])
