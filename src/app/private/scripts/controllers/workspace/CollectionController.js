'use strict'

angular.module('playerApp')
  .controller('CollectionController', ['contentService', '$timeout', '$state', 'config',
    '$rootScope', 'toasterService', '$scope', function (contentService, $timeout, $state, config,
      $rootScope, toasterService, $scope) {
      var collection = this
      collection.showCreateCollectionModel = false
      collection.isCollectionCreated = false
      collection.userId = $rootScope.userId
      collection.mimeType = 'application/vnd.ekstep.content-collection'
      collection.defaultName = 'Untitled collection'
      collection.contentType = 'Collection'
      collection.resourceType = ['Collection']

      collection.initializeModal = function () {
        collection.showCreateCollectionModel = true
        $timeout(function () {
          $('#createCollectionModel').modal({
            observeChanges: true,
            onHide: function () {
              collection.data = {}
              if (!collection.isCollectionCreated) {
                $state.go('WorkSpace.ContentCreation')
              }
            }
          }).modal('show')
        }, 10)
      }

      collection.hideCreateCollectionModel = function () {
        $('#createCollectionModel').modal('hide')
        $('#createCollectionModel').modal('hide others')
        $('#createCollectionModel').modal('hide dimmer')
      }

      collection.createCollection = function (requestData) {
        collection.loader = toasterService.loader('', $rootScope.messages.stmsg.m0016)
        contentService.create(requestData).then(function (res) {
          if (res && res.responseCode === 'OK') {
            collection.isCollectionCreated = true
            collection.showCreateCollectionModel = false
            collection.loader.showLoader = false
            collection.hideCreateCollectionModel()
            collection.initEKStepCE(res.result.content_id)
          } else {
            collection.loader.showLoader = false
            toasterService.error($rootScope.messages.fmsg.m0010)
          }
        }).catch(function () {
          collection.loader.showLoader = false
          toasterService.error($rootScope.messages.fmsg.m0010)
        })
      }

      collection.saveMetaData = function (data, framework) {
        collection.framework = framework
        var requestBody = angular.copy(data)
        requestBody.name = requestBody.name ? requestBody.name : collection.defaultName
        requestBody.mimeType = collection.mimeType
        requestBody.createdBy = collection.userId
        requestBody.contentType = collection.contentType
        requestBody.resourceType = collection.resourceType
        requestBody.framework = collection.framework
        var requestData = {
          content: requestBody
        }
        collection.createCollection(requestData)
      }

      collection.initEKStepCE = function (contentId) {
        var params = { contentId: contentId, type: 'Collection', framework: collection.framework }
        $state.go('CollectionEditor', params)
      }
      var CreateCollectionFromDataDrivenForm = $rootScope.$on('CreateCollection',
        function (event, args) {
          collection.saveMetaData(args.Data, args.framework)
        })

      $scope.$on('$destroy', function () {
        CreateCollectionFromDataDrivenForm()
      })
    }])
