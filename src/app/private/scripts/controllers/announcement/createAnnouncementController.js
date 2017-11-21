'use strict'
angular.module('playerApp').controller('createAnnouncementCtrl', ['$rootScope', '$scope', '$timeout', 'config', 'toasterService', 'announcementService', '$filter', 'uuid4', 'fileUpload',
  function ($rootScope, $scope, $timeout, config, toasterService, announcementService, $filter, uuid4, fileUpload) {
    var createAnn = this
    createAnn.data = {}
    createAnn.attachment = []
    createAnn.senderlist = []
    createAnn.targetIds = []
    createAnn.disableBtn = true
    createAnn.showUrlField = false
    createAnn.errorFlag = false
    createAnn.stepNumber = 1
    createAnn.isMetaModified = false
    createAnn.announcementType = []
    createAnn.repeatableWebLinks = []
    createAnn.selectedReciepeient = []
    createAnn.hideAnncmntBtn = false
    createAnn.uploadAttchement = false

    var getDefinitionReq = {
      request: {
        'rootorgid': $rootScope.rootOrgId,
        'userid': $rootScope.userId,
        'definitions': ['announcementtypes', 'senderlist']
      }
    }

    announcementService.getDefinitions(getDefinitionReq).then(function (response) {
      response = response.data
      if (response && response.responseCode === 'OK') {
        if (response.result.announcementtypes.content) {
          createAnn.announcementType = _.map(response.result.announcementtypes.content, 'name')
        }
        if (response.result.senderlist) {
          angular.forEach(response.result.senderlist, function (value, key) {
            createAnn.senderlist.push(value)
          })
        }
      } else {
        createAnn.hideAnncmntBtn = true
        toasterService.error($rootScope.messages.fmsg.m0069)
      }
    }).catch(function (response) {
      createAnn.hideAnncmntBtn = true
      toasterService.error($rootScope.messages.fmsg.m0069)
    })

    /**
     * @method initializeModal
     * @desc - function to initialize semantic dropdowns
     * @memberOf Controllers.createAnnouncementCtrl
     */
    createAnn.initializeModal = function () {
      $timeout(function () {
        $('#announcementType').dropdown({
          onChange: function (value, text, $choice) {
            createAnn.enableRecepientBtn()
          }
        })
      }, 100)
      $rootScope.$on('selected:items', function (evet, data) {
        createAnn.selectedReciepeient = data.geo
      })
    }

    /**
     * @method createAnnouncement
     * @desc - function to initialize create announcement modal
     * @memberOf Controllers.createAnnouncementCtrl
     */
    createAnn.createAnnouncement = function () {
      $rootScope.$emit('component:init')
      $('#createAnnouncementModal').modal({
        closable: false,
        onHide: function () {
          if (!createAnn.isMetaModified && createAnn.stepNumber == 4) {
            return true
          } else if (createAnn.isMetaModified) {
            createAnn.confirmationModal()
            return false
          } else {
            createAnn.refreshFormValues()
            return true
          }
        }
      }).modal('show')
    }

    /**
     * @method confirmationModal
     * @desc - display confirmation modal when user click on close icon
     * @memberOf Controllers.createAnnouncementCtrl
     */
    createAnn.confirmationModal = function () {
      $timeout(function () {
        $('#announcementCancelModal').modal({
          allowMultiple: true,
          onDeny: function () {
            return true
          },
          onApprove: function () {
            createAnn.refreshFormValues()
            createAnn.hideModel('announcementCancelModal')
            return true
          }
        }).modal('show')
      }, 10)
    }

    /**
     * @method hideModel
     * @desc - hide semantic modal
     * @memberOf Controllers.createAnnouncementCtrl
     * @param {string} [modalId] [description]
     */
    createAnn.hideModel = function (modalId) {
      $('#' + modalId).modal('hide')
      $('#' + modalId).modal('hide others')
      $('#' + modalId).modal('hide all')
      $('#' + modalId).modal('hide dimmer')
    }

    /**
     * @method addNewLink
     * @desc - add new url input box
     * @memberOf Controllers.createAnnouncementCtrl
     */
    createAnn.addNewLink = function () {
      var newItemNo = createAnn.repeatableWebLinks.length + 1
      createAnn.repeatableWebLinks.push({
        'id': 'choice' + newItemNo
      })
      createAnn.showUrlField = true
    }

    /**
     * @method removeLink
     * @desc - remove / delete url
     * @memberOf Controllers.createAnnouncementCtrl
     * @param {int} [index] [description]
     */
    createAnn.removeLink = function (index) {
      createAnn.repeatableWebLinks.splice(index, 1)
      if (createAnn.data.links) {
        delete createAnn.data.links[index]
      }
      createAnn.showUrlField = !!createAnn.repeatableWebLinks.length
      createAnn.enableRecepientBtn()
    }

    /**
     * @method previewAnn
     * @desc - preview announcement
     * @memberOf Controllers.createAnnouncementCtrl
     */
    createAnn.previewAnn = function () {
      createAnn.linkArray = []
      if (createAnn.data.links) {
        angular.forEach(createAnn.data.links, function (value, key) {
          if (value.trim().length) {
            createAnn.linkArray.push(value)
          }
        })
      }
      createAnn.previewData = {
        'details': { 'type': createAnn.data.type, 'title': createAnn.data.title, 'description': createAnn.data.description, 'from': createAnn.data.from },
        'sourceid': $rootScope.rootOrgId,
        'links': createAnn.linkArray,
        'target': ['teachers'],
        'attachments': createAnn.attachment
      }
    }

    /**
     * @method removeRicipients
     * @desc - remove selected recipients
     * @memberOf Controllers.createAnnouncementCtrl
     * @param {object} [item] [current selected item]
     */
    createAnn.removeRicipients = function (item) {
      _.remove(createAnn.selectedReciepeient, function (arg) {
        if (arg.location == item.location) {
          item.selected = false,
            toasterService.info(item.location + ' ' + $rootScope.messages.imsg.m0020)
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

    /**
     * @method confirmRecipients
     * @desc - enforce user to select recipients
     * @memberOf Controllers.createAnnouncementCtrl
     */
    createAnn.confirmRecipients = function () {
      $rootScope.$emit('get:selected:items')
      if (createAnn.selectedReciepeient.length == 0) {
        createAnn.stepNumber = 2
        toasterService.error($rootScope.messages.emsg.m0006)
        return
      }
      createAnn.stepNumber = 3
    }

    /**
     * @method enableRecepientBtn
     * @desc - enable select recipients btn if all required fields are selected
     * @memberOf Controllers.createAnnouncementCtrl
     */
    createAnn.enableRecepientBtn = function () {
      var links = []
      if (createAnn.data.links) {
        angular.forEach(createAnn.data.links, function (value, key) {
          if (value.trim().length) {
            links.push(value)
          }
        })
      }
      var selectRecipientBtn = angular.element(document.querySelector('#selectRecipientBtn'))
      if (createAnn.data.title && createAnn.data.from && createAnn.data.type &&
        (createAnn.uploadAttchement || createAnn.data.description || links.length)) {
        createAnn.disableBtn = false
        selectRecipientBtn.removeClass('disabled')
      } else {
        createAnn.disableBtn = true
        selectRecipientBtn.addClass('disabled')
      }
      createAnn.isMetaModified = true
    }

    /**
     * @method refreshFormValues
     * @desc - reset form values
     * @memberOf Controllers.createAnnouncementCtrl
     */
    createAnn.refreshFormValues = function () {
      createAnn.disableBtn = true
      createAnn.editAction = false
      createAnn.stepNumber = 1
      $('#announcementType').dropdown('restore defaults')
      $('#createAnnouncementModal').modal('refresh')
      createAnn.data = {}
      createAnn.isMetaModified = false
      createAnn.repeatableWebLinks.length = 0
      createAnn.showUrlField = false
      createAnn.attachment = []
      $('.qq-upload-list').children('li').remove()
    }

    /**
     * @method saveAnnouncement
     * @desc - prepare api request object and make create api call
     * @memberOf Controllers.createAnnouncementCtrl
     * @param {object} [data] [form data]
     */
    createAnn.saveAnnouncement = function (data) {
      createAnn.isMetaModified = false
      var requestBody = angular.copy(data)
      requestBody.sourceId = $rootScope.rootOrgId
      requestBody.createdBy = $rootScope.userId
      requestBody.target = {
        'geo': {
          'ids': _.map(createAnn.selectedReciepeient, 'id')
        }
      }

      if (createAnn.linkArray.length > 0) {
        requestBody.links = createAnn.linkArray
      } else {
        delete requestBody.links
      }

      if (createAnn.attachment.length) {
        requestBody.attachments = createAnn.attachment
      }

      if (angular.isUndefined(requestBody.description)) {
        delete requestBody.description
      }
      var requestData = {
        request: requestBody
      }
      announcementService.createAnnouncement(requestData).then(function (apiResponse) {
        apiResponse = apiResponse.data
        if (apiResponse && apiResponse.responseCode === 'OK') {
          $timeout(function () {
            createAnn.refreshFormValues()
          })
          $('#announcementSuccessModal').modal({
            closable: false
          }).modal('show')
        } else {
          createAnn.isMetaModified = true
          createAnn.showError(apiResponse)
        }
      }).catch(function (apiResponse) {
        createAnn.isMetaModified = true
        createAnn.showError(apiResponse.data)
      })
    }

    /**
     * @method showError
     * @desc - display error message(s) when apis get fails
     * @memberOf Controllers.createAnnouncementCtrl
     * @param {object} [apiResponse] [api response along with error message]
     */
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

    /**
     * @method getReadableFileSize
     * @desc - convert byteSize into KB, MB
     * @memberOf Controllers.createAnnouncementCtrl
     * @param {int} [byteSize] [file size]
     * @return {string} [return readable file size]
     */
    createAnn.getReadableFileSize = function (byteSize) {
      var sizes = ['Bytes', 'KB', 'MB']
      if (byteSize) {
        var i = parseInt(Math.floor(Math.log(byteSize) / Math.log(1024)))
        return createAnn.convertedFileSize = Math.round(byteSize / Math.pow(1024, i), 2) + ' ' + sizes[i]
      } else {
        return createAnn.convertedFileSize = '0 Byte'
      }
    }

    /**
     * @method initializeFileUploader
     * @desc - create fine uploader instance by passing required params
     * @memberOf Controllers.createAnnouncementCtrl
     */
    createAnn.initializeFileUploader = function () {
      var apiUrl = config.URL.BASE_PREFIX + config.URL.LEARNER_PREFIX + config.URL.CONTENT.UPLOAD_MEDIA
      var options = {
        endpoint: apiUrl,
        fileSizeLimit: config.AnncmntMaxFileSizeToUpload,
        allowedExtensions: config.AnncmntAllowedFileExtension,
        fileSizeErrorText: $rootScope.messages.imsg.m0021,
        containerName: 'attachments/announcement',
        uploadSuccess: createAnn.onUploadComplete,
        onCancel: createAnn.onUploadCancel,
        customHeaders: {
          Accept: 'application/json',
          'X-Consumer-ID': 'X-Consumer-ID',
          'X-Device-ID': 'X-Device-ID',
          'X-msgid': uuid4.generate(),
          ts: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss:sssZ'),
          'X-Source': 'web',
          'X-Org-code': 'AP'
        }
      }
      fileUpload.createFineUploadInstance(options)
    }

    /**
     * @method onUploadComplete
     * @desc - invoked after attachement uploaded
     * @memberOf Controllers.createAnnouncementCtrl
     * @param {int} [id] [uploaded file count]
     * @param {string} [name] [selected fine name]
     * @param {object} [uploadDetails] [uploaded file details - name,mimeType,downloadUrl,and file size]
     */
    createAnn.onUploadComplete = function (id, name, uploadDetails) {
      uploadDetails.size = createAnn.getReadableFileSize(uploadDetails.size)
      createAnn.attachment.push(JSON.stringify(uploadDetails))
      createAnn.uploadAttchement = true
      createAnn.enableRecepientBtn()
    }

    /**
     * @method onUploadCancel
     * @desc - invoked when user cancel uploaded attachement
     * @memberOf Controllers.createAnnouncementCtrl
     * @param {int} [id] [uploaded file count]
     * @param {string} [name] [selected fine name]
     */
    createAnn.onUploadCancel = function (id, name) {
      var deleteFlag = createAnn.attachment.splice(id, 1)
      if (deleteFlag.length === 0) {
        angular.forEach(createAnn.attachment, function (value, key) {
          var details = JSON.parse(value)
          if (details.name === name) {
            createAnn.attachment.splice(key, 1)
          }
        })
      }

      if (createAnn.attachment.length === 0) {
        createAnn.uploadAttchement = false
      }
      createAnn.enableRecepientBtn()
      document.getElementById('hide-section-with-button').style.display = 'block'
    }

    $scope.$on('editAnnouncementBeforeResend', function (event, announcement) {
      createAnn.editAction = true
      createAnn.data.title = announcement.details.title
      createAnn.data.description = announcement.details.description
      angular.forEach(announcement.links, function (value, key) {
        createAnn.addNewLink()
      })
      createAnn.data.links = announcement.links
      $('#announcementType').dropdown('set text', announcement.details.type)
      createAnn.data.from = announcement.details.from
      createAnn.data.type = announcement.details.type
      createAnn.attachment = announcement.attachments
      createAnn.disableBtn = false
      createAnn.createAnnouncement()
      $timeout(function () {
        $rootScope.$broadcast('component:update', announcement.target.geo.ids)
      }, 100)
    })
    createAnn.resendAnnouncement = function (data) {
      var requestBody = angular.copy(data)
      requestBody.sourceId = $rootScope.rootOrgId
      requestBody.createdBy = $rootScope.userId
      requestBody.target = {
        'geo': {
          'ids': _.map(createAnn.selectedReciepeient, 'id')
        }
      }
      if (requestBody.links) {
        requestBody.links = createAnn.linkArray
      }
      if (createAnn.attachment) {
        requestBody.attachments = createAnn.attachment
      }
      var requestData = {
        request: requestBody
      }
      announcementService.resendAnnouncement(requestData).then(function (apiResponse) {
        apiResponse = apiResponse.data
        if (apiResponse && apiResponse.responseCode === 'OK') {
          createAnn.isMetaModified = false
          createAnn.hideModel('createAnnouncementModal')
          $('#announcementResendModal').modal('show')
          // toasterService.success('Announcement resent successfully.')
          announcementOutboxData.renderAnnouncementList()
        } else {
          toasterService.error(apiResponse.params.errmsg)
        }
      }).catch(function (err) {
        toasterService.error(err.data.params.errmsg)
      }).finally(function () {})
    }
  }
])
