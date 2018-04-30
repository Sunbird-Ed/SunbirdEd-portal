'use strict'

angular.module('playerApp')
  .controller('TextBookController', ['contentService', '$timeout', '$state', 'config',
    '$rootScope', 'toasterService', 'searchService', 'configService', 'telemetryService', '$scope',
    function (contentService, $timeout, $state, config, $rootScope, toasterService,
      searchService, configService, telemetryService, $scope) {
      var textbook = this
      textbook.categoryListofFramework = {}
      textbook.categoryModelList = {}
      textbook.formDropdown = configService.getWorkspaceFormDropdown()
      textbook.years = textbook.formDropdown.years
      textbook.showCreateTextBookModal = false
      textbook.isTextBookCreated = false
      textbook.userId = $rootScope.userId
      textbook.mimeType = 'application/vnd.ekstep.content-collection'
      textbook.defaultName = 'Untitled textbook'
      textbook.contentType = 'TextBook'
      textbook.resourceType = 'Book'

      textbook.hideCreateTextBookModal = function () {
        $('#createTextBookModal').modal('hide')
        $('#createTextBookModal').modal('hide others')
        $('#createTextBookModal').modal('hide dimmer')
      }

      textbook.initializeModal = function () {
        textbook.showCreateTextBookModal = true
        telemetryService.impressionTelemetryData('workspace', '', 'textbook', '1.0', 'scroll',
          'workspace-create-textbook', '/create/textbook')
        $timeout(function () {
          $('#createTextBookModal')
            .modal({
              observeChanges: true,
              onHide: function () {
                textbook.data = {}
                if (!textbook.isTextBookCreated) {
                  $state.go('WorkSpace.ContentCreation')
                }
              }
            })
            .modal('show')
        })
      }

      textbook.createContent = function (requestData) {
        textbook.loader = toasterService.loader('', $rootScope.messages.stmsg.m0014)
        contentService.create(requestData).then(function (res) {
          if (res && res.responseCode === 'OK') {
            textbook.isTextBookCreated = true
            textbook.showCreateTextBookModal = false
            textbook.loader.showLoader = false
            textbook.hideCreateTextBookModal()
            telemetryService.interactTelemetryData('workspace', res.result.content_id, 'create-textbook',
              textbook.version, 'create-textbook', 'workspace-create-textbook')
            textbook.initEKStepCE(res.result.content_id)
          } else {
            textbook.loader.showLoader = false
            toasterService.error($rootScope.messages.fmsg.m0008)
          }
        }).catch(function () {
          textbook.loader.showLoader = false
          toasterService.error($rootScope.messages.fmsg.m0008)
        })
      }

      textbook.saveMetaData = function (data, framework) {
        textbook.framework = framework
        var requestBody = angular.copy(data)
        requestBody.name = requestBody.name ? requestBody.name : textbook.defaultName
        requestBody.mimeType = textbook.mimeType
        requestBody.createdBy = textbook.userId
        requestBody.contentType = textbook.contentType
        requestBody.framework = textbook.framework
        requestBody.resourceType = textbook.resourceType
        if (requestBody.gradeLevel && requestBody.gradeLevel[0] === '') {
          delete requestBody['gradeLevel']
        }
        if (requestBody.language) {
          requestBody.language = [requestBody.language]
        }
        var requestData = {
          content: requestBody
        }
        textbook.createContent(requestData)
      }

      textbook.initEKStepCE = function (contentId) {
        var params = { contentId: contentId, type: 'TextBook', state: '', framework: textbook.framework }
        $state.go('CollectionEditor', params)
      }

      var CreateTextBookFromDataDrivenForm = $rootScope.$on('CreateTextbook',
        function (event, args) {
          textbook.saveMetaData(args.Data, args.framework)
        })

      $scope.$on('$destroy', function () {
        CreateTextBookFromDataDrivenForm()
      })
    }
  ])
