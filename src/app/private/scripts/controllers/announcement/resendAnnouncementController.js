'use strict'
angular.module('playerApp').controller('resendAnnouncementCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$timeout', 'config', 'toasterService', 'fileUpload', 'AnnouncementModel', 'announcementAdapter',
  function ($rootScope, $scope, $state, $stateParams, $timeout, config, toasterService, fileUpload, AnnouncementModel, announcementAdapter) {
    var createAnn = this
    createAnn.data = {}
    createAnn.attachment = []
    createAnn.senderlist = []
    createAnn.targetIds = []
    createAnn.disableBtn = true
    createAnn.showUrlField = false
    createAnn.errorFlag = false
    createAnn.isMetaModified = false
    createAnn.announcementType = []
    createAnn.repeatableWebLinks = []
    createAnn.hideAnncmntBtn = false
    createAnn.uploadAttchement = false
    createAnn.editAction = true
    createAnn.stepNumber = parseInt($stateParams.stepNumber) || 1
    createAnn.config = {
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
    createAnn.init = function () {
        createAnn.isMetaModifiedSteps = $stateParams.isMetaModifiedSteps
        createAnn.stepNumber = parseInt($stateParams.stepNumber) || 1
        if ($stateParams.announcement === undefined && createAnn.stepNumber === 1) {
            announcementAdapter.getResend($stateParams.announcementId).then(function (apiResponse) {
                createAnn.announcement = new AnnouncementModel.Announcement(apiResponse.result)
                createAnn.initializeModal()

                angular.forEach(createAnn.announcement.links, function (value, key) {
                    createAnn.addNewLink()
                })
                createAnn.enableRecepientBtn()
                //console.log(createAnn.announcement.attachments)
            })
        } else {
            createAnn.announcement = $stateParams.announcement
        }

      createAnn.resendAnnouncement()

      if (createAnn.stepNumber === 1) {
            announcementAdapter.getDefinitions($rootScope.rootOrgId)
            .then(function (response) {
                if (response.result.announcementTypes.content) {
                    createAnn.announcementType = _.map(response.result.announcementTypes.content, 'name')
                }
                if (response.result.senderList) {
                    angular.forEach(response.result.senderList, function (value, key) {
                    createAnn.senderlist.push(value)
                    })
                }

                $('#announcementType').dropdown('set text', createAnn.announcement.details.type)
            }, function (err) {
                createAnn.hideAnncmntBtn = true
                toasterService.error($rootScope.messages.fmsg.m0069)
            })
        }

      if (createAnn.stepNumber === 2) {
        $timeout(function () {
          $rootScope.$broadcast('component:update', createAnn.announcement.target.geo.ids)
        }, 100)
      }
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
     * @method refreshFormValues
     * @desc - reset form values
     * @memberOf Controllers.createAnnouncementCtrl
     */
    createAnn.refreshFormValues = function () {
      createAnn.disableBtn = true
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
     * @method resendAnnouncement
     * @desc - function to initialize create announcement modal
     * @memberOf Controllers.resendAnnouncementCtrl
     */
    createAnn.resendAnnouncement = function () {
      if ($stateParams.announcement) {
        createAnn.isMetaModified = true
      }
      $('#createAnnouncementModal').modal({
        closable: false,
        onShow: function () {
          $('.ui.modal.transition.hidden').remove()
        },
        onHide: function () {
          if (createAnn.isMetaModified === true && createAnn.isMetaModifiedSteps !== true) {
            createAnn.confirmationModal()
            return false
          }
          $state.go('announcementOutbox')
        }
      }).modal('show')
    }

    /**
     * @method enableRecepientBtn
     * @desc - enable select recipients btn if all required fields are selected
     * @memberOf Controllers.createAnnouncementCtrl
     */
    createAnn.enableRecepientBtn = function () {
      var links = []
      if (createAnn.announcement && createAnn.announcement.links) {
        angular.forEach(createAnn.announcement.links, function (value, key) {
          if (value.trim().length) {
            links.push(value)
          }
        })
      }

      var selectRecipientBtn = angular.element(document.querySelector('#selectRecipientBtn'))
      if (createAnn.announcement && createAnn.announcement.details.title && createAnn.announcement.details.from && (true || createAnn.announcement.details.type) &&
        (createAnn.uploadAttchement || createAnn.announcement.details.description || links.length)) {
        createAnn.disableBtn = false
        selectRecipientBtn.removeClass('disabled')
      } else {
        createAnn.disableBtn = true
        selectRecipientBtn.addClass('disabled')
      }
      createAnn.isMetaModified = true
    }

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
        createAnn.announcement.selTar = _.clone(data.geo)
      })
    }

    /**
     * @method goToNextStep
     * @desc - Used to swtch to next step of announcement creation
     * @memberOf Controllers.createAnnouncementCtrl
     */
    createAnn.goToNextStep = function () {
      // Current step is confirm recipients
      if (createAnn.stepNumber !== 1) {
        if (createAnn.confirmRecipients()) {
          if (_.isEmpty(createAnn.announcement.sourceId)) {
            createAnn.announcement.sourceId = $rootScope.rootOrgId
          }
        } else {
          return false
        }
      }

      // createAnn.announcement.target.geo.ids = _.map(createAnn.announcement.selTar, 'id')
      var geoIds = _.map(createAnn.announcement.selTar, 'id')
      $timeout(function () {
        $rootScope.$broadcast('component:update', geoIds)
      }, 100)

      $state.go('announcementResend', { stepNumber: ++createAnn.stepNumber, announcement: createAnn.announcement, isMetaModifiedSteps: createAnn.isMetaModifiedSteps  }, { reload: true })
    }

    /**
     * @method goToBackStep
     * @desc - Used to switch one step back to announcement creation
     * @memberOf Controllers.createAnnouncementCtrl
     */
    createAnn.goToBackStep = function () {
      $state.go('announcementResend', { stepNumber: --createAnn.stepNumber, announcement: createAnn.announcement, isMetaModifiedSteps: createAnn.isMetaModifiedSteps}, { reload: true })
    }

    createAnn.confirmRecipients = function () {
      $rootScope.$emit('get:selected:items')
      if (createAnn.announcement.selTar && createAnn.announcement.selTar.length === 0) {
        toasterService.error($rootScope.messages.emsg.m0006)
        $state.go('announcementResend', { stepNumber: 2, announcement: createAnn.announcement, isMetaModifiedSteps: createAnn.isMetaModifiedSteps}, { reload: true })
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
    createAnn.hideModel = function (modalId) {
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
    createAnn.saveAnnouncement = function () {
      announcementAdapter.resendAnnouncement(createAnn.announcement).then(function (apiResponse) {
        createAnn.isMetaModified = false
        createAnn.hideModel('createAnnouncementModal')
        $('#announcementResendModal').modal('show')
        $state.go('announcementOutbox')
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
        fileSizeLimit: config.AnncmntMaxFileSizeToUpload,
        allowedExtensions: config.AnncmntAllowedFileExtension,
        fileSizeErrorText: $rootScope.messages.imsg.m0021,
        containerName: 'attachments/announcement',
        uploadSuccess: createAnn.onUploadComplete,
        onCancel: createAnn.onUploadCancel
      }
      fileUpload.createFineUploadInstance(options,function(data){
        angular.forEach(createAnn.announcement.attachments, function (announcement, key) {
          announcement = JSON.parse(announcement)
          $('.qq-upload-list').append('<li class="qq-file-id-0 qq-upload-retryable w3-container w3-border w3-round-xlarge qq-upload-success" qq-file-id="'+key+'"><i class="qq-upload-cancel-selector cursor-pointer remove icon qq-hide" id="qq-upload-cancel-manually" onclick="cancelUploadFile()" style="float: right;"></i><span class="qq-upload-file-selector qq-upload-file" title="logo.png" style="margin-top: -30px !important;width: 222px;">'+announcement.name+'</span><input class="qq-edit-filename-selector qq-edit-filename" tabindex="0" type="text"><span role="status" class="qq-upload-status-text-selector qq-upload-status-text"></span></li>');

        })
      })
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
      createAnn.announcement.attachments.push(uploadDetails)
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
      $('#hide-section-with-button').css('style.display', 'block')
    }

    /**
     * @method removeRicipients
     * @desc - remove selected recipients
     * @memberOf Controllers.createAnnouncementCtrl
     * @param {object} [item] [current selected item]
     */
    createAnn.removeRecipients = function (item) {
         _.remove(createAnn.announcement.target.geo.ids, function (arg) {
            if(arg == item.id) {
                return true
            }
         })
        createAnn.announcement.target.geo.ids
      _.remove(createAnn.announcement.selTar, function (arg) {
        if (arg.location == item.location) {
          item.selected = false
          toasterService.info(item.location + ' ' + $rootScope.messages.imsg.m0020)
          return arg.location
        }
      })
      createAnn.confirmRecipients()
    }
  }
])
