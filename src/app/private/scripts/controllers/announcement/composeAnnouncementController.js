'use strict'
angular.module('playerApp').controller('composeAnnouncementCtrl', ['$rootScope', '$scope', '$state',
  '$stateParams', '$timeout', 'config', 'toasterService', 'fileUpload', 'AnnouncementModel',
  'announcementAdapter', 'telemetryService', function ($rootScope, $scope, $state, $stateParams,
    $timeout, config, toasterService, fileUpload, AnnouncementModel, announcementAdapter, telemetryService) {
    var composeAnn = this
    composeAnn.targetIds = []
    composeAnn.disableBtn = true
    composeAnn.showUrlField = false
    composeAnn.errorFlag = false
    composeAnn.isMetaModified = false
    composeAnn.announcementType = []
    composeAnn.repeatableWebLinks = []
    composeAnn.hideAnncmntBtn = false
    composeAnn.uploadAttchement = false
    composeAnn.editAction = false
    composeAnn.isApprove = false
    composeAnn.hideSendBtn = false
    composeAnn.config = {
      geo: {
        adopter: 'SERVICE',
        service: 'geoService'
      }
    }
    /**
         * @method initializeModal
         * @desc - function to initialize semantic dropdowns
         * @memberOf Controllers.composeAnnouncementCtrl
         */
    composeAnn.initializeModal = function () {
      $timeout(function () {
        $('#announcementType').dropdown({
          onChange: function (value, text, $choice) {
            composeAnn.enableRecepientBtn()
          }
        })
      }, 100)
      $rootScope.$on('selected:items', function (evet, data) {
        composeAnn.announcement.selTar = _.clone(data.geo)
      })
    }
    /**
         * @method createAnnouncement
         * @desc - function to initialize create announcement modal
         * @memberOf Controllers.composeAnnouncementCtrl
         */
    composeAnn.createAnnouncement = function () {
      $('#createAnnouncementModal').modal({
        closable: false,
        onShow: function () {
          $('.ui.modal.transition.hidden').remove()
        },
        onHide: composeAnn.onHideCreateAnnModal
      }).modal('show')
    }
    /**
         * @method confirmationModal
         * @desc - display confirmation modal when user click on close icon
         * @memberOf Controllers.composeAnnouncementCtrl
         */
    composeAnn.confirmationModal = function () {
      $timeout(function () {
        $('#announcementCancelModal').modal({
          allowMultiple: true,
          onDeny: function () {
            return true
          },
          onApprove: composeAnn.onApproveConfirmationModal
        }).modal('show')
      }, 10)
    }
    /**
         * @method hideModel
         * @desc - hide semantic modal
         * @memberOf Controllers.composeAnnouncementCtrl
         * @param {string} [modalId] [description]
         */
    composeAnn.hideModel = function (modalId) {
      $('#' + modalId).modal('hide')
      $('#' + modalId).modal('hide others')
      $('#' + modalId).modal('hide all')
      $('#' + modalId).modal('hide dimmer')
    }
    /**
         * @method addNewLink
         * @desc - add new url input box
         * @memberOf Controllers.composeAnnouncementCtrl
         */
    composeAnn.addNewLink = function () {
      var newItemNo = composeAnn.repeatableWebLinks.length + 1
      composeAnn.repeatableWebLinks.push({
        'id': 'choice' + newItemNo
      })
      composeAnn.showUrlField = true
    }
    /**
         * @method removeLink
         * @desc - remove / delete url
         * @memberOf Controllers.composeAnnouncementCtrl
         * @param {int} [index] [description]
         */
    composeAnn.removeLink = function (index) {
      composeAnn.repeatableWebLinks.splice(index, 1)
      if (composeAnn.announcement.links) {
        composeAnn.announcement.links.splice(index, 1)
      }
      composeAnn.showUrlField = !!composeAnn.repeatableWebLinks.length
      composeAnn.enableRecepientBtn()
    }
    /**
         * @method removeRicipients
         * @desc - remove selected recipients
         * @memberOf Controllers.composeAnnouncementCtrl
         * @param {object} [item] [current selected item]
         */
    composeAnn.removeRecipients = function (item) {
      _.remove(composeAnn.announcement.selTar, function (arg) {
        if (arg.location === item.location) {
          item.selected = false
          toasterService.info(item.location + ' ' + $rootScope.messages.imsg.m0020)
          return arg.location
        }
      })
      composeAnn.confirmRecipients()
    }
    /**
         * @method confirmRecipients
         * @desc - enforce user to select recipients
         * @memberOf Controllers.composeAnnouncementCtrl
         */
    composeAnn.confirmRecipients = function () {
      $rootScope.$emit('get:selected:items')
      if (composeAnn.announcement.selTar && composeAnn.announcement.selTar.length === 0) {
        toasterService.error($rootScope.messages.emsg.m0006)
        return false
      }
      return true
    }
    /**
         * @method enableRecepientBtn
         * @desc - enable select recipients btn if all required fields are selected
         * @memberOf Controllers.composeAnnouncementCtrl
         */
    composeAnn.enableRecepientBtn = function (status) {
      if (status === undefined) {
        status = true
      }
      if (composeAnn.announcement !== null) {
        var links = []
        if (composeAnn.announcement.links) {
          angular.forEach(composeAnn.announcement.links, function (value, key) {
            if (value.trim().length) {
              links.push(value)
            }
          })
        }
        var selectRecipientBtn = angular.element(document.querySelector(
          '#selectRecipientBtn'))
        if (composeAnn.announcement.title && composeAnn.announcement.from &&
          composeAnn.announcement.type && (composeAnn.uploadAttchement ||
          composeAnn.announcement.description || links.length)) {
          composeAnn.disableBtn = false
          selectRecipientBtn.removeClass('disabled')
        } else {
          composeAnn.disableBtn = true
          selectRecipientBtn.addClass('disabled')
        }
      }
      if (status === false) {
        composeAnn.isMetaModified = false
      } else {
        composeAnn.isMetaModified = true
      }
    }
    /**
         * @method refreshFormValues
         * @desc - reset form values
         * @memberOf Controllers.composeAnnouncementCtrl
         */
    composeAnn.refreshFormValues = function () {
      composeAnn.disableBtn = true
      composeAnn.stepNumber = 1
      $('#announcementType').dropdown('restore defaults')
      $('#createAnnouncementModal').modal('refresh')
      composeAnn.isMetaModified = false
      composeAnn.repeatableWebLinks.length = 0
      composeAnn.showUrlField = false
      $('.qq-upload-list').children('li').remove()
    }
    /**
         * @method saveAnnouncement
         * @desc - prepare api request object and make create api call
         * @memberOf Controllers.composeAnnouncementCtrl
         */
    composeAnn.saveAnnouncement = function () {
      var url = '' // eslint-disable-line no-unused-vars
      if (composeAnn.editAction) {
        url = '/private/index#!/announcement/resend/' + $stateParams.announcementId +
                    '/4'
      } else {
        url = '/private/index#!/announcement/create/4'
      }
      composeAnn.isMetaModifiedSteps = true
      composeAnn.announcement.target.geo.ids = _.map(composeAnn.announcement.selTar, 'id')
      composeAnn.hideSendBtn = true
      announcementAdapter.createAnnouncement(composeAnn.announcement, composeAnn.editAction)
        .then(function (apiResponse) {
          composeAnn.hideSendBtn = false
          composeAnn.hideModel('createAnnouncementModal')
          if (composeAnn.editAction) {
            $('#announcementResendModal').modal({
              closable: false
            }).modal('show')
          } else {
            $('#announcementSuccessModal').modal({
              closable: false
            }).modal('show')
          }
          $rootScope.userIdHashTag = null
          telemetryService.endTelemetryData('announcement', '', 'announcement', '1.0', 'announcement',
            'announcement-create', '')
          $state.go('announcementOutbox')
        }, function (err) {
          composeAnn.isMetaModified = true
          composeAnn.hideSendBtn = false
          composeAnn.showError(err.data)
        })
    }
    /**
         * @method showError
         * @desc - display error message(s) when apis get fails
         * @memberOf Controllers.composeAnnouncementCtrl
         * @param {object} [apiResponse] [api response along with error message]
         */
    composeAnn.showError = function (apiResponse) {
      composeAnn.errorFlag = true
      if (apiResponse.responseCode === 'CLIENT_ERROR' && angular.isArray(apiResponse.params
        .errmsg)) {
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
         * @memberOf Controllers.composeAnnouncementCtrl
         * @param {int} [byteSize] [file size]
         * @return {string} [return readable file size]
         */
    composeAnn.getReadableFileSize = function (byteSize) {
      var sizes = ['Bytes', 'KB', 'MB']
      if (byteSize) {
        var i = parseInt(Math.floor(Math.log(byteSize) / Math.log(1024)))
        composeAnn.convertedFileSize = Math.round(byteSize / Math.pow(1024, i), 2) + ' ' +
                    sizes[i]
      } else {
        composeAnn.convertedFileSize = '0 Byte'
      }
      return composeAnn.convertedFileSize
    }
    window.removeCreateAnnAttachment = function (item, pos, name) {
      $(item).closest('li').remove()
      composeAnn.onUploadCancel(pos, name)
    }
    /**
         * @method initializeFileUploader
         * @desc - create fine uploader instance by passing required params
         * @memberOf Controllers.composeAnnouncementCtrl
         */
    composeAnn.initializeFileUploader = function (resend) {
      var options = {
        fileSizeLimit: config.AnncmntMaxFileSizeToUpload,
        allowedExtensions: config.AnncmntAllowedFileExtension,
        fileSizeErrorText: $rootScope.messages.emsg.m0007,
        containerName: 'attachments/announcement',
        uploadSuccess: composeAnn.onUploadComplete,
        onCancel: composeAnn.onUploadCancel
      }
      fileUpload.createFineUploadInstance(options, composeAnn.prepopulateFilesCallback)
    }
    /**
         * @method prepopulateFilesCallback
         * @desc - callback to prepopulate the files
         * @memberOf Controllers.composeAnnouncementCtrl
         */
    composeAnn.prepopulateFilesCallback = function (data) {
      $('.qq-uploader').eq(1).parent().remove()
      var att = []
      if (composeAnn.announcement !== null) {
        att = composeAnn.announcement.attachments
      }
      var attachments = angular.copy(att)
      if ($('#old-file-list').length <= 0) {
        $('.qq-upload-list').parent().prepend('<ul id="old-file-list" class="' +
                    ' qq-upload-list"></ul>')
        _.forEach(attachments, function (attachment, pos) {
          var name = "'" + attachment.name + "'" // eslint-disable-line
          $('#old-file-list').append(
            '<li class="qq-upload-retryable w3-container' +
                        ' w3-border w3-round-xlarge qq-upload-success">' +
                        ' <i id="removeFile" onclick="removeCreateAnnAttachment ' +
                        '(this,' + pos + ', ' + name + ')" class="remove icon cursor-pointer" ' +
                        'style="float:right;"></i><span class="qq-upload-file-selector ' +
                        'qq-upload-file" style="width: 200px;">' +
                        attachment.name + '</span></li>')
          composeAnn.uploadAttchement = true
        })
      }
      composeAnn.enableRecepientBtn()
    }
    /**
         * @method onUploadComplete
         * @desc - invoked after attachement uploaded
         * @memberOf Controllers.composeAnnouncementCtrl
         * @param {int} [id] [uploaded file count]
         * @param {string} [name] [selected fine name]
         * @param {object} [uploadDetails] [uploaded file details - name,mimeType,downloadUrl,and file size]
         */
    composeAnn.onUploadComplete = function (id, name, uploadDetails) {
      uploadDetails.size = composeAnn.getReadableFileSize(uploadDetails.size)
      composeAnn.announcement.attachments.push(uploadDetails)
      composeAnn.uploadAttchement = true
      composeAnn.enableRecepientBtn()
    }
    /**
         * @method onUploadCancel
         * @desc - invoked when user cancel uploaded attachement
         * @memberOf Controllers.composeAnnouncementCtrl
         * @param {int} [id] [uploaded file count]
         * @param {string} [name] [selected fine name]
         */
    composeAnn.onUploadCancel = function (id, name) {
      var deleteFlag = composeAnn.announcement.attachments.splice(id, 1)
      if (deleteFlag.length === 0) {
        angular.forEach(composeAnn.announcement.attachments, function (value, key) {
          if (value.name === name) {
            composeAnn.announcement.attachments.splice(key, 1)
          }
        })
      }
      if (composeAnn.announcement.attachments.length === 0) {
        composeAnn.uploadAttchement = false
      }
      composeAnn.enableRecepientBtn()
      $('#hide-section-with-button').css('style.display', 'block')
    }
    /**
         * @method init
         * @desc - invoked when page is loaded
         * @memberOf Controllers.composeAnnouncementCtrl
         */
    composeAnn.init = function () {
      composeAnn.stepNumber = parseInt($stateParams.stepNumber) || 1
      composeAnn.announcement = $stateParams.announcement
      composeAnn.isMetaModifiedSteps = $stateParams.isMetaModifiedSteps
      composeAnn.editAction = $stateParams.isResend
      if (composeAnn.stepNumber === 1) {
        composeAnn.initializeModal()
      }
      composeAnn.createAnnouncement()
      // Create new data modal only when if its not already present
      if (composeAnn.stepNumber === 1 && composeAnn.announcement === null) {
        if (composeAnn.editAction) {
          composeAnn.getResend($stateParams.announcementId)
          telemetryService.startTelemetryData('announcement', $stateParams.announcementId, 'announcement',
            '1.0', 'announcement', 'announcement-create', '')
        } else {
          composeAnn.announcement = new AnnouncementModel.Announcement({})
          composeAnn.announcement.hideDate = true
          telemetryService.startTelemetryData('announcement', '', 'announcement', '1.0', 'announcement',
            'announcement-create', '')
        }
      }
      if (composeAnn.stepNumber === 1) {
        composeAnn.getDefinitions($rootScope.rootOrgId)
        if (composeAnn.announcement !== null && composeAnn.announcement.links !==
                    undefined) {
          angular.forEach(composeAnn.announcement.links, function (value, key) {
            composeAnn.addNewLink()
          })
        }
      }
      if (composeAnn.stepNumber === 2 && composeAnn.announcement !== null && composeAnn.announcement
        .target !== undefined) {
        var geoIds = []
        if (composeAnn.editAction) {
          geoIds = composeAnn.announcement.target.geo.ids
        } else {
          composeAnn.announcement.target.geo.ids = _.map(composeAnn.announcement.selTar,
            'id')
          geoIds = _.map(composeAnn.announcement.selTar, 'id')
        }
        $timeout(function () {
          $rootScope.$broadcast('component:update', geoIds)
        }, 100)
      }
    }
    /**
         * @method goToNextStep
         * @desc - Used to swtch to next step of announcement creation
         * @memberOf Controllers.composeAnnouncementCtrl
         */
    composeAnn.goToNextStep = function (telemetryPageId, telemetryPageType) {
      // Current step is confirm recipients
      if (composeAnn.stepNumber !== 1) {
        if (composeAnn.confirmRecipients()) {
          if (_.isEmpty(composeAnn.announcement.sourceId)) {
            composeAnn.announcement.sourceId = $rootScope.rootOrgId
          }
        } else {
          return false
        }
      }
      composeAnn.isMetaModifiedSteps = true
      $state.go($state.current.name, {
        stepNumber: ++composeAnn.stepNumber,
        announcement: composeAnn.announcement,
        isMetaModifiedSteps: false,
        telemetryPageId: telemetryPageId,
        telemetryPageType: telemetryPageType
      }, {
        reload: true
      })
    }
    /**
         * @method goToBackStep
         * @desc - Used to switch one step back to announcement creation
         * @memberOf Controllers.composeAnnouncementCtrl
         */
    composeAnn.goToBackStep = function () {
      composeAnn.isMetaModifiedSteps = true
      $state.go($state.current.name, {
        stepNumber: --composeAnn.stepNumber,
        announcement: composeAnn.announcement,
        isMetaModifiedSteps: false
      }, {
        reload: true
      })
    }
    /**
         * @method getResend
         * @desc - Used to get the announcement resend data
         * @param {String} [announcementId] [announcement id]
         * @memberOf Controllers.composeAnnouncementCtrl
         */
    composeAnn.getResend = function (announcementId) {
      announcementAdapter.getResend(announcementId).then(function (apiResponse) {
        composeAnn.announcement = new AnnouncementModel.Announcement(apiResponse.result
          .announcement)
        composeAnn.announcement.hideDate = true
        composeAnn.initializeModal()
        composeAnn.enableRecepientBtn()
        composeAnn.initializeFileUploader(true)
        if (composeAnn.announcement !== null && composeAnn.announcement.links !==
                    undefined) {
          angular.forEach(composeAnn.announcement.links, function (value, key) {
            composeAnn.addNewLink()
          })
        }
        composeAnn.uploadAttchement = composeAnn.announcement.attachments.length > 0
      })
    }
    /**
         * @method getDefinitions
         * @desc - Used to get the definitions data
         * @param {String} [rootOrgId] [organization id]
         * @memberOf Controllers.composeAnnouncementCtrl
         */
    composeAnn.getDefinitions = function (rootOrgId) {
      announcementAdapter.getDefinitions(rootOrgId).then(function (response) {
        if (response.result.announcementTypes) {
          composeAnn.announcementType = _.map(response.result.announcementTypes, 'name')
        }
        if (composeAnn.announcement.type !== '') {
          $('#announcementType').dropdown('set text', composeAnn.announcement.type)
        }
      }, function (err) {
        if (err) {
          composeAnn.hideAnncmntBtn = true
          toasterService.error($rootScope.messages.fmsg.m0069)
        }
      })
    }
    /**
         * @method onHideCreateAnnModal
         * @desc - callback for create announcement modal hide
         * @memberOf Controllers.composeAnnouncementCtrl
         */
    composeAnn.onHideCreateAnnModal = function () {
      if (composeAnn.announcement === null && composeAnn.isMetaModified !== true) {
        composeAnn.isMetaModified = false
      } else if (composeAnn.isApprove === true) {
        composeAnn.isMetaModified = false
      } else {
        composeAnn.isMetaModified = true
      }
      if (composeAnn.isMetaModified === true && composeAnn.isMetaModifiedSteps !== true) {
        composeAnn.confirmationModal()
        return false
      } else if (composeAnn.isMetaModified === false && composeAnn.stepNumber === 1) {
        composeAnn.refreshFormValues()
        $state.go('announcementOutbox')
      }
    }
    /**
         * @method onApproveConfirmationModal
         * @desc - callback for confirmation modal on approve
         * @memberOf Controllers.composeAnnouncementCtrl
         */
    composeAnn.onApproveConfirmationModal = function () {
      composeAnn.isApprove = true
      composeAnn.refreshFormValues()
      composeAnn.hideModel('announcementCancelModal')
      $state.go('announcementOutbox')
      return true
    }
  }
])
