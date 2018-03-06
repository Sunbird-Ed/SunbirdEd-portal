'use strict'

angular.module('playerApp')
  .controller('PreviewContentController', ['$stateParams', '$rootScope', '$state', 'contentService',
    '$timeout', 'config', 'toasterService', function ($stateParams, $rootScope, $state, contentService, $timeout,
      config, toasterService) {
      var previewContent = this
      previewContent.contentProgress = 0
      previewContent.contentId = $stateParams.contentId
      previewContent.userId = $rootScope.userId
      previewContent.isShowPublishRejectButton =
                                    $stateParams.backState === 'WorkSpace.UpForReviewContent'
      previewContent.isShowDeleteButton =
                                    $stateParams.backState === 'WorkSpace.PublishedContent'
      previewContent.isShowFlagActionButton =
                                    $stateParams.backState === 'WorkSpace.FlaggedContent'

      var validateModal = {
        state: ['WorkSpace.UpForReviewContent', 'WorkSpace.ReviewContent',
          'WorkSpace.PublishedContent', 'WorkSpace.FlaggedContent'],
        status: ['Review', 'Live', 'Flagged'],
        mimeType: config.MimeTypeExceptCollection
      }
      previewContent.contentPlayer = { isContentPlayerEnabled: false }
      previewContent.redirectUrl = $stateParams.backState

      function checkContentAccess (reqData, validateData) {
        var status = reqData.status
        var createdBy = reqData.createdBy
        var state = reqData.state
        var userId = reqData.userId
        var validateDataStatus = validateData.status
        var isMime = _.indexOf(validateData.mimeType, reqData.mimeType) > -1
        if (isMime) {
          var isStatus = _.indexOf(validateDataStatus, status) > -1
          var isState = _.indexOf(validateData.state, state) > -1
          if (isStatus && isState && createdBy !== userId) {
            return true
          } else if (isStatus && isState && createdBy === userId) {
            return true
          } else if (isStatus && createdBy === userId) {
            return true
          }
          return false
        }
        return false
      }

      function showPlayer (data) {
        var rspData = data
        rspData.state = $stateParams.backState
        rspData.userId = $rootScope.userId

        if (!checkContentAccess(rspData, validateModal)) {
          toasterService
            .warning($rootScope.messages.imsg.m0004)
          $state.go('Home')
        }
        previewContent.contentData = data
        previewContent.contentPlayer.contentData = data
        previewContent.contentPlayer.isContentPlayerEnabled = true
      }

      previewContent.getContent = function (contentId) {
        previewContent.loader = toasterService.loader('', $rootScope.messages.stmsg.m0025)
        var req = { contentId: contentId }
        var qs = {
          fields: 'name,description,appIcon,contentType,mimeType,artifactUrl,' +
                            'versionKey,audience,language,gradeLevel,ageGroup,subject,' +
                            'medium,author,domain,createdBy,flagReasons,flaggedBy,flags,status,' +
                            'createdOn,lastUpdatedOn,body'
        }

        if ($stateParams.backState === 'WorkSpace.UpForReviewContent' ||
        $stateParams.backState === 'WorkSpace.ReviewContent') {
          qs.mode = 'edit'
        }
        contentService.getById(req, qs).then(function (response) {
          if (response && response.responseCode === 'OK') {
            previewContent.errorObject = {}
            previewContent.loader.showLoader = false
            showPlayer(response.result.content)
          } else {
            previewContent.loader.showLoader = false
            toasterService.error($rootScope.messages.fmsg.m0015)
          }
        }).catch(function () {
          previewContent.loader.showLoader = false
          toasterService.error($rootScope.messages.fmsg.m0015)
        })
      }

      previewContent.getContent(previewContent.contentId)

      previewContent.publishContent = function () {
        var request = {
          content: {
            lastPublishedBy: previewContent.userId
          }
        }
        previewContent.loader = toasterService.loader('', $rootScope.messages.stmsg.m0029)

        contentService.publish(request, previewContent.contentId).then(function (res) {
          if (res && res.responseCode === 'OK') {
            previewContent.loader.showLoader = false
            previewContent.isShowPublishRejectButton = false
            previewContent.contentData.status = 'Live'
            toasterService.success($rootScope.messages.smsg.m0004)
            //                $state.go("WorkSpace.UpForReviewContent")
          } else {
            previewContent.loader.showLoader = false
            toasterService.error($rootScope.messages.fmsg.m0019)
          }
        }).catch(function () {
          previewContent.loader.showLoader = false
          toasterService.error($rootScope.messages.fmsg.m0019)
        })
      }

      previewContent.rejectContent = function () {
        previewContent.loader = toasterService.loader('', $rootScope.messages.stmsg.m0030)

        var request = {}
        contentService.reject(request, previewContent.contentId).then(function (res) {
          if (res && res.responseCode === 'OK') {
            previewContent.loader.showLoader = false
            previewContent.isShowPublishRejectButton = false
            toasterService.success($rootScope.messages.smsg.m0005)
            //                $state.go("WorkSpace.UpForReviewContent");
          } else {
            previewContent.loader.showLoader = false
            toasterService.error($rootScope.messages.fmsg.m0020)
          }
        }).catch(function () {
          previewContent.loader.showLoader = false
          toasterService.error($rootScope.messages.fmsg.m0020)
        })
      }

      previewContent.deleteContent = function () {
        previewContent.loader = toasterService.loader('', $rootScope.messages.stmsg.m0034)
        var request = {
          contentIds: [previewContent.contentId]
        }
        contentService.retire(request).then(function (res) {
          if (res && res.responseCode === 'OK') {
            $timeout(function () {
              previewContent.loader.showLoader = false
              previewContent.isShowDeleteButton = false
              previewContent.isShowFlagActionButton = false
              toasterService.success($rootScope.messages.smsg.m0006)
              $state.go($stateParams.backState)
            }, 2000)
          } else {
            previewContent.loader.showLoader = false
            toasterService.error($rootScope.messages.fmsg.m0022)
          }
        }).catch(function () {
          previewContent.loader.showLoader = false
          toasterService.error($rootScope.messages.fmsg.m0022)
        })
      }

      previewContent.acceptContentFlag = function (contentData) {
        var request = {
          versionKey: contentData.versionKey
        }
        previewContent.loader = toasterService.loader('', $rootScope.messages.stmsg.m0040)

        contentService.acceptContentFlag(request, contentData.identifier).then(function (res) {
          if (res && res.responseCode === 'OK') {
            previewContent.loader.showLoader = false
            previewContent.isShowFlagActionButton = false
            previewContent.contentData.status = 'FlagDraft'
            toasterService.success($rootScope.messages.smsg.m0007)
            //     $state.go($stateParams.backState);
          } else {
            previewContent.loader.showLoader = false
            toasterService.error($rootScope.messages.fmsg.m0024)
          }
        }).catch(function () {
          previewContent.loader.showLoader = false
          toasterService.error($rootScope.messages.fmsg.m0024)
        })
      }

      previewContent.discardContentFlag = function (contentData) {
        var request = { }
        previewContent.loader = toasterService.loader('', $rootScope.messages.stmsg.m0041)

        contentService.discardContentFlag(request, contentData.identifier).then(function (res) {
          if (res && res.responseCode === 'OK') {
            previewContent.loader.showLoader = false
            previewContent.isShowFlagActionButton = false
            previewContent.contentData.status = 'Live'
            toasterService.success($rootScope.messages.smsg.m0008)
            //     $state.go($stateParams.backState);
          } else {
            previewContent.loader.showLoader = false
            toasterService.error($rootScope.messages.fmsg.m0025)
          }
        }).catch(function () {
          previewContent.loader.showLoader = false
          toasterService.error($rootScope.messages.fmsg.m0025)
        })
      }

      previewContent.getConceptsNames = function (concepts) {
        var conceptNames = _.map(concepts, 'name').toString()
        if (conceptNames.length < concepts.length) {
          var filteredConcepts = _.filter($rootScope.concepts, function (p) {
            return _.includes(concepts, p.identifier)
          })
          conceptNames = _.map(filteredConcepts, 'name').toString()
        }
        return conceptNames
      }

      // Restore default values(resume course, view dashboard) onAfterUser leave current state
      $('#courseDropdownValues').dropdown('restore defaults')
    }])
