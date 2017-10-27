'use strict';

angular.module('playerApp')
  .controller('createAnnouncementCtrl', ['$rootScope', '$scope', '$timeout', '$state', '$stateParams', 'config', 'toasterService',
    'permissionsService', 'dashboardService',
    function($rootScope, $scope, $timeout, $state, $stateParams, config, toasterService, permissionsService, dashboardService) {

      // Initialize variables
      var announcement = this;

        // TODO - use api to get values
        announcement.org = ['Org 1', 'Org 2', 'Org 3'];
        announcement.announcementType = ['Type 1', 'Type 2', 'Type 3'];
        announcement.desableBtn = 'disabled';

        // Initialize modal
        announcement.initializeModal = function(){
        	$timeout(function () {
          		$('#announcementType').dropdown();
          		$('#orgDropdown').dropdown();
	        }, 10);
        }

        // Open create announcement modal
        announcement.createAnnouncement = function (){
          $('#createTextBookModal').modal({}).modal('show');
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
        	requestBody.createdBy   = 101;
        	requestBody.createdOn   = '12/12/12';
        	requestBody.attachments = announcement.attachment;
        	console.log(announcement.attachment);
        	console.log(requestBody);
        	var requestData = {
        		content: requestBody
        	};
        	return;
        }

        // Detect input box change event
        announcement.detectChange = function (){
        	announcement.enableRecepientBtn();
    	}

    	// Detect dropdwon value change event
    	announcement.detectDropdownChange = function (){
    		announcement.enableRecepientBtn();
    	}

    	// Function to enable / disable RecepientBtn
    	announcement.enableRecepientBtn = function() {
	        if (announcement.data.title && announcement.data.from
	        	&& announcement.data.announcementType &&
	        	(announcement.data.description || announcement.attachment.length)){
	        	announcement.desableBtn = '';
	        } else {
	        	announcement.desableBtn = 'disabled';
	        }
	    }

		announcement.attachment = [];
		announcement.index = 0;
        announcement.initializeFileUploader = function () {
	        $timeout(function () {
	            announcement.manualUploader = new qq.FineUploader({
	                element: document.getElementById('fine-uploader-manual-trigger'),
	                template: 'qq-template-manual-trigger',
	                request: {
	                    endpoint: 'http://www.mocky.io/v2/59ef30b72e0000001d1c5e09'
	                },
	                autoUpload: true,
	                debug: true,
	                validation: {
	                    sizeLimit: config.MaxFileSizeToUpload,
	                    allowedExtensions: config.AllowedFileExtension
	                },
	                messages: {
	                     sizeError: '{file} ' +
	                     $rootScope.messages.imsg.m0006 + ' ' +
	                                             config.MaxFileSizeToUpload / (1000 * 1024) + ' MB.'
	                },
	                failedUploadTextDisplay: {
        				mode: 'default',
        				responseProperty: 'error'
    				},
    				showMessage: function(message) {
        				toasterService.error(message);
    				},
	                callbacks: {
	                    onComplete: function (id, name, responseJSON, xhr) {
	                    	//conosle.log(responseJSON);
	                        /*if (responseJSON.success) {
	                        } else if (responseJSON.params.err === 'ERR_CONTENT_UPLOAD_FILE') {
	                            $('.qq-upload-status-text').text($rootScope.errorMessages.COMMON
	                                .REQUIRED_FILE_MISSING);
	                        }*/
	                        announcement.attachment.push('A', 'B');
	                        announcement.enableRecepientBtn();
	                    },
	                    onSubmitted: function (id, name) {
	                        announcement.uploadedFileId = id;
	                        announcement.selectedFileName = name;
	                        announcement.selectedFile = this.getFile(id);
	                        announcement.getSelectedFileMime(name);
	                        document.getElementById('hide-section-with-button')
	                                                .style.display = 'none';
	                    },
	                    onCancel: function () {
	                        document.getElementById('hide-section-with-button')
	                                                .style.display = 'block';
	                    },
	                    onError: function(id, name, errorReason, xhrOrXdr) {
				            toasterService.error(qq.format("Error on file number {} - {}.  Reason: {}", id, name, errorReason));
				        },
	                }
	            });

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
