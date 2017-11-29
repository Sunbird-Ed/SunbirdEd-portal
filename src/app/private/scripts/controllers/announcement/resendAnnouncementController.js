'use strict'
angular.module('playerApp').controller('resendAnnouncementCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$timeout', 'config', 'toasterService', 'announcementService', 'fileUpload', 'AnnouncementModel', 'announcementAdapter',
  function ($rootScope, $scope, $state, $stateParams, $timeout, config, toasterService, announcementService, fileUpload, AnnouncementModel, announcementAdapter) {
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
      console.log(createAnn.stepNumber)
      if (createAnn.stepNumber === 1) {
        announcementAdapter.getResend($stateParams.announcementId).then(function (apiResponse) {
          createAnn.announcement = new AnnouncementModel.Announcement(apiResponse.result)

          createAnn.stepNumber = parseInt($stateParams.stepNumber) || 1
        // createAnn.announcement = $stateParams.announcement
          createAnn.initializeModal()

          angular.forEach(createAnn.announcement.links, function (value, key) {
            createAnn.addNewLink()
          })
        })
      } else {
        createAnn.announcement = $stateParams.announcement
      }

      createAnn.resendAnnouncement()
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
         * @method resendAnnouncement
         * @desc - function to initialize create announcement modal
         * @memberOf Controllers.resendAnnouncementCtrl
         */
    createAnn.resendAnnouncement = function () {
      $('#createAnnouncementModal').modal({
        closable: false,
        onShow: function () {
          $('.ui.modal.transition.hidden').remove()
        }
      }).modal('show')
    }

/**
         * @method resendAnnouncement
         * @desc - function to initialize create announcement modal
         * @memberOf Controllers.resendAnnouncementCtrl
         */
    createAnn.closePopup = function () {
      if (createAnn.isMetaModified) {
        createAnn.confirmationModal()
        return false
      }
    }

     /**
         * @method enableRecepientBtn
         * @desc - enable select recipients btn if all required fields are selected
         * @memberOf Controllers.createAnnouncementCtrl
         */
    createAnn.enableRecepientBtn = function () {
      var links = []
      if (createAnn.announcement.links) {
        angular.forEach(createAnn.announcement.links, function (value, key) {
          if (value.trim().length) {
            links.push(value)
          }
        })
      }

      var selectRecipientBtn = angular.element(document.querySelector('#selectRecipientBtn'))
      if (createAnn.announcement.details.title && createAnn.announcement.details.from && (true || createAnn.announcement.details.type) &&
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
        console.log('createAnn.announcement.selTar', createAnn.announcement.selTar)
      })

      console.log('createAnn.announcement.selTar1', createAnn.announcement.selTar)
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
         // console.log('dddddddddd', createAnn.announcement)

          if (_.isEmpty(createAnn.announcement.sourceId)) {
            createAnn.announcement.sourceId = $rootScope.rootOrgId
          }
        } else {
          return false
        }
      }

      createAnn.announcement.target.geo.ids = _.map(createAnn.announcement.selTar, 'id')
      var geoIds = _.map(createAnn.announcement.selTar, 'id')
      $timeout(function () {
        $rootScope.$broadcast('component:update', geoIds)
      }, 100)
      console.log(geoIds)

      $state.go('announcementResend', {stepNumber: ++createAnn.stepNumber, announcement: createAnn.announcement}, {reload: true})
    }

        /**
         * @method goToBackStep
         * @desc - Used to switch one step back to announcement creation
         * @memberOf Controllers.createAnnouncementCtrl
         */
    createAnn.goToBackStep = function () {
      $state.go('announcementResend', {stepNumber: --createAnn.stepNumber, announcement: createAnn.announcement}, {reload: true})
    }

    createAnn.confirmRecipients = function () {
      $rootScope.$emit('get:selected:items')

      if (createAnn.announcement.selTar && createAnn.announcement.selTar.length === 0) {
        toasterService.error($rootScope.messages.emsg.m0006)
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
      // console.log('uuuu', createAnn.announcement)

      announcementAdapter.resendAnnouncement(createAnn.announcement).then(function (apiResponse) {
        createAnn.isMetaModified = false
        createAnn.hideModel('createAnnouncementModal')
        $('#announcementResendModal').modal('show')
      }, function (err) {
        toasterService.error(err.data.params.errmsg)
      })
    }
  }
])
