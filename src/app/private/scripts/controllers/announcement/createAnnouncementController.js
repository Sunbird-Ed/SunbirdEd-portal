'use strict'

angular.module('playerApp')
  .controller('createAnnouncementCtrl', ['$rootScope', '$scope', '$timeout', '$state', '$stateParams', 'config', 'toasterService',
    'permissionsService', 'dashboardService', 'announcementService',
    function ($rootScope, $scope, $timeout, $state, $stateParams, config, toasterService, permissionsService, dashboardService, announcementService) {
      // Initialize variables
      var createAnn = this

      // todo - use api to get values
      createAnn.org = ['Org 1', 'Org 2', 'Org 3']
      createAnn.announcementType = ['Type 1', 'Type 2', 'Type 3']
      createAnn.disableBtn = true
      createAnn.showUrlField = false
      createAnn.isLastStep = false
      createAnn.saveMeta = false
      createAnn.errorFlag = false
      createAnn.repeatableWebLinks = []
      createAnn.isMetaModified = false
      createAnn.stepNumber = 1
      createAnn.data = {}

      createAnn.config = {
        'geo': {
          'adopter': 'SERVICE',
          'service': 'geoService'
        }
      }

      createAnn.removeRicipients = function (item) {
        _.remove(createAnn.selectedReciepeient, function (arg) {
          if (arg.location == item.location) {
            item.selected = false,
              toasterService.info(item.location + ' location is removed sucessfully.')
            return arg.location
          }
        })
      }

      // Initialize modal
      createAnn.initializeModal = function () {
        $timeout(function () {
          $('#announcementType').dropdown({
            onChange: function (value, text, $choice) {
              createAnn.enableRecepientBtn()
            }
          })

          $('#orgDropdown').dropdown({
            // allowAdditions: true,
            onChange: function (value, text, $choice) {
              console.log($choice)
              createAnn.enableRecepientBtn()
            }
          })
        }, 100)

        $rootScope.$on('selected:items', function (evet, data) {
          console.info('data', data)
          createAnn.selectedReciepeient = data.geo
        })
      }

      createAnn.createAnnouncement = function () {
        $rootScope.$emit('component:init')
        $('#createAnnouncementModal').modal({
          closable: false,
          onHide: function () {
            // todo - Show confirmation before closing modal
            // if (!createAnn.isLastStep && !createAnn.saveMeta) {
            	if (!createAnn.saveMeta) {
              if (createAnn.isMetaModified && confirm('Changes that you made may not be saved.')) {
                createAnn.refreshFormValues()
                return true
              }

              if (!createAnn.isMetaModified) {
                return true
              }
              return false
            }
            return true
          }
        }).modal('show')
      }

      createAnn.addNewLink = function () {
        var newItemNo = createAnn.repeatableWebLinks.length + 1
        createAnn.repeatableWebLinks.push({ 'id': 'choice' + newItemNo })
        createAnn.showUrlField = true
      }

      createAnn.removeLink = function (index) {
        createAnn.repeatableWebLinks.splice(index, 1)
        delete createAnn.data.link[index]
        createAnn.showUrlField = createAnn.repeatableWebLinks.length != '0'
      }

      // Function to track back button change
      createAnn.previousStep = function () {
        createAnn.stepNumber--
      }

      // Function to preview announcement
      createAnn.previewAnn = function () {
        var linkArray = []
        angular.forEach(createAnn.data.link, function (value, key) {
          linkArray.push(value)
        })
        // todo - show announcement preview
        createAnn.previewData = { 'type': createAnn.data.type, 'links': linkArray, 'title': createAnn.data.title, 'description': createAnn.data.description, 'target': ['teachers'], 'attachments': [{ 'title': 'circular.pdf', 'downloadURL': 'https://linktoattachment', 'mimetype': 'application/pdf' }] }
      }

      // Function to confirm recipients
      createAnn.confirmRecipients = function () {
        $rootScope.$emit('get:selected:items')
        // todo - get select ricipients
      }

      // Function to enable / disable RecepientBtn
      createAnn.enableRecepientBtn = function () {
        if (createAnn.data.title && createAnn.data.from &&
          createAnn.data.type &&
          (createAnn.data.description || createAnn.attachment.length)) {
          createAnn.disableBtn = false
        } else {
          createAnn.disableBtn = true
        }
        createAnn.isMetaModified = true
      }

      createAnn.refreshFormValues = function () {
        createAnn.disableBtn = true
        createAnn.saveMeta = false
        createAnn.stepNumber = 1
        $('#announcementType').dropdown('restore defaults')
        $('#orgDropdown').dropdown('restore defaults')
        $('#createAnnouncementModal').modal('refresh')
        createAnn.data = {}
        createAnn.isMetaModified = false
        createAnn.repeatableWebLinks.length = 0
        createAnn.showUrlField = false
        createAnn.initializeFileUploader()
      }

      createAnn.saveAnnouncement = function (data) {
        // todo - call save announcement api
        createAnn.saveMeta = true
        var requestBody = angular.copy(data)
        requestBody.sourceId = $rootScope.rootOrgId
        requestBody.createdBy = $rootScope.userId
        if (requestBody.links) {
          requestBody.links = _.values(requestBody.links)
        }
        var requestData = {
          request: requestBody
        }
        console.log(requestData)
        announcementService.createAnnouncement(requestData).then(function (apiResponse) {
          console.log(apiResponse)
          	if (apiResponse && apiResponse.responseCode === 'OK') {
          		createAnn.refreshFormValues()
          		$(createAnnouncementModal).modal('hide')
            		$('#announcementSuccessModal').modal({
              		closable: false
            		}).modal('show')
          } else {
           	createAnn.showError(apiResponse)
          }
        }).catch(function (apiResponse) {
          	createAnn.showError(apiResponse)
        })
      }

      createAnn.showError = function (apiResponse) {
      	createAnn.errorFlag = true
      	if (apiResponse.responseCode === 'CLIENT_ERROR' && angular.isArray(apiResponse.params.errmsg)) {
      		angular.forEach(apiResponse.params.errmsg, function (value, key) {
          			toasterService.error(value.description)
        		})
      	} else {
      		toasterService.error(apiResponse.params.errmsg)
      	}
      }
      createAnn.attachment = []
      createAnn.initializeFileUploader = function () {
        $timeout(function () {
          createAnn.manualUploader = new qq.FineUploader({
            element: document.getElementById('fine-uploader-manual-trigger'),
            template: 'qq-template-manual-trigger',
            autoUpload: true,
            debug: true,
            paramsInBody: true,
            request: {
              endpoint: 'http://localhost:3000/api/announcement/v1/attachment/upload',
              inputName: 'document',
              params: { 'createdBy': $rootScope.userId }
            },

            validation: {
              sizeLimit: config.AnncmntMaxFileSizeToUpload,
              allowedExtensions: config.AnncmntAllowedFileExtension
            },
            messages: {
              sizeError: '{file} ' +
                $rootScope.messages.imsg.m0006 + ' ' +
                config.AnncmntMaxFileSizeToUpload / (1000 * 1024) + ' MB.'
            },
            failedUploadTextDisplay: {
              mode: 'default',
              responseProperty: 'error'
            },
            showMessage: function (message) {
              toasterService.error(message)
            },
            callbacks: {
              onComplete: function (id, name, responseJSON, xhr) {
                console.log('AAAA:', responseJSON)
                if (responseJSON.responseCode === 'OK' && responseJSON.result.attachment) {
                  createAnn.attachment.push(responseJSON.result.attachment.id)
                  createAnn.enableRecepientBtn()
                }
              },
              onSubmitted: function (id, name) {
                var fileSize = this.getSize(id)
                this.setParams({ document: name, createdBy: $rootScope.userId, filesize: fileSize })
              },
              onCancel: function () {
                document.getElementById('hide-section-with-button').style.display = 'block'
              },
              onError: function (id, name, errorReason, xhrOrXdr) {
                toasterService.error(qq.format('Error on file number {} - {}.  Reason: {}', id, name, errorReason))
              }
            }
          })

          window.cancelUploadFile = function () {
            document.getElementById('hide-section-with-button').style.display = 'block'
          }
        }, 300)
      }
    }
  ])
