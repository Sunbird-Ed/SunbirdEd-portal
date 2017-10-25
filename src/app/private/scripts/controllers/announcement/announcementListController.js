'use strict'

angular.module('playerApp')
  .controller('announcementListController', ['$rootScope', '$scope',
    'announcementService', '$timeout', '$state', '$stateParams', 'toasterService', 'adminService',
    function ($rootScope, $scope, announcementService, $timeout, $state, $stateParams, toasterService, adminService) {
      var announcementData = this

      announcementData.renderAnnouncementList = function () {
       
       
       
       
       
       
       
       
       //~ announcementService.getAnnouncementList().then(function (apiResponse) {

            //~ if (apiResponse && apiResponse.responseCode === 'OK') {
            //~ } else {
                //~ toasterService.error(apiResponse.params.errmsg);
                //~ announcementData.showDataDiv = false;
            //~ }
        //~ })
          //~ .catch(function (err) {
              //~ console.log(err);
          //~ })
          //~ .finally(function () {
              //~ announcementData.showLoader = false;
          //~ });
          
          
       announcementData.listData = announcementService.getAnnouncementList();
       
       console.log(announcementData.listData);
       
       
       
       
       
       
       
      }
    }

  ])
