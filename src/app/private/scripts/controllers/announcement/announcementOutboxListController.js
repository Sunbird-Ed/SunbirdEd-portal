'use strict'

angular.module('playerApp')
  .controller('announcementOutboxListController', ['$rootScope', '$scope',
    'announcementService', '$timeout', '$state', '$stateParams', 'toasterService', 'adminService',
    function ($rootScope, $scope, announcementService, $timeout, $state, $stateParams, toasterService, adminService) {
      var announcementOutboxData = this;
      announcementOutboxData.showLoader = true;

      announcementOutboxData.renderAnnouncementList = function () {
       
       
       
       
       
       
       
       
       //~ announcementService.getAnnouncementList().then(function (apiResponse) {

            //~ if (apiResponse && apiResponse.responseCode === 'OK') {
            //~ } else {
                //~ toasterService.error(apiResponse.params.errmsg);
                //~ announcementOutboxData.showDataDiv = false;
            //~ }
        //~ })
          //~ .catch(function (err) {
              //~ console.log(err);
          //~ })
          //~ .finally(function () {
              //~ announcementOutboxData.showLoader = false;
          //~ });
          
          
       announcementOutboxData.listData = announcementService.getOutBoxAnnouncementList();
       announcementOutboxData.listData = JSON.parse(announcementOutboxData.listData);
       announcementOutboxData.listData = announcementOutboxData.listData.result.announcements;
       announcementOutboxData.showLoader = false;
       
       
       
       
       
       
       
      }
    }

  ])
