'use strict'
angular.module('playerApp').controller('announcementOutboxListController', ['$rootScope', '$scope', 'announcementService', '$timeout', '$state', '$stateParams', 'toasterService', 'adminService', 'PaginationService',
    function($rootScope, $scope, announcementService, $timeout, $state, $stateParams, toasterService, adminService, PaginationService) {
        var announcementOutboxData = this
        announcementOutboxData.pager = {};
        announcementOutboxData.setPage = setPage;
        announcementOutboxData.showLoader = true
        announcementOutboxData.showDataDiv = false
        announcementOutboxData.renderAnnouncementList = function() {
            announcementService.getOutBoxAnnouncementList($rootScope.userId).then(function(apiResponse) {
                if (apiResponse && apiResponse.responseCode === 'OK') {
                    announcementOutboxData.listData = apiResponse.result.announcements
                    initController();
                    if (announcementOutboxData.listData.length > 0) {
                        announcementOutboxData.showDataDiv = true
                    }
                } else {
                    toasterService.error(apiResponse.params.errmsg)
                }
            }).catch(function(err) {
                toasterService.error(err.data.params.errmsg)
            }).finally(function() {
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
        announcementOutboxData.doAction = function(announcement) {
            // Get the actionBtnId
            var actionBtnId = 'actionBtn' + announcement.announcementId
            var actionText = $('#' + actionBtnId).text()
            // Perform the appropriate action
            if (actionText == 'Delete') {
                announcementOutboxData.deleteAnnouncementId = announcement.announcementId
                announcementOutboxData.actionBtnId = actionBtnId
                announcementOutboxData.showModal('announcementDeleteModal')
            } else if (actionText == 'Resend') {
                // TODO integrate the create announcement flow for edit and resend
                announcementOutboxData.resendAnnouncement();
                announcementOutboxData.resendAnnouncementObj = announcement
                announcementOutboxData.actionBtnId = actionBtnId
                announcementOutboxData.showModal('announcementResendModal')
            }
        }
        announcementOutboxData.showModal = function(modalId) {
            $('#' + modalId).modal('show')
        }
        announcementOutboxData.closeModal = function(modalId) {
            $('#' + modalId).modal('hide')
        }
        announcementOutboxData.deleteAnnouncement = function() {
            // Call the delete service
            announcementService.deleteAnnouncement(announcementOutboxData.deleteAnnouncementId).then(function(apiResponse) {
                apiResponse = apiResponse.data
                // Check if response successful
                if (apiResponse && apiResponse.responseCode === 'OK' && apiResponse.result.status === 'cancelled') {
                    // Show success toaster
                    toasterService.success('Announcement deleted successfully.')
                    announcementOutboxData.renderAnnouncementList()
                } else {
                    toasterService.error(apiResponse.params.errmsg)
                }
            }).catch(function(err) {
                toasterService.error(err.data.params.errmsg)
            }).finally(function() {
                // Close the modal popup and reset v alue of deleteAnnouncementId
                announcementOutboxData.closeModal('announcementDeleteModal')
                announcementOutboxData.deleteAnnouncementId = {}
            })
        }
        announcementOutboxData.resendAnnouncement = function() {
            // TODO - call announcement resend api
            var elementId = announcementOutboxData.actionBtnId
            $('#' + elementId).html('<i class="icon ban"></i>Delete')
            $('#' + elementId).removeClass('announcementBlueText')
            $('#' + elementId).addClass('announcementRedText')
            announcementOutboxData.closeModal('announcementResendModal')
            announcementOutboxData.resendAnnouncementObj = {}
        }
    }
])