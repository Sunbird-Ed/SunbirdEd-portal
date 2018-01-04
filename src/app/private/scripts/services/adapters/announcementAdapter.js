'use strict'
angular.module('playerApp').service('announcementAdapter', ['$rootScope', '$http',
  'httpAdapter', 'config', '$q', 'toasterService',
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
     * @returns {Promise} Promise object represents announcement outbox list dashboard data
     * @instance
     */
    this.getOutBoxAnnouncementList = function (limit, pageNumber) {
      var data = {
        'request': {
          'limit': limit,
          'offset': (pageNumber - 1) * limit
        }
      }
      return handleHttpRequest(config.URL.ANNOUNCEMENT.OUTBOX_LIST, data, 'POST', $rootScope.messages.fmsg.m0070)
    }

    function handleHttpRequest (url, data, type, errMsg) {
      var deferred = $q.defer()
      var response = httpAdapter.httpCall(url, data, type, '')
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
      return handleHttpRequest(config.URL.ANNOUNCEMENT.GET_BY_ID + announcementId, '', 'GET',
        $rootScope.messages.fmsg.m0074)
    }
    /**
     * @method getInboxAnnouncementList
     * @desc Get announcement inbox list data
     * @memberOf Services.announcementService
     * @param {Number}  reqLimit - Request Limit
     * @returns {Promise} Promise object represents announcement inbox list dashboard data
     * @instance
     */
    this.getInboxAnnouncementList = function (reqLimit, pageNumber) {
      var data = {
        'request': {
          'limit': reqLimit,
          'offset': (pageNumber - 1) * reqLimit
        }
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
    this.createAnnouncement = function (annoucementObj, isResend) {
      var data = {
        request: {
          title: annoucementObj.title,
          from: annoucementObj.from,
          type: annoucementObj.type,
          description: annoucementObj.description,
          links: annoucementObj.links,
          sourceId: annoucementObj.sourceId,
          target: annoucementObj.target,
          attachments: annoucementObj.attachments
        }
      }
      var url = (isResend) ? config.URL.ANNOUNCEMENT.RESEND : config.URL.ANNOUNCEMENT.CREATE
      return handleHttpRequest(url, data, 'POST')
    }
    /**
     * @method getDefinitions
     * @desc get announcement type and sender list
     * @memberOf Services.announcementService
     * @param {String}  rootOrgId - rootOrgId
     * @returns {object} returns response of API
     * @instance
     */
    this.getDefinitions = function (rootOrgId) {
      var data = {
        request: {
          'rootOrgId': rootOrgId,
          'definitions': ['announcementTypes']
        }
      }
      return handleHttpRequest(config.URL.ANNOUNCEMENT.DEFINITIONS, data, 'POST')
    }
    /**
     * @method readAnnouncement
     * @desc read announcement
     * @memberOf Services.announcementService
     * @param {String}  annId - announcementid
     * @returns {object} returns response of API
     * @instance
     */
    this.readAnnouncement = function (annId) {
      var data = {
        request: {
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
     * @param {String}  annId - announcementid
     * @returns {object} returns response of API
     * @instance
     */
    this.receivedAnnouncement = function (annId) {
      var data = {
        'request': {
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
     * @param {String}  announcementId - announcementid
     * @returns {object} returns response of API
     * @instance
     */
    this.deleteAnnouncement = function (announcementId) {
      var data = {
        'request': {
          'announcementId': announcementId
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
  }
])
