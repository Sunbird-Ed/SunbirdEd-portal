'use strict'

angular.module('playerApp')
  .controller('announcementInboxListController', ['$rootScope', '$scope',
    'announcementService', '$timeout', '$state', '$stateParams', 'toasterService', 'adminService',
    function ($rootScope, $scope, announcementService, $timeout, $state, $stateParams, toasterService, adminService) {
      var announcementInboxData = this;
      announcementInboxData.showLoader = true;

      announcementInboxData.renderAnnouncementList = function () {
       
       
       
       
       
       
       
       
       //~ announcementService.getAnnouncementList().then(function (apiResponse) {

            //~ if (apiResponse && apiResponse.responseCode === 'OK') {
            //~ } else {
                //~ toasterService.error(apiResponse.params.errmsg);
                //~ announcementInboxData.showDataDiv = false;
            //~ }
        //~ })
          //~ .catch(function (err) {
              //~ console.log(err);
          //~ })
          //~ .finally(function () {
              //~ announcementInboxData.showLoader = false;
          //~ });
          
          
       announcementInboxData.listData = announcementService.getInboxAnnouncementList();
       announcementInboxData.listData = JSON.parse(announcementInboxData.listData);
       announcementInboxData.listData = announcementInboxData.listData.result.announcements;
       announcementInboxData.showLoader = false;
       
       
       
       
       
       
       
      }
    }

  ])
