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
        createAnn.desableBtn   = 'disabled';
        createAnn.showStepOne  = true;
        createAnn.showStepTwo  = false;
        createAnn.showStepThree= false;
        $scope.showUrlField    = false;
        $scope.repeatableWebLinks = [];
        createAnn.stepNumber   = 1;
        createAnn.isMetaModified = false;

        // Initialize modal
        createAnn.initializeModal = function(){
        	$timeout(function () {
          		$('#announcementType').dropdown();
          		$('#orgDropdown').dropdown();
	        }, 100);
        }

        createAnn.createAnnouncement = function (){
          $('#createAnnouncementModal').modal({
          	closable: false,
          	onHide: function () {
          		// TODO - Show confirmation before closing modal
          		if (createAnn.isMetaModified && confirm("Changes that you made may not be saved.")) {
        			createAnn.refreshFormValues();
        			return true;
          		}

          		if (!createAnn.isMetaModified){
          			return true;
          		}
          		return false;
          	}
          }).modal('show');
        }

        $scope.addNewChoice = function() {
          var newItemNo = $scope.repeatableWebLinks.length+1;
          $scope.repeatableWebLinks.push({'id':'choice'+newItemNo});
          $scope.showUrlField = true;
        };

        $scope.removeChoice = function(index) {
          	$scope.repeatableWebLinks.splice(index, 1);
          	delete createAnn.data.link[index];
          	$scope.showUrlField = $scope.repeatableWebLinks.length == '0' ? false : true;
        };

        // Function to post form data
        createAnn.selectRecipients = function(){
        	createAnn.showStepOne = false;
        	createAnn.showStepTwo = true;
        	createAnn.stepNumber = 2;
        	return;
        }

        // Function to detect input box change event
        createAnn.detectChange = function (){
        	createAnn.enableRecepientBtn();
    	}

    	// Function to detect dropdwon value change event
    	createAnn.detectDropdownChange = function (){
    		createAnn.enableRecepientBtn();
    	}

    	// Function to track back button change
    	createAnn.previousStep = function(item){
    		var step = $('#annBackBtn').attr('data-current-state');

    		switch (step) {
		        case "2":
		        	createAnn.showStepOne   = true;
    				createAnn.showStepThree = false;
		        	createAnn.showStepTwo   = false;
		        	createAnn.showStepFour  = false;
		        	createAnn.stepNumber    = 1
		            break;
		        case "3":
    				createAnn.showStepOne   = false;
    				createAnn.showStepTwo   = true;
    				createAnn.showStepThree = false;
		        	createAnn.showStepFour  = false;
    				createAnn.stepNumber    = 2;
		            break;

		        case "4":
    				createAnn.showStepOne   = false;
    				createAnn.showStepTwo   = false;
    				createAnn.showStepThree = true;
    				createAnn.showStepFour  = false;
    				createAnn.stepNumber    = 3;
		            break;

		        default:

		    }
    	}

    	// Function to preview announcement
    	createAnn.previewAnn = function(){
    		createAnn.showStepOne   = false;
			createAnn.showStepThree = false;
			createAnn.showStepTwo   = false;
			createAnn.showStepFour  = true;
			createAnn.stepNumber    = 4;
			if (createAnn.data.link){
				var linkArray = Object.keys(createAnn.data.link).map(e=>createAnn.data.link[e]);
				console.log(linkArray);
			} else{
				var linkArray = [];
			}

			// TODO - show announcement preview
        	createAnn.previewData = {"sourceId":"some-organisation-id","type":createAnn.data.announcementType,"links":linkArray,"title":createAnn.data.title,"description":createAnn.data.description,"target":["teachers"],"attachments":[{"title":"circular.pdf","downloadURL":"https://linktoattachment","mimetype":"application/pdf"}]};
    	}

    	// Function to confirm recipients
    	createAnn.confirmRecipients = function(){
    		createAnn.showStepOne = false;
    		createAnn.showStepTwo = false;
    		createAnn.showStepThree = true;
    		createAnn.stepNumber = 3;
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
	        createAnn.isMetaModified = true;
	    }

	    createAnn.detectUrlChange = function(index){
	    	var links = Object.keys(createAnn.data.link).map(e=>createAnn.data.link[e]);
	    	if(typeof(links[index]) === undefined || links[index] == ''){
	    		alert(1212);
	    		createAnn.desableBtn = 'disabled';
	    	} else{
	    		createAnn.enableRecepientBtn();
	    	}

	    	createAnn.isMetaModified = true;
	    }

	    createAnn.refreshFormValues = function(){
	    	createAnn.showStepThree = false;
			createAnn.showStepTwo   = false;
			createAnn.showStepFour  = false;
			createAnn.showStepOne   = true;
			createAnn.stepNumber    = 1;
			createAnn.desableBtn    = 'disabled';
			$('#announcementType').dropdown('restore defaults');
			$('#orgDropdown').dropdown('restore defaults');
			$('#createAnnouncementModal').modal('refresh');
			$('#announcementForm').form('reset');
			createAnn.data = {};
			createAnn.isMetaModified = false;
			$scope.repeatableWebLinks.length = 0;
			$scope.showUrlField = false;
			createAnn.initializeFileUploader();
	    }

	    createAnn.saveAnnouncement = function(){
	    	createAnn.refreshFormValues();
	    	$('#announcementSuccessModal').modal({
	          	closable: false
	        }).modal('show');
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
	                    	// TODO - push attachement api success response
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
