'use strict'
angular.module('playerApp').controller('resendAnnouncementCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$timeout', 'config', 'toasterService', 'fileUpload', 'AnnouncementModel', 'announcementAdapter',
  function ($rootScope, $scope, $state, $stateParams, $timeout, config, toasterService, fileUpload, AnnouncementModel, announcementAdapter) {
    var composeAnn = this
    composeAnn.data = {}
    composeAnn.attachment = []
    composeAnn.senderlist = []
    composeAnn.targetIds = []
    composeAnn.disableBtn = true
    composeAnn.showUrlField = false
    composeAnn.errorFlag = false
    composeAnn.isMetaModified = false
    composeAnn.announcementType = []
    composeAnn.repeatableWebLinks = []
    composeAnn.hideAnncmntBtn = false
    composeAnn.uploadAttchement = false
    composeAnn.editAction = true
    composeAnn.isApprove = false
    composeAnn.stepNumber = parseInt($stateParams.stepNumber) || 1
    composeAnn.config = {
      'geo': {
        'adopter': 'SERVICE',
        'service': 'geoService'
      }
    }

    /**
     * @method getResend
     * @desc - function to resend announcement
     * @memberOf Controllers.announcementOutboxListController
     * @param {int} [announcementId] [to make getResend api call]
     */
    composeAnn.init = function () {
      composeAnn.isMetaModifiedSteps = $stateParams.isMetaModifiedSteps
      composeAnn.stepNumber = parseInt($stateParams.stepNumber) || 1
      if ($stateParams.announcement === undefined && composeAnn.stepNumber === 1) {
        announcementAdapter.getResend($stateParams.announcementId).then(function (apiResponse) {
          composeAnn.announcement = new AnnouncementModel.Announcement(apiResponse.result)
          composeAnn.initializeModal()
          composeAnn.enableRecepientBtn()
          composeAnn.initializeFileUploader(true)
          angular.forEach(composeAnn.announcement.links, function (value, key) {
            composeAnn.addNewLink()
          })

          _.forEach(composeAnn.announcement.attachments, function (attachment, index) {
            composeAnn.announcement.attachments[index] = JSON.parse(attachment)
          })
        })
      } else {
        composeAnn.announcement = $stateParams.announcement
        if(composeAnn.stepNumber === 1 && composeAnn.announcement !== undefined && !(_.isEmpty(composeAnn.announcement.links))){
          angular.forEach(composeAnn.announcement.links, function (value, key) {
            composeAnn.addNewLink()
          })
        }
      }



      composeAnn.resendAnnouncement()

      if (composeAnn.stepNumber === 1) {
        announcementAdapter.getDefinitions($rootScope.rootOrgId)
          .then(function (response) {
            if (response.result.announcementTypes.content) {
              composeAnn.announcementType = _.map(response.result.announcementTypes.content, 'name')
            }
            if (response.result.senderList) {
              angular.forEach(response.result.senderList, function (value, key) {
                composeAnn.senderlist.push(value)
              })
            }

            $('#announcementType').dropdown('set text', composeAnn.announcement.details.type)
          }, function (err) {
            composeAnn.hideAnncmntBtn = true
            toasterService.error($rootScope.messages.fmsg.m0069)
          })
      }

      if (composeAnn.stepNumber === 2) {
        $timeout(function () {
          $rootScope.$broadcast('component:update', composeAnn.announcement.target.geo.ids)
        }, 100)
      }
    }

    /**
     * @method addNewLink
     * @desc - add new url input box
     * @memberOf Controllers.createAnnouncementCtrl
     */
    composeAnn.addNewLink = function () {
      var newItemNo = composeAnn.repeatableWebLinks.length + 1
      composeAnn.repeatableWebLinks.push({
        'id': 'choice' + newItemNo
      })
      composeAnn.showUrlField = true
    }

    /**
     * @method confirmationModal
     * @desc - display confirmation modal when user click on close icon
     * @memberOf Controllers.createAnnouncementCtrl
     */
    composeAnn.confirmationModal = function () {
      $timeout(function () {
        $('#announcementCancelModal').modal({
          allowMultiple: true,
          onDeny: function () {
            return true
          },
          onApprove: function () {
            composeAnn.isApprove = true
            composeAnn.refreshFormValues()
            composeAnn.hideModel('announcementCancelModal')
            $state.go('announcementOutbox')
            return true
          }
        }).modal('show')
      }, 10)
    }

    /**
     * @method refreshFormValues
     * @desc - reset form values
     * @memberOf Controllers.createAnnouncementCtrl
     */
    composeAnn.refreshFormValues = function () {
      composeAnn.disableBtn = true
      composeAnn.stepNumber = 1
      $('#announcementType').dropdown('restore defaults')
      $('#createAnnouncementModal').modal('refresh')
      composeAnn.data = {}
      composeAnn.isMetaModified = false
      composeAnn.repeatableWebLinks.length = 0
      composeAnn.showUrlField = false
      composeAnn.attachment = []
      $('.qq-upload-list').children('li').remove()
    }

    /**
     * @method resendAnnouncement
     * @desc - function to initialize create announcement modal
     * @memberOf Controllers.resendAnnouncementCtrl
     */
    composeAnn.resendAnnouncement = function () {
      $('#createAnnouncementModal').modal({
        closable: false,
        onShow: function () {
          $('.ui.modal.transition.hidden').remove()
        },
        onHide: function () {
          if ($stateParams.announcement === undefined && composeAnn.isMetaModified !== true) {
            composeAnn.isMetaModified = false
          } else if (composeAnn.isApprove === true) {
            composeAnn.isMetaModified = false
          } else {
            composeAnn.isMetaModified = true
          }
          if (composeAnn.isMetaModified === true && composeAnn.isMetaModifiedSteps !== true) {
            composeAnn.confirmationModal()
            return false
          } else if (composeAnn.isMetaModified == false && composeAnn.stepNumber === 1) {
            $state.go('announcementOutbox')
            return true
          }
        }
      }).modal('show')
    }

    /**
     * @method enableRecepientBtn
     * @desc - enable select recipients btn if all required fields are selected
     * @memberOf Controllers.createAnnouncementCtrl
     */
    composeAnn.enableRecepientBtn = function (status) {
      if (status === undefined) {
        status = true
      }
      var links = []
      if (composeAnn.announcement && composeAnn.announcement.links) {
        angular.forEach(composeAnn.announcement.links, function (value, key) {
          if (value.trim().length) {
            links.push(value)
          }
        })
      }

      var selectRecipientBtn = angular.element(document.querySelector('#selectRecipientBtn'))
      if (composeAnn.announcement && composeAnn.announcement.details.title && composeAnn.announcement.details.from && (true || composeAnn.announcement.details.type) &&
        (composeAnn.uploadAttchement || composeAnn.announcement.details.description || links.length)) {
        composeAnn.disableBtn = false
        selectRecipientBtn.removeClass('disabled')
      } else {
        composeAnn.disableBtn = true
        selectRecipientBtn.addClass('disabled')
      }
      if (status === false) {
        composeAnn.isMetaModified = false
      } else {
        composeAnn.isMetaModified = true
      }
    }

    /**
     * @method initializeModal
     * @desc - function to initialize semantic dropdowns
     * @memberOf Controllers.createAnnouncementCtrl
     */
    composeAnn.initializeModal = function () {
      $timeout(function () {
        $('#announcementType').dropdown({
          onChange: function (value, text, $choice) {
            composeAnn.enableRecepientBtn()
          }
        })
      }, 10)
      $rootScope.$on('selected:items', function (evet, data) {
        composeAnn.announcement.selTar = _.clone(data.geo)
      })
    }

    /**
     * @method goToNextStep
     * @desc - Used to swtch to next step of announcement creation
     * @memberOf Controllers.createAnnouncementCtrl
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

      // composeAnn.announcement.target.geo.ids = _.map(composeAnn.announcement.selTar, 'id')
      var geoIds = _.map(composeAnn.announcement.selTar, 'id')
      $timeout(function () {
        $rootScope.$broadcast('component:update', geoIds)
      }, 100)
      composeAnn.isMetaModifiedSteps = true
      $state.go('announcementResend', { stepNumber: ++composeAnn.stepNumber, announcement: composeAnn.announcement, isMetaModifiedSteps: false }, { reload: true })
    }

    /**
     * @method goToBackStep
     * @desc - Used to switch one step back to announcement creation
     * @memberOf Controllers.createAnnouncementCtrl
     */
    composeAnn.goToBackStep = function () {
      composeAnn.isMetaModifiedSteps = true
      $state.go('announcementResend', { stepNumber: --composeAnn.stepNumber, announcement: composeAnn.announcement, isMetaModifiedSteps: false }, { reload: true })
    }

    composeAnn.confirmRecipients = function () {
      $rootScope.$emit('get:selected:items')
      if (composeAnn.announcement.selTar && composeAnn.announcement.selTar.length === 0) {
        toasterService.error($rootScope.messages.emsg.m0006)
        $state.go('announcementResend', { stepNumber: 2, announcement: composeAnn.announcement, isMetaModifiedSteps: composeAnn.isMetaModifiedSteps }, { reload: true })
        return false
      }

      return true
    }

    /**
     * @method hideModel
     * @desc - hide semantic modal
     * @memberOf Controllers.createAnnouncementCtrl
     * @param {string} [modalId] [description]
     */
    composeAnn.hideModel = function (modalId) {
      $('#' + modalId).modal('hide')
      $('#' + modalId).modal('hide others')
      $('#' + modalId).modal('hide all')
      $('#' + modalId).modal('hide dimmer')
    }

    /**
     * @method saveAnnouncement
     * @desc - prepare api request object and make create api call
     * @memberOf Controllers.createAnnouncementCtrl
     * @param {object} [data] [form data]
     */
    composeAnn.saveAnnouncement = function () {
      composeAnn.isMetaModifiedSteps = true
      announcementAdapter.resendAnnouncement(composeAnn.announcement).then(function (apiResponse) {
        $('#announcementResendModal').modal({
          closable: false
        }).modal('show')
        $state.go('announcementOutbox')
        composeAnn.hideModel('createAnnouncementModal')
        portalTelemetryService.fireAnnouncementImpressions({
          env: 'community.announcements',
          type: 'view',
          pageid: 'announcement_form_complete',
          id: $stateParams.announcementId,
          name: $stateParams.telemetryAnnTitle,
          url: '/private/index#!/announcement/create/4'
        }, $stateParams.userIdHashTag)
      }, function (err) {
        toasterService.error(err.data.params.errmsg)
      })
    }

    /**
     * @method getReadableFileSize
     * @desc - convert byteSize into KB, MB
     * @memberOf Controllers.createAnnouncementCtrl
     * @param {int} [byteSize] [file size]
     * @return {string} [return readable file size]
     */
    composeAnn.getReadableFileSize = function (byteSize) {
      var sizes = ['Bytes', 'KB', 'MB']
      if (byteSize) {
        var i = parseInt(Math.floor(Math.log(byteSize) / Math.log(1024)))
        return composeAnn.convertedFileSize = Math.round(byteSize / Math.pow(1024, i), 2) + ' ' + sizes[i]
      } else {
        return composeAnn.convertedFileSize = '0 Byte'
      }
    }

    /**
     * @method initializeFileUploader
     * @desc - create fine uploader instance by passing required params
     * @memberOf Controllers.createAnnouncementCtrl
     */
    composeAnn.initializeFileUploader = function (resend) {
      var apiUrl = config.URL.BASE_PREFIX + config.URL.LEARNER_PREFIX + config.URL.CONTENT.UPLOAD_MEDIA
      var options = {
        fileSizeLimit: config.AnncmntMaxFileSizeToUpload,
        allowedExtensions: config.AnncmntAllowedFileExtension,
        fileSizeErrorText: $rootScope.messages.imsg.m0021,
        containerName: 'attachments/announcement',
        uploadSuccess: composeAnn.onUploadComplete,
        onCancel: composeAnn.onUploadCancel
      }
      var resend = resend || composeAnn.editAction
      if(resend){
        fileUpload.createFineUploadInstance(options,function(data){
          /*angular.forEach(composeAnn.announcement.attachments, function (attachment, key) {
            if(!(_.isPlainObject(attachment))) {
              announcement = JSON.parse(announcement)
            }
            $('.qq-upload-list').append('<li class="qq-file-id-0 qq-upload-retryable w3-container w3-border w3-round-xlarge qq-upload-success" qq-file-id="'+key+'"><i class="qq-upload-cancel-selector cursor-pointer remove icon qq-hide" id="qq-upload-cancel-manually" onclick="cancelUploadFile()" style="float: right;"></i><span class="qq-upload-file-selector qq-upload-file" title="logo.png" style="margin-top: -30px !important;width: 222px;">'+attachment.name+'</span><input class="qq-edit-filename-selector qq-edit-filename" tabindex="0" type="text"><span role="status" class="qq-upload-status-text-selector qq-upload-status-text"></span></li>');
          })*/
        })
      }
    }

    /**
     * @method onUploadComplete
     * @desc - invoked after attachement uploaded
     * @memberOf Controllers.createAnnouncementCtrl
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
     * @memberOf Controllers.createAnnouncementCtrl
     * @param {int} [id] [uploaded file count]
     * @param {string} [name] [selected fine name]
     */
    composeAnn.onUploadCancel = function (id, name) {
      var deleteFlag = composeAnn.attachment.splice(id, 1)
      if (deleteFlag.length === 0) {
        angular.forEach(composeAnn.attachment, function (value, key) {
          var details = JSON.parse(value)
          if (details.name === name) {
            composeAnn.attachment.splice(key, 1)
          }
        })
      }

      if (composeAnn.attachment.length === 0) {
        composeAnn.uploadAttchement = false
      }
      composeAnn.enableRecepientBtn()
      $('#hide-section-with-button').css('style.display', 'block')
    }

    /**
     * @method removeRicipients
     * @desc - remove selected recipients
     * @memberOf Controllers.createAnnouncementCtrl
     * @param {object} [item] [current selected item]
     */
    composeAnn.removeRecipients = function (item) {
      _.remove(composeAnn.announcement.target.geo.ids, function (arg) {
        if (arg == item.id) {
          return true
        }
      })
      composeAnn.announcement.target.geo.ids
      _.remove(composeAnn.announcement.selTar, function (arg) {
        if (arg.location === item.location) {
          item.selected = false
          toasterService.info(item.location + ' ' + $rootScope.messages.imsg.m0020)
          return arg.location
        }
      })
      composeAnn.confirmRecipients()
    }
  }
])