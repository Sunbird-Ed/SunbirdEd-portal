'use strict'

angular.module('playerApp')
  .controller('announcementOutboxListController', ['$rootScope', '$scope',
    'announcementService', '$timeout', '$state', '$stateParams', 'toasterService', 'adminService', 'PaginationService',
    function($rootScope, $scope, announcementService, $timeout, $state, $stateParams, toasterService, adminService, PaginationService) {
      var announcementOutboxData = this
      announcementOutboxData.pager = {};
      announcementOutboxData.setPage = setPage;
      announcementOutboxData.showLoader = true
      announcementOutboxData.showDataDiv = false

      announcementOutboxData.renderAnnouncementList = function() {
        announcementService.getOutBoxAnnouncementList($rootScope.userId).then(function(apiResponse) {
            apiResponse = apiResponse.data;
            if (apiResponse && apiResponse.responseCode === 'OK') {
              announcementOutboxData.result = apiResponse.result
              announcementOutboxData.listData = apiResponse.result.announcements
              initController();
              if (announcementOutboxData.listData.length > 0) {
                announcementOutboxData.showDataDiv = true
              }
            } else {
              toasterService.error(apiResponse.params.errmsg)
            }
          })
          .catch(function(err) {
            toasterService.error(err.data.params.errmsg)
          })
          .finally(function() {
            announcementOutboxData.showLoader = false
          });
      }

      function initController() {
        // initialize to page 1
        announcementOutboxData.setPage(1);
      }

      function setPage(page) {
        if (page < 1 || page > announcementOutboxData.pager.totalPages) {
          return;
        }
        // get pager object from service
        announcementOutboxData.pager = PaginationService.GetPager(announcementOutboxData.listData.length, page);
        // get current page of items
        announcementOutboxData.items = announcementOutboxData.listData.slice(announcementOutboxData.pager.startIndex, announcementOutboxData.pager.endIndex + 1);
      }

        announcementOutboxData.showModal = function(modalId) {
            $('#' + modalId).modal('show')
        }
        announcementOutboxData.closeModal = function(modalId) {
            $('#' + modalId).modal('hide')
        }
        announcementOutboxData.deleteAnnouncement = function(announcementId) {
            // Call the delete service
            announcementService.deleteAnnouncement(announcementId).then(function(apiResponse) {
                apiResponse = apiResponse.data
                //console.log(JSON.stringify(apiResponse))
                // Check if response successful
                if (apiResponse && apiResponse.responseCode === 'OK' && apiResponse.result.status === 'cancelled') {
                    // Show success toaster
                    toasterService.success('Announcement cancelled successfully.')
                    announcementOutboxData.renderAnnouncementList()
                } else {
                    toasterService.error(apiResponse.params.errmsg)
                }
            }).catch(function(err) {
                toasterService.error(err.data.params.errmsg)
            }).finally(function() {
                // Close the modal popup and reset v alue of deleteAnnouncementId
                announcementOutboxData.closeModal('announcementDeleteModal')
            })
        }
        announcementOutboxData.getAnnouncementDetailsFromId = function(announcementId) {
	      announcementService.getAnnouncementDetailsFromId(announcementId).then(function(apiResponse) {
	        apiResponse = apiResponse.data
	        //console.log(JSON.stringify(apiResponse))
	        if (apiResponse && apiResponse.responseCode === 'OK') {
	          // TODO - open the create announcement with edit mode and prepopulated data
	          announcementOutboxData.resendAnnouncement(apiResponse.result)
	        } else {
	          toasterService.error(apiResponse.params.errmsg)
	        }
	      }).catch(function(err) {
	        toasterService.error(err.data.params.errmsg)
	      }).finally(function() {})
	    }
	    announcementOutboxData.resendAnnouncement = function(announcement) {
	      var requestBody = {"request": {"sourceId": announcement.sourceid, "createdBy": announcement.userid, "type": announcement.details.type, "links": announcement.links, "title": announcement.details.title, "description": announcement.details.description, "from": announcement.details.from, "target": announcement.target}}
        //console.log(JSON.stringify(announcement))
        announcementService.resendAnnouncement(requestBody).then(function(apiResponse) {
	        apiResponse = apiResponse.data
          //console.log(JSON.stringify(apiResponse))
	        if (apiResponse && apiResponse.responseCode === 'OK') {
	          toasterService.success('Announcement resent successfully.')
	          announcementOutboxData.renderAnnouncementList()
	        } else {
	          toasterService.error(apiResponse.params.errmsg)
	        }
	      }).catch(function(err) {
	        toasterService.error(err.data.params.errmsg)
	      }).finally(function() {})
	    }
    }
  ])