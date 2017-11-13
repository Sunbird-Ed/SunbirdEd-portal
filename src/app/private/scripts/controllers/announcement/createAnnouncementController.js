'use strict'
angular.module('playerApp').controller('createAnnouncementCtrl', ['$rootScope', '$scope', '$timeout', '$state', '$stateParams', 'config', 'toasterService', 'permissionsService', 'announcementService',
    function($rootScope, $scope, $timeout, $state, $stateParams, config, toasterService, permissionsService, announcementService) {
        var createAnn = this
        createAnn.data = {}
        createAnn.attachment = []
        createAnn.senderlist = []
        createAnn.targetIds = []
        createAnn.disableBtn = true
        createAnn.showUrlField = false
        createAnn.errorFlag = false
        createAnn.stepNumber = 1
        createAnn.isMetaModified = false
        createAnn.announcementType = ['1', '2']
        createAnn.repeatableWebLinks = []
        var getDefinitionReq = {
            "rootorgid": $rootScope.rootOrgId,
            "userid": $rootScope.userId,
            "definitions": ["announcementtypes", "senderlist"]
        }
        announcementService.getDefinitions(getDefinitionReq).then(function(response) {
            response = response.data
            if (response && response.responseCode === 'OK') {
                if (response.result.announcementtypes) {
                    createAnn.announcementType = _.map(response.result.announcementtypes, 'name')
                }
                if (response.result.senderlist) {
                    angular.forEach(response.result.senderlist, function(value, key) {
                        createAnn.senderlist.push(value)
                    })
                }
            } else {
                createAnn.showError(response)
            }
        }).catch(function(response) {
            createAnn.showError(response.data)
        })
        createAnn.initializeModal = function() {
            $timeout(function() {
                $('#announcementType').dropdown({
                    onChange: function(value, text, $choice) {
                        createAnn.enableRecepientBtn()
                    }
                })
                $('#orgDropdown').dropdown({
                    onChange: function(value, text, $choice) {
                        createAnn.enableRecepientBtn()
                    }
                })
            }, 100)
            $rootScope.$on('selected:items', function(evet, data) {
                createAnn.selectedReciepeient = data.geo
            })
        }
        createAnn.createAnnouncement = function() {
            $rootScope.$emit('component:init')
            $('#createAnnouncementModal').modal({
                closable: false,
                onHide: function() {
                    if (createAnn.isMetaModified) {
                        if (createAnn.confirmModel) {
                            return true
                        } else {
                            createAnn.confirmationModal()
                            return false
                        }
                    } else {
                        return true
                    }
                }
            }).modal('show')
        }
        createAnn.confirmationModal = function() {
            $timeout(function() {
                $('#announcementCancelModal').modal({
                    allowMultiple: true,
                    onDeny: function() {
                        return true
                    },
                    onApprove: function() {
                        createAnn.refreshFormValues()
                        createAnn.hideModel()
                        return true
                    }
                }).modal('show')
            }, 10)
        }
        createAnn.hideModel = function() {
            $('#announcementCancelModal').modal('hide')
            $('#announcementCancelModal').modal('hide others')
            $('#announcementCancelModal').modal('hide all')
            $('#announcementCancelModal').modal('hide dimmer')
        }
        createAnn.addNewLink = function() {
            var newItemNo = createAnn.repeatableWebLinks.length + 1
            createAnn.repeatableWebLinks.push({
                'id': 'choice' + newItemNo
            })
            createAnn.showUrlField = true
        }
        createAnn.removeLink = function(index) {
            createAnn.repeatableWebLinks.splice(index, 1)
            delete createAnn.data.links[index]
            createAnn.showUrlField = createAnn.repeatableWebLinks.length != '0'
        }
        createAnn.previewAnn = function() {
            createAnn.linkArray = []
            if (createAnn.data.links) {
                angular.forEach(createAnn.data.links, function(value, key) {
                    createAnn.linkArray.push(value)
                })
            }
            createAnn.previewData = {
                'details': {
                    'type': createAnn.data.type,
                    'title': createAnn.data.title,
                    'description': createAnn.data.description
                },
                'sourceid': $rootScope.rootOrgId,
                'links': createAnn.linkArray,
                'target': ['teachers'],
                'attachments': createAnn.attachment
            }
        }
        createAnn.removeRicipients = function(item) {
            _.remove(createAnn.selectedReciepeient, function(arg) {
                if (arg.location == item.location) {
                    item.selected = false,
                        toasterService.info(item.location + $rootScope.messages.imsg.m0020)
                    return arg.location
                }
            })
            createAnn.confirmRecipients()
        }
        createAnn.config = {
            'geo': {
                'adopter': 'SERVICE',
                'service': 'geoService'
            }
        }
        createAnn.confirmRecipients = function() {
            $rootScope.$emit('get:selected:items')
            if (createAnn.selectedReciepeient.length == 0) {
                createAnn.stepNumber = 2
                toasterService.error($rootScope.messages.emsg.m0006)
                return
            }
            //console.log(JSON.stringify(createAnn.selectedReciepeient))
            createAnn.stepNumber = 3
        }
        createAnn.enableRecepientBtn = function() {
            if (createAnn.data.title && createAnn.data.from && createAnn.data.type && (createAnn.data.description || createAnn.attachment.length)) {
                createAnn.disableBtn = false
            } else {
                createAnn.disableBtn = true
            }
            createAnn.isMetaModified = true
        }
        createAnn.refreshFormValues = function() {
            createAnn.disableBtn = true
            createAnn.stepNumber = 1
            $('#announcementType').dropdown('restore defaults')
            $('#orgDropdown').dropdown('restore defaults')
            $('#createAnnouncementModal').modal('refresh')
            createAnn.data = {}
            createAnn.isMetaModified = false
            createAnn.repeatableWebLinks.length = 0
            createAnn.showUrlField = false
            createAnn.initializeFileUploader()
        }
        createAnn.saveAnnouncement = function(data) {
            console.log(JSON.stringify(data))
            var requestBody = angular.copy(data)
            requestBody.sourceId = $rootScope.rootOrgId
            requestBody.createdBy = $rootScope.userId
            requestBody.target = {
                'geo': {
                    'ids': _.map(createAnn.selectedReciepeient, 'id')
                }
            }
            if (requestBody.links) {
                requestBody.links = createAnn.linkArray
            }
            var requestData = {
                request: requestBody
            }
            announcementService.createAnnouncement(requestData).then(function(apiResponse) {
                apiResponse = apiResponse.data
                if (apiResponse && apiResponse.responseCode === 'OK') {
                    createAnn.refreshFormValues()
                    $(createAnnouncementModal).modal('hide')
                    $('#announcementSuccessModal').modal({
                        closable: false
                    }).modal('show')
                } else {
                    createAnn.showError(apiResponse)
                }
            }).catch(function(apiResponse) {
                createAnn.showError(apiResponse.data)
            })
        }
        createAnn.showError = function(apiResponse) {
            createAnn.errorFlag = true
            if (apiResponse.responseCode === 'CLIENT_ERROR' && angular.isArray(apiResponse.params.errmsg)) {
                angular.forEach(apiResponse.params.errmsg, function(value, key) {
                    toasterService.error(value.description)
                })
            } else {
                toasterService.error(apiResponse.params.errmsg)
            }
        }
        createAnn.initializeFileUploader = function() {
            $timeout(function() {
                createAnn.manualUploader = new qq.FineUploader({
                    element: document.getElementById('fine-uploader-manual-trigger'),
                    template: 'qq-template-manual-trigger',
                    autoUpload: true,
                    paramsInBody: true,
                    debug: true,
                    request: {
                        endpoint: '/api/announcement/v1/attachment/upload',
                        inputName: 'document',
                        params: {
                            'createdBy': $rootScope.userId
                        }
                    },
                    validation: {
                        sizeLimit: config.AnncmntMaxFileSizeToUpload,
                        allowedExtensions: config.AnncmntAllowedFileExtension
                    },
                    messages: {
                        sizeError: '{file} ' + $rootScope.messages.imsg.m0006 + ' ' + config.AnncmntMaxFileSizeToUpload / (1000 * 1024) + ' MB.'
                    },
                    failedUploadTextDisplay: {
                        mode: 'default',
                        responseProperty: 'error'
                    },
                    showMessage: function(message) {
                        toasterService.error(message)
                    },
                    callbacks: {
                        onComplete: function(id, name, responseJSON, xhr) {
                            console.log('Upload response :', responseJSON)
                            if (responseJSON.status && responseJSON.responseCode === 'OK') {
                                var attData = {
                                    "title": name,
                                    "downloadURL": responseJSON.result.attachment.downloadURL ? responseJSON.result.attachment.downloadURL : ''
                                }
                                createAnn.attachment.push(attData)
                                createAnn.enableRecepientBtn()
                            }
                        },
                        onSubmitted: function(id, name) {
                            var fileSize = this.getSize(id)
                            this.setParams({
                                document: name,
                                createdBy: $rootScope.userId,
                                filesize: fileSize
                            })
                        },
                        onCancel: function() {
                            document.getElementById('hide-section-with-button').style.display = 'block'
                        },
                        onError: function(id, name, errorReason, xhrOrXdr) {
                            toasterService.error(qq.format('Error on file number {} - {}.  Reason: {}', id, name, errorReason))
                        }
                    }
                })
                window.cancelUploadFile = function() {
                    document.getElementById('hide-section-with-button').style.display = 'block'
                }
            }, 300)
        }
        $scope.$on('editAnnouncementBeforeResend', function(event, announcement) {
            //console.log(JSON.stringify(announcement))
            announcement = {
                "sourceid": "0123673908687093760",
                "createddate": "2017-11-10 12:04:04:348+0530",
                "details": {
                    "description": "Description goes here for the announcement exam date announced for CBSC and state board exams announcement exam date announced for CBSC and state board exams announcement exam date announced for CBSC and state board exams announcement exam date announced for CBSC and state board exams",
                    "from": "test user",
                    "title": "Exam dates announced for CBSE and state board exams",
                    "type": "Circular"
                },
                "links": ["http://yahoo.com", "http://google.com", "http://gmail.com"],
                "id": "256048b0-c5e1-11e7-b854-ff8d6e91227b",
                "userid": "d56a1766-e138-45e9-bed2-a0db5eb9696a",
                "target": {
                    "geo": {
                        "ids": ["0123668622585610242", "0123668627050987529"]
                    }
                },
                "status": "cancelled"
            }
            createAnn.data.title = announcement.details.title
            createAnn.data.description = announcement.details.description
            angular.forEach(announcement.links, function(value, key) {
                createAnn.addNewLink()
            })
            createAnn.data.links = announcement.links
            $('#announcementType').dropdown('set text', announcement.details.type)
            $('#orgDropdown').dropdown('set text', announcement.details.from)
            $('#orgDropdown').dropdown('set text', announcement.details.from)
            createAnn.selectedReciepeient = [{
                "createdDate": "2017-11-02",
                "updatedBy": null,
                "createdBy": "16517913-ae66-4b78-be8a-325da74e561c",
                "topic": "0123668622585610242",
                "location": "East Godavari",
                "id": "0123668622585610242",
                "updatedDate": null,
                "type": "District",
                "rootOrgId": "ORG_001",
                "$$hashKey": "object:133",
                "selected": true
            }]
            createAnn.disableBtn = false
            // TODO - check the recipients
            createAnn.createAnnouncement()
        })
    }
])