'use strict';

angular.module('playerApp')
  .controller('createAnnouncementCtrl', ['$rootScope', '$scope', '$timeout', '$state', '$stateParams', 'toasterService',
    'permissionsService',
    function($rootScope, $scope, $timeout, $state, $stateParams, toasterService, permissionsService) {

      // Initialize variables
      var announcement = this;

        // App config
        announcement.org = ['Org 1', 'Org 2', 'Org 3'];
        announcement.announcementType = ['Type 1', 'Type 2', 'Type 3'];

        announcement.open = function (){
          $('#announcementType').dropdown();
          $('#orgDropdown').dropdown();
          $('#createTextBookModal').modal({

          }).modal('show');
        }

        $scope.choices = [];
        $scope.showUrlField = false;

        $scope.addNewChoice = function() {
          var newItemNo = $scope.choices.length+1;
          $scope.choices.push({'id':'choice'+newItemNo});
          $scope.showUrlField = true;
        };

        $scope.removeChoice = function() {
          var lastItem = $scope.choices.length-1;
          $scope.choices.splice(lastItem);
        };

        // Function to post form data
        announcement.saveMetaData = function(data){
        	var requestBody = angular.copy(data);
        	console.log(requestBody);
        	return;
        }

        announcement.desableBtn = 'disabled.';
        announcement.detectChange = function (){
        	alert(announcement.data.from);
	        if (announcement.data.title && announcement.data.from && announcement.data.announcementType && announcement.data.description){
	        	alert(11);
	        	announcement.desableBtn = '';
	        }
    	}

        announcement.initializeFileUploader = function () {
	        $timeout(function () {
	            announcement.manualUploader = new qq.FineUploader({
	                element: document.getElementById('fine-uploader-manual-trigger'),
	                template: 'qq-template-manual-trigger',
	                request: {
	                    endpoint: announcement.contentUploadUrl + '/' + announcement.contentId
	                },
	                autoUpload: false,
	                debug: true,
	                validation: {
	                    sizeLimit: config.MaxFileSizeToUpload,
	                    allowedExtensions: config.AllowedFileExtension
	                },
	                messages: {
	                    sizeError: '{file} ' +
	                    $rootScope.errorMessages.COMMON.INVALID_FILE_SIZE + ' ' +
	                                            config.MaxFileSizeToUpload / (1000 * 1024) + ' MB.'
	                },
	                callbacks: {
	                    onComplete: function (id, name, responseJSON, xhr) {
	                        if (responseJSON.success) {
	                            announcement.editContent(announcement.contentId);
	                        } else if (responseJSON.params.err === 'ERR_CONTENT_UPLOAD_FILE') {
	                            $('.qq-upload-status-text').text($rootScope.errorMessages.COMMON
	                                .REQUIRED_FILE_MISSING);
	                        }
	                    },
	                    onSubmitted: function (id, name) {
	                        announcement.youtubeVideoUrl = '';
	                        announcement.uploadedFileId = id;
	                        announcement.selectedFileName = name;
	                        announcement.selectedFile = this.getFile(id);
	                        announcement.getSelectedFileMime(name);
	                        //announcement.initializeModal();
	                        document.getElementById('hide-section-with-button')
	                                                .style.display = 'none';
	                    },
	                    onCancel: function () {
	                        document.getElementById('hide-section-with-button')
	                                                .style.display = 'block';
	                    },
	                    onStatusChange: function (id, oldStatus, newStatus) {
	                        if (newStatus === 'rejected') {
	                            document.getElementById('hide-progress-bar-on-reject')
	                                                .style.display = 'none';
	                            announcement.data = {};
	                        }
	                    }
	                }
	            });
	            $('#fileUploadOptions').text($rootScope.labels.WORKSPACE.startCreating
	                                                                .fileUploadOptions);

	            window.cancelUploadFile = function () {
	                document.getElementById('hide-section-with-button').style.display = 'block';
	            };
	        }, 300);
	    };

        announcement.getSelectedFileMime = function (fileName) {
            var array = fileName.split('.');
            var ext = array.reverse()[0];
            announcement.data.mimeType = announcement.objMimeType[ext];
            announcement.selectedFileMimeType = announcement.objMimeType[ext];
        };
    }
  ])
