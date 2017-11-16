'use strict'

angular.module('playerApp')
	.service('announcementService', ['$http', function($http) {

		var extensions = {
			'application/png': 'PNG',
			'application/pdf': 'PDF',
			'application/jpeg': 'JPEG',
			'application/jpg': 'JPEG'
		}

		/**
		 * @class announcementService
		 * @desc Service to manage announcement.
		 * @memberOf Services
		 */

		/**
		 * @method httpCall
		 * @desc Http call
		 * @memberOf Services.httpCall
		 * @param {string}  url - Url
		 * @param {Object}  data - Request
		 * @param {string}  method - Methods (CURD)
		 * @param {object}  header - Header
		 * @instance
		 */
		function httpCall(url, data, method) {
			var headers = {
				'Content-Type': 'application/json',
			};
			return $http({
				method: method,
				url: url,
				headers: headers,
				data: data
			});
		}

		/**
		 * @method getOutBoxAnnouncementList
		 * @desc Get announcement outbox list data
		 * @memberOf Services.announcementService
		 * @param {Object}   req - Request Object
		 * @param {string}  datasetType - Data type
		 * @returns {Promise} Promise object represents announcement outbox list dashboard data
		 * @instance
		 */
		this.getOutBoxAnnouncementList = function(userId) {
			var data = {
				"request": {
					"userId": userId
				}
			};
			return httpCall('/api/announcement/v1/user/outbox', data, 'POST')
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
		this.getInboxAnnouncementList = function(userId) {
			var data = {
				"request": {
					"userId": userId
				}
			};
			return httpCall('/api/announcement/v1/user/inbox', data, 'POST')
		}
		/**
		 * @method getFileExtension
		 * @desc Get file extension
		 * @memberOf Services.announcementService
		 * @param {string}  mimeType - Mime type
		 * @returns {string} returns extension of a file
		 * @instance
		 */
		this.getFileExtension = function(mimeType) {
			return extensions[mimeType];
		}

		/**
		 * @method createAnnouncement
		 * @desc Send announcement data to API
		 * @memberOf Services.announcementService
		 * @param {object}  req - Announcement form post value
		 * @returns {object} returns response of API
		 * @instance
		 */
		this.createAnnouncement = function(req) {
			return httpCall('/api/announcement/v1/create', req, 'POST')
		}

		/**
		 * @method getDefinitions
		 * @desc get announcement type and sender list
		 * @memberOf Services.announcementService
		 * @param {object}  req - rootOrgId, userid and definition type array
		 * @returns {object} returns response of API
		 * @instance
		 */
		this.getDefinitions = function(req) {
			return httpCall('/api/announcement/v1/definitions', req, 'POST')
		}

		/**
		 * @method readAnnouncement
		 * @desc read announcement
		 * @memberOf Services.announcementService
		 * @param {object}  req - announcementid, userid
		 * @returns {object} returns response of API
		 * @instance
		 */
		this.readAnnouncement = function(req) {
			return httpCall('/api/announcement/v1/read', req, 'POST')
		}

		/**
		 * @method receivedAnnouncement
		 * @desc received announcement
		 * @memberOf Services.announcementService
		 * @param {string}  req - userId, AnnId
		 * @returns {object} returns response of API
		 * @instance
		 */
		this.receivedAnnouncement = function(userId, AnnId) {
			var req = {
				"request": {
					"userId": userId,
					"announcementId": AnnId,
					"channel": "web"
				}
			}
			return httpCall('/api/announcement/v1/received', req, 'POST')
		}

		/**
		 * @method deleteAnnouncement
		 * @desc Send requestBody to cancel annoucement API
		 * @memberOf Services.announcementService
		 * @param {string}  requestBody - request body
		 * @returns {object} returns response of API
		 * @instance
		 */
		this.deleteAnnouncement = function(requestBody) {
			var URL = '/api/announcement/v1/cancel'
			return httpCall(URL, requestBody, 'DELETE', {})
		}

		/**
		 * @method getResend
		 * @desc Send announcementId to get resend API
		 * @memberOf Services.announcementService
		 * @param {string}  announcementId - Announcement Id
		 * @returns {object} returns response of API
		 * @instance
		 */
		this.getResend = function(announcementId) {
			var URL = '/api/announcement/v1/resend/' + announcementId
			return httpCall(URL, {}, 'GET', {})
		}

		/**
		 * @method resendAnnouncement
		 * @desc Resend announcement
		 * @memberOf Services.announcementService
		 * @param {object}  requestBody - Announcement object
		 * @returns {object} returns response of API
		 * @instance
		 */
		this.resendAnnouncement = function(requestBody) {
			var URL = '/api/announcement/v1/resend'
			return httpCall(URL, requestBody, 'POST', {})
		}
	}])
