'use strict';

angular.module('playerApp')
  .controller('createAnnouncementCtrl', ['$rootScope', '$scope', '$timeout', '$state', '$stateParams', 'config', 'toasterService',
    'permissionsService', 'dashboardService',
    function($rootScope, $scope, $timeout, $state, $stateParams, config, toasterService, permissionsService, dashboardService) {

      // Initialize variables
      var createAnn = this;

        // TODO - use api to get values
        createAnn.org = ['Org 1', 'Org 2', 'Org 3'];
        createAnn.announcementType = ['Type 1', 'Type 2', 'Type 3'];
        createAnn.desableBtn = 'disabled';

        // Initialize modal
        createAnn.initializeModal = function(){
        	$timeout(function () {
          		$('#announcementType').dropdown();
          		$('#orgDropdown').dropdown();
	        }, 10);
        }

        // Open create createAnn modal
        createAnn.createAnnouncement = function (){
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
        createAnn.saveMetaData = function(data){
        	var requestBody = angular.copy(data);
        	requestBody.createdBy   = 101;
        	requestBody.createdOn   = '12/12/12';
        	requestBody.attachments = createAnn.attachment;
        	console.log(createAnn.attachment);
        	console.log(requestBody);
        	var requestData = {
        		content: requestBody
        	};
        	return;
        }

        // Detect input box change event
        createAnn.detectChange = function (){
        	createAnn.enableRecepientBtn();
    	}

    	// Detect dropdwon value change event
    	createAnn.detectDropdownChange = function (){
    		createAnn.enableRecepientBtn();
    	}

    	// Function to enable / disable RecepientBtn
    	createAnn.enableRecepientBtn = function() {
	        if (createAnn.data.title && createAnn.data.from
	        	&& createAnn.data.announcementType &&
	        	(createAnn.data.description || createAnn.attachment.length)){
	        	createAnn.desableBtn = '';
	        } else {
	        	createAnn.desableBtn = 'disabled';
	        }
	    }

		createAnn.attachment = [];
		createAnn.index = 0;
        createAnn.initializeFileUploader = function () {
	        $timeout(function () {
	            createAnn.manualUploader = new qq.FineUploader({
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
	                        createAnn.attachment.push('A', 'B');
	                        createAnn.enableRecepientBtn();
	                    },
	                    onSubmitted: function (id, name) {
	                        createAnn.uploadedFileId = id;
	                        createAnn.selectedFileName = name;
	                        createAnn.selectedFile = this.getFile(id);
	                        createAnn.getSelectedFileMime(name);
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

        createAnn.getSelectedFileMime = function (fileName) {
            var array = fileName.split('.');
            var ext = array.reverse()[0];
            createAnn.data.mimeType = createAnn.objMimeType[ext];
            createAnn.selectedFileMimeType = createAnn.objMimeType[ext];
        };
    }
  ])
