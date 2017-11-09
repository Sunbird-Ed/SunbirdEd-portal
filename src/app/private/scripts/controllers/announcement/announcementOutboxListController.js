'use strict'

angular.module('playerApp')
  .controller('announcementOutboxListController', ['$rootScope', '$scope',
    'announcementService', '$timeout', '$state', '$stateParams', 'toasterService', 'adminService', 'PagerService',
    function($rootScope, $scope, announcementService, $timeout, $state, $stateParams, toasterService, adminService, PagerService) {
      var announcementOutboxData = this
      
      
      
        announcementOutboxData.pager = {};
        announcementOutboxData.setPage = setPage;

        
      
      
      
      announcementOutboxData.showLoader = true

      announcementOutboxData.renderAnnouncementList = function() {
        announcementService.getOutBoxAnnouncementList($rootScope.userId).then(function(apiResponse) {
            apiResponse = apiResponse.data

            if (apiResponse && apiResponse.responseCode === 'OK') {
              announcementOutboxData.listData = apiResponse.result.announcements
              
              
              
              
              
              //announcementOutboxData.dummyItems = apiResponse.result.announcements;
              initController();
            } else {
              toasterService.error(apiResponse.params.errmsg)
              // announcementOutboxData.showDataDiv = false
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
            announcementOutboxData.pager = PagerService.GetPager(announcementOutboxData.listData.length, page);

            // get current page of items
            announcementOutboxData.items = announcementOutboxData.listData.slice(announcementOutboxData.pager.startIndex, announcementOutboxData.pager.endIndex + 1);
        }
        
        
        

        
        
      
      
    }
    
    

  ])
