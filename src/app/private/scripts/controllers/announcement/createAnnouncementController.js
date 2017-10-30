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
        createAnn.disableBtn = true;
        createAnn.showUrlField = false;
        createAnn.isLastStep = false;
        createAnn.repeatableWebLinks = [];
        createAnn.isMetaModified = false;
        stepsHandler(1, true, false, false, false);

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
          	debug: true,
          	onHide: function () {
          		// TODO - Show confirmation before closing modal
          		if (!createAnn.isLastStep) {
	          		if (createAnn.isMetaModified && confirm("Changes that you made may not be saved.")) {
	        			createAnn.refreshFormValues();
	        			return true;
	          		}

	          		if (!createAnn.isMetaModified){
	          			return true;
	          		}
	          		return false;
	          	}
	          	return true;
          	},
          	onApprove : function a(){
          		// Make api call to save data
          		createAnn.isLastStep = true;
          		createAnn.refreshFormValues();
		    	$('#announcementSuccessModal').modal({
		          	closable: false
		        }).modal('show');
		    },
          	selector    : {
        		approve  : '#sendAnnouncement'
      		}
          }).modal('show');
        }

        createAnn.addNewLink = function() {
          var newItemNo = createAnn.repeatableWebLinks.length+1;
          createAnn.repeatableWebLinks.push({'id':'choice'+newItemNo});
          createAnn.showUrlField = true;
        };

        createAnn.removeLink = function(index) {
          	createAnn.repeatableWebLinks.splice(index, 1);
          	delete createAnn.data.link[index];
          	createAnn.showUrlField = createAnn.repeatableWebLinks.length == '0' ? false : true;
        };

        // Function to post form data
        createAnn.selectRecipients = function(){
        	stepsHandler(2, false, true, false, false);
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
		        	stepsHandler(1, true, false, false, false);
		            break;
		        case "3":
		        	stepsHandler(2, false, true, false, false);
		            break;
		        case "4":
		        	stepsHandler(3, false, false, true, false);
		            break;
		        default:
		    }
    	}

    	function stepsHandler(stepNumber, step1, step2, step3, step4){
    		createAnn.showStepOne   = step1;
    		createAnn.showStepTwo   = step2;
    		createAnn.showStepThree = step3;
    		createAnn.showStepFour  = step4;
    		createAnn.stepNumber    = stepNumber;
    	}

    	// Function to preview announcement
    	createAnn.previewAnn = function(){
    		stepsHandler(4, false, false, false, true);
    		var linkArray = createAnn.data.link ? Object.keys(createAnn.data.link).map(e=>createAnn.data.link[e]) : [];
			// TODO - show announcement preview
        	createAnn.previewData = {"sourceId":"some-organisation-id","type":createAnn.data.announcementType,"links":linkArray,"title":createAnn.data.title,"description":createAnn.data.description,"target":["teachers"],"attachments":[{"title":"circular.pdf","downloadURL":"https://linktoattachment","mimetype":"application/pdf"}]};
    	}

    	// Function to confirm recipients
    	createAnn.confirmRecipients = function(){
    		stepsHandler(3, false, false, true, false);
    	}

    	// Function to enable / disable RecepientBtn
    	createAnn.enableRecepientBtn = function() {
	        if (createAnn.data.title && createAnn.data.from
	        	&& createAnn.data.announcementType &&
	        	(createAnn.data.description || createAnn.attachment.length)){
	        	createAnn.disableBtn = false;
	        } else {
	        	createAnn.disableBtn = true;
	        }
	        createAnn.isMetaModified = true;
	    }

	    createAnn.detectUrlChange = function(index){
	    	createAnn.isMetaModified = true;
	    }

	    createAnn.refreshFormValues = function(){
	    	stepsHandler(1, true, false, false, false);
			createAnn.disableBtn    = true;
			$('#announcementType').dropdown('restore defaults');
			$('#orgDropdown').dropdown('restore defaults');
			$('#createAnnouncementModal').modal('refresh');
			$('#announcementForm').form('reset');
			createAnn.data = {};
			createAnn.isMetaModified = false;
			createAnn.repeatableWebLinks.length = 0;
			createAnn.showUrlField = false;
			createAnn.initializeFileUploader();
	    }

	    createAnn.saveAnnouncement = function(){
	    }

		createAnn.attachment = [];
		createAnn.index = 0;
        createAnn.initializeFileUploader = function () {
	        $timeout(function () {
	            createAnn.manualUploader = new qq.FineUploader({
	                element: document.getElementById('fine-uploader-manual-trigger'),
	                template: 'qq-template-manual-trigger',
	                request: {
	                	// TODO - use upload api url
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
    }
  ])
