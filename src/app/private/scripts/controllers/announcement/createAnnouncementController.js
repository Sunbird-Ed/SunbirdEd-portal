'use strict'

angular.module('playerApp')
  .controller('createAnnouncementCtrl', ['$rootScope', '$scope', '$timeout', '$state', '$stateParams', 'config', 'toasterService',
    'permissionsService', 'announcementService',
    function ($rootScope, $scope, $timeout, $state, $stateParams, config, toasterService, permissionsService, announcementService) {
      var createAnn = this

      createAnn.org = ['Org 1', 'Org 2', 'Org 3']
      createAnn.announcementType = ['Type 1', 'Type 2', 'Type 3']
      createAnn.disableBtn = true
      createAnn.showUrlField = false
      createAnn.errorFlag = false
      createAnn.repeatableWebLinks = []
      createAnn.attachmentEndPoint = config.URL.BASE_PREFIX + config.URL.ANNOUNCEMENT.UPLOAD_ATTACHMENT
      createAnn.isMetaModified = false
      createAnn.stepNumber = 1
      createAnn.attachment = []
      createAnn.targetIds = []
      createAnn.data = {}

      createAnn.initializeModal = function () {
        $timeout(function () {
          $('#announcementType').dropdown({
            onChange: function (value, text, $choice) {
              createAnn.enableRecepientBtn()
            }
          })

          $('#orgDropdown').dropdown({
            onChange: function (value, text, $choice) {
              createAnn.enableRecepientBtn()
            }
          })
        }, 100)

        $rootScope.$on('selected:items', function (evet, data) {
          createAnn.selectedReciepeient = data.geo
        })
      }

      createAnn.createAnnouncement = function () {
        $rootScope.$emit('component:init')
        $('#createAnnouncementModal').modal({
          closable: false,
          onHide: function () {
            if (createAnn.isMetaModified) {
              if (createAnn.confirmModel) {
              	return true
              } else {
              	createAnn.confirmationModal()
              	return false
              }
            } else {
              return true
            }
          }
        }).modal('show')
      }

      createAnn.confirmationModal = function () {
        $timeout(function () {
          $('#announcementCancelModal').modal({
            allowMultiple: true,
            onDeny: function () {
        	   return true
            },
            onApprove: function () {
           	   createAnn.refreshFormValues()
           	   createAnn.hideModel()
        	   return true
            }
          }).modal('show')
        }, 10)
      }

      createAnn.hideModel = function () {
        $('#announcementCancelModal').modal('hide')
        $('#announcementCancelModal').modal('hide others')
        $('#announcementCancelModal').modal('hide all')
        $('#announcementCancelModal').modal('hide dimmer')
      }

      createAnn.addNewLink = function () {
        var newItemNo = createAnn.repeatableWebLinks.length + 1
        createAnn.repeatableWebLinks.push({ 'id': 'choice' + newItemNo })
        createAnn.showUrlField = true
      }

      createAnn.removeLink = function (index) {
        createAnn.repeatableWebLinks.splice(index, 1)
        delete createAnn.data.links[index]
        createAnn.showUrlField = createAnn.repeatableWebLinks.length != '0'
      }

      createAnn.previewAnn = function () {
        createAnn.linkArray = []
        angular.forEach(createAnn.data.links, function (value, key) {
          createAnn.linkArray.push(value)
        })
        createAnn.previewData = { 'type': createAnn.data.type, 'links': createAnn.linkArray, 'title': createAnn.data.title, 'description': createAnn.data.description, 'target': ['teachers'], 'attachments': createAnn.attachment }
      }

      createAnn.removeRicipients = function (item) {
        _.remove(createAnn.selectedReciepeient, function (arg) {
          if (arg.location == item.location) {
            item.selected = false,
              toasterService.info(item.location + ' location is removed sucessfully.')
            return arg.location
          }
        })
        createAnn.confirmRecipients()
      }

      createAnn.config = {
        'geo': {
          'adopter': 'SERVICE',
          'service': 'geoService'
        }
      }

      createAnn.confirmRecipients = function () {
        $rootScope.$emit('get:selected:items')
        if (createAnn.selectedReciepeient.length == 0) {
          createAnn.stepNumber = 2
          toasterService.error('Select recipients')
          return
        }
        createAnn.stepNumber = 3
      }

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
        createAnn.showUrlField = false
        createAnn.isLastStep = false
        createAnn.repeatableWebLinks = []
        createAnn.isMetaModified = false
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
        var requestBody = angular.copy(data)
        requestBody.sourceId = $rootScope.rootOrgId
        requestBody.createdBy = $rootScope.userId
        requestBody.target = { 'geo': { 'ids': _.map(createAnn.selectedReciepeient, 'id') } }
        if (requestBody.links) {
          requestBody.links = createAnn.linkArray
        }
        var requestData = {
          request: requestBody
        }
        announcementService.createAnnouncement(requestData).then(function (apiResponse) {
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
              //endpoint: createAnn.attachmentEndPoint,
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
                if (responseJSON.responseCode === 'OK' && responseJSON.result.attachment) {
                  var attData = {"title":name, "downloadURL": ""}
                  createAnn.attachment.push(attData)
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
        }
        // Function to confirm recipients
        createAnn.confirmRecipients = function() {
            // TODO - get select ricipients
        }
        // Function to enable / disable RecepientBtn
        createAnn.enableRecepientBtn = function() {
            if (createAnn.data.title && createAnn.data.from && createAnn.data.announcementType && (createAnn.data.description || createAnn.attachment.length)) {
                createAnn.disableBtn = false
            } else {
                createAnn.disableBtn = true
            }
            createAnn.isMetaModified = true
        }
        createAnn.refreshFormValues = function() {
            createAnn.disableBtn = true
            createAnn.stepNumber = 1
            $('#announcementType').dropdown('restore defaults')
            $('#orgDropdown').dropdown('restore defaults')
            $('#createAnnouncementModal').modal('refresh')
            // $('#announcementForm').form('reset')
            createAnn.data = {}
            createAnn.isMetaModified = false
            createAnn.repeatableWebLinks.length = 0
            createAnn.showUrlField = false
            createAnn.initializeFileUploader()
        }
        createAnn.saveAnnouncement = function() {
            // TODO - call save announcement api
        }
        createAnn.attachment = []
        createAnn.initializeFileUploader = function() {
            $timeout(function() {
                createAnn.manualUploader = new qq.FineUploader({
                    element: document.getElementById('fine-uploader-manual-trigger'),
                    template: 'qq-template-manual-trigger',
                    request: {
                        // TODO - use upload api url
                        endpoint: 'http://www.mocky.io/v2/59ef30b72e0000001d1c5e09'
                    },
                    autoUpload: true,
                    debug: true,
                    validation: {
                        sizeLimit: config.AnncmntMaxFileSizeToUpload,
                        allowedExtensions: config.AnncmntAllowedFileExtension
                    },
                    messages: {
                        sizeError: '{file} ' + $rootScope.messages.imsg.m0006 + ' ' + config.AnncmntMaxFileSizeToUpload / (1000 * 1024) + ' MB.'
                    },
                    failedUploadTextDisplay: {
                        mode: 'default',
                        responseProperty: 'error'
                    },
                    showMessage: function(message) {
                        toasterService.error(message)
                    },
                    callbacks: {
                        onComplete: function(id, name, responseJSON, xhr) {
                            // TODO - push attachement api success response
                            createAnn.attachment.push('A', 'B')
                            createAnn.enableRecepientBtn()
                        },
                        onSubmitted: function(id, name) {},
                        onCancel: function() {
                            document.getElementById('hide-section-with-button').style.display = 'block'
                        },
                        onError: function(id, name, errorReason, xhrOrXdr) {
                            toasterService.error(qq.format('Error on file number {} - {}.  Reason: {}', id, name, errorReason))
                        }
                    }
                })
                window.cancelUploadFile = function() {
                    document.getElementById('hide-section-with-button').style.display = 'block'
                }
            }, 300)
        }
        createAnn.getAnnouncementDetailsFromId = function(announcementId) {
            alert(announcementId)
            /*announcementService.getAnnouncementDetailsFromId(announcementId).then(function(apiResponse) {
                    if (apiResponse && apiResponse.responseCode === 'OK') {
                        announcementOutboxData.listData = apiResponse.result.announcements

                    } else {
                        toasterService.error(apiResponse.params.errmsg)
                    }
                }).catch(function(err) {
                    toasterService.error(err.data.params.errmsg)
                }).finally(function() {

                }); */
            createAnn.data.resend = {
                "announcementId": "1",
                "sourceId": "National Council For Teacher Education",
                "createdBy": "Creator1",
                "createdOn": "2017-10-24",
                "readBy": ["1234-12341-12313-132123", "1234-12341-12313-324234"],
                "type": "Circular",
                "links": ["https://www.google.co.in/?gfe_rd=cr&dcr=0&ei=D8r2WbjkOsKL8Qe4pJeACA", "https://diksha.gov.in/#documents"],
                "status": "active",
                "title": "Exam dates announced for CBSE and state board exams",
                "description": "Description goes here for the announcement exam date announced for CBSC and state board exams announcement exam date announced for CBSC and state board exams. Description goes here for the announcement exam date announced for CBSC and state board exams announcement exam date announced for CBSC and state board exams. Description goes here for the announcement exam date announced for CBSC and state board exams announcement exam date announced for CBSC and state board exams. announcement exam date announced for CBSC and state board exams announcement exam date announced for CBSC and state board exams",
                "target": ["teachers"],
                "attachments": [{
                    "title": "Circular A1.pdf",
                    "downloadURL": "https://linktoattachment.com/documents/Circular A1.pdf",
                    "mimetype": "application/pdf",
                    "filesize": "120 Kb"
                }]
            }
            console.log(createAnn.data.resend);
            alert('successful')
            //$('#createAnnouncementModal').modal('show')
        }
    }
])