'use strict'

angular.module('playerApp')
  .service('announcementAdapter', ['$rootScope', '$http', 'httpAdapter', 'config', '$q', 'toasterService',
    function ($rootScope, $http, httpAdapter, config, $q, toasterService) {
      var extensions = {
        'application/png': 'PNG',
        'application/pdf': 'PDF',
        'application/jpeg': 'JPEG',
        'application/jpg': 'JPEG',
        'image/png': 'PNG',
        'image/jpeg': 'JPEG',
        'image/jpg': 'JPEG'
      }

      /**
       * @class announcementService
       * @desc Service to manage announcement.
       * @memberOf Services
       */

      /**
       * @method getOutBoxAnnouncementList
       * @desc Get announcement outbox list data
       * @memberOf Services.announcementService
       * @param {Object}   req - Request Object
       * @param {string}  datasetType - Data type
       * @returns {Promise} Promise object represents announcement outbox list dashboard data
       * @instance
       */
      this.getOutBoxAnnouncementList = function (userId) {
        var data = {
          'request': {
            'userId': userId
          }
        }
        return handleHttpRequest(config.URL.ANNOUNCEMENT.OUTBOX_LIST, data, 'POST', $rootScope.messages.fmsg.m0070)
      }

      function handleHttpRequest (url, data, type, errMsg) {
        var deferred = $q.defer()
        var response = httpAdapter.httpCall(url, data, type)
        response.then(function (res) {
          if (res && res.responseCode === 'OK') {
            deferred.resolve(res)
          } else {
            toasterService.error(errMsg)
            deferred.reject(res)
          }
        }, function (err) {
          toasterService.error($rootScope.messages.emsg.m0005)
          deferred.reject(err)
        })
        return deferred.promise
      }
      /**
       * @method getAnnouncementById
       * @desc get announcement
       * @memberOf Services.announcementService
       * @param {string}  requestBody - Announcement id
       * @returns {object} returns response of API
       * @instance
       */
      this.getAnnouncementById = function (announcementId) {
        return handleHttpRequest(config.URL.ANNOUNCEMENT.GET_BY_ID + announcementId, '', 'GET', $rootScope.messages.fmsg.m0074)
      }

      /**
       * @method getInboxAnnouncementList
       * @desc Get announcement inbox list data
       * @memberOf Services.announcementService
       * @param {Object}   req - Request Object
       * @param {string}  datasetType - Data type
       * @returns {Promise} Promise object represents announcement inbox list dashboard data
       * @instance
       */
      this.getInboxAnnouncementList = function (userId, reqLimit) {
        var data = {
          'request': {
            'userId': userId
          }
        }

        if (reqLimit > 0) {
          data.request.limit = reqLimit
        }
        return handleHttpRequest(config.URL.ANNOUNCEMENT.INBOX_LIST, data, 'POST', $rootScope.messages.fmsg.m0072)
      }

      /**
       * @method getFileExtension
       * @desc Get file extension
       * @memberOf Services.announcementService
       * @param {string}  mimeType - Mime type
       * @returns {string} returns extension of a file
       * @instance
       */
      this.getFileExtension = function (mimeType) {
        return extensions[mimeType]
      }

      /**
       * @method createAnnouncement
       * @desc Send announcement data to API
       * @memberOf Services.announcementService
       * @param {object}  req - Announcement form post value
       * @returns {object} returns response of API
       * @instance
       */
      this.createAnnouncement = function (annoucement) {
        // Convert attachment object to string
          _.forEach(annoucement.attachments, function (attachment, index) {
          annoucement.attachments[index] = JSON.stringify(attachment)
        })
        var data = {
          request: {
            title: annoucement.details.title,
            from: annoucement.details.from,
            type: annoucement.details.type,
            description: annoucement.details.description,
            links: annoucement.links,
            sourceId: annoucement.sourceId,
            createdBy: annoucement.createdBy,
            target: annoucement.target,
            attachments: annoucement.attachments
          }
        }
        return handleHttpRequest(config.URL.ANNOUNCEMENT.CREATE, data, 'POST')
      }
      /**
       * @method getDefinitions
       * @desc get announcement type and sender list
       * @memberOf Services.announcementService
       * @param {object}  req - rootOrgId, userid and definition type array
       * @returns {object} returns response of API
       * @instance
       */
      this.getDefinitions = function (rootOrgId, userId) {
        var data = {
          request: {
            'rootorgid': rootOrgId,
            'userid': userId,
            'definitions': ['announcementtypes', 'senderlist']
          }
        }
        return handleHttpRequest(config.URL.ANNOUNCEMENT.DEFINITIONS, data, 'POST')
      }

      /**
       * @method readAnnouncement
       * @desc read announcement
       * @memberOf Services.announcementService
       * @param {object}  req - announcementid, userid
       * @returns {object} returns response of API
       * @instance
       */
      this.readAnnouncement = function (userId, annId) {
        var data = {
          request: {
            'userId': userId,
            'announcementId': annId,
            'channel': 'web'
          }
        }
        return handleHttpRequest(config.URL.ANNOUNCEMENT.READ, data, 'POST', $rootScope.messages.fmsg.m0073)
      }

      /**
       * @method receivedAnnouncement
       * @desc received announcement
       * @memberOf Services.announcementService
       * @param {string}  req - userId, AnnId
       * @returns {object} returns response of API
       * @instance
       */
      this.receivedAnnouncement = function (userId, annId) {
        var data = {
          'request': {
            'userId': userId,
            'announcementId': annId,
            'channel': 'web'
          }
        }
        return handleHttpRequest(config.URL.ANNOUNCEMENT.RECEIVED, data, 'POST')
      }

      /**
       * @method deleteAnnouncement
       * @desc Send requestBody to cancel annoucement API
       * @memberOf Services.announcementService
       * @param {string}  requestBody - request body
       * @returns {object} returns response of API
       * @instance
       */
      this.deleteAnnouncement = function (userId, announcementId) {
        var data = {
          'request': {
            'userId': userId,
            'announcementid': announcementId
          }
        }
        var URL = config.URL.ANNOUNCEMENT.CANCEL
        return handleHttpRequest(URL, data, 'DELETE', $rootScope.messages.fmsg.m0071)
      }

      /**
       * @method getResend
       * @desc Send announcementId to get resend API
       * @memberOf Services.announcementService
       * @param {string}  announcementId - Announcement Id
       * @returns {object} returns response of API
       * @instance
       */
      this.getResend = function (announcementId) {
        var URL = config.URL.ANNOUNCEMENT.RESEND + announcementId
        return handleHttpRequest(URL, {}, 'GET')
      }

      /**
       * @method resendAnnouncement
       * @desc Resend announcement
       * @memberOf Services.announcementService
       * @param {object}  requestBody - Announcement object
       * @returns {object} returns response of API
       * @instance
       */
      this.resendAnnouncement = function (annoucement) {
        // Convert attachment object to string
          _.forEach(annoucement.attachments, function (attachment, index) {
          annoucement.attachments[index] = JSON.stringify(attachment)
        })
        var data = {
          request: {
            title: annoucement.details.title,
            from: annoucement.details.from,
            type: annoucement.details.type,
            description: annoucement.details.description,
            links: annoucement.links,
            sourceId: annoucement.sourceId,
            createdBy: annoucement.createdBy,
            target: annoucement.target,
            attachments: annoucement.attachments
          }
        }
        var URL = config.URL.ANNOUNCEMENT.RESEND
        return handleHttpRequest(URL, data, 'POST')
      }
    }
  ])
