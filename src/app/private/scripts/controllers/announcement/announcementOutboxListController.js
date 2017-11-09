'use strict'

angular.module('playerApp')
  .controller('announcementOutboxListController', ['$rootScope', '$scope',
    'announcementService', '$timeout', '$state', '$stateParams', 'toasterService', 'adminService', 'PaginationService',
    function($rootScope, $scope, announcementService, $timeout, $state, $stateParams, toasterService, adminService, PaginationService) {
      var announcementOutboxData = this
      announcementOutboxData.pager = {};
      announcementOutboxData.setPage = setPage;
      announcementOutboxData.showLoader = true

      announcementOutboxData.renderAnnouncementList = function() {
        announcementService.getOutBoxAnnouncementList($rootScope.userId).then(function(apiResponse) {
            apiResponse = apiResponse.data

            if (apiResponse && apiResponse.responseCode === 'OK') {
              announcementOutboxData.listData = apiResponse.result.announcements
              initController();
            } else {
              toasterService.error(apiResponse.params.errmsg)
            }
          })
          .catch(function(err) {
            toasterService.error(err.data.params.errmsg)
          })
          .finally(function() {
            announcementOutboxData.showLoader = false
            announcementOutboxData.listData = [{
                    "announcementId": "1",
                    "sourceId": "National Council For Teacher Education",
                    "createdBy": "Creator1",
                    "createdOn": "2017-10-24",
                    "readBy": ["1234-12341-12313-132123", "1234-12341-12313-324234"],
                    "type": "Circular",
                    "links": ["https://www.google.co.in/?gfe_rd=cr&dcr=0&ei=D8r2WbjkOsKL8Qe4pJeACA", "https://diksha.gov.in/#documents"],
                    "title": "Exam dates announced for CBSE and state board exams",
                    "description": "Description goes here for the announcement exam date announced for CBSC and state board exams announcement exam date announced for CBSC and state board exams. Description goes here for the announcement exam date announced for CBSC and state board exams announcement exam date announced for CBSC and state board exams. Description goes here for the announcement exam date announced for CBSC and state board exams announcement exam date announced for CBSC and state board exams. announcement exam date announced for CBSC and state board exams announcement exam date announced for CBSC and state board exams",
                    "target": ["teachers"],
                    "attachments": [{
                        "title": "Circular A1.pdf",
                        "downloadURL": "https://linktoattachment.com/documents/Circular A1.pdf",
                        "mimetype": "application/pdf",
                        "filesize": "120 Kb"
                    }]
                }, {
                    "announcementId": "2",
                    "sourceId": "National Council For Teacher Education",
                    "createdBy": "Creator1",
                    "createdOn": "2017-10-24",
                    "readBy": ["1234-12341-12313-132123", "1234-12341-12313-324234"],
                    "type": "Circular",
                    "links": ["https://www.google.co.in/?gfe_rd=cr&dcr=0&ei=D8r2WbjkOsKL8Qe4pJeACA", "https://diksha.gov.in/#documents"],
                    "title": "Exam dates announced for CBSE and state board exams",
                    "description": "Description goes here for the announcement exam date announced for CBSC and state board exams announcement exam date announced for CBSC and state board exams. Description goes here for the announcement exam date announced for CBSC and state board exams announcement exam date announced for CBSC and state board exams. Description goes here for the announcement exam date announced for CBSC and state board exams announcement exam date announced for CBSC and state board exams. announcement exam date announced for CBSC and state board exams announcement exam date announced for CBSC and state board exams",
                    "target": ["teachers"],
                    "attachments": [{
                        "title": "Circular A1.pdf",
                        "downloadURL": "https://linktoattachment.com/documents/Circular A1.pdf",
                        "mimetype": "application/pdf",
                        "filesize": "120 Kb"
                    }]
                }]
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
            var actionBtnId = 'actionBtn' + announcement.announcementId
            var actionText = $('#' + actionBtnId).text()
            if (actionText == 'Delete') {
                announcementOutboxData.deleteAnnouncementObj = announcement
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
            alert('showModal')
            $('#' + modalId).modal('show')
        }
        announcementOutboxData.closeModal = function(modalId) {
            alert('closeModal')
            $('#' + modalId).modal('hide')
        }
        announcementOutboxData.deleteAnnouncement = function() {
            alert('deleteAnnouncement')
            // TODO - call announcement delete api
            var elementId = announcementOutboxData.actionBtnId;
            $('#' + elementId).html('<i class="external share icon"></i>Resend')
            $('#' + elementId).removeClass('announcementRedText')
            $('#' + elementId).addClass('announcementBlueText')
            announcementOutboxData.closeModal('announcementDeleteModal')
            announcementOutboxData.deleteAnnouncementObj = {}
        }
        announcementOutboxData.resendAnnouncement = function() {
            // TODO - call announcement delete api
            var elementId = announcementOutboxData.actionBtnId
            $('#' + elementId).html('<i class="icon ban"></i>Delete')
            $('#' + elementId).removeClass('announcementBlueText')
            $('#' + elementId).addClass('announcementRedText')
            announcementOutboxData.closeModal('announcementResendModal')
            announcementOutboxData.resendAnnouncementObj = {}
        }
    }
  ])