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
        createAnn.announcementType = []
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
                    createAnn.announcementType = _.map(response.result.announcementtypes.data, 'name')
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
            angular.forEach(createAnn.data.links, function(value, key) {
                createAnn.linkArray.push(value)
            })
            createAnn.previewData = {
                'type': createAnn.data.type,
                'links': createAnn.linkArray,
                'title': createAnn.data.title,
                'description': createAnn.data.description,
                'target': ['teachers'],
                'attachments': createAnn.attachment
            }
        }
        createAnn.removeRicipients = function(item) {
            _.remove(createAnn.selectedReciepeient, function(arg) {
                if (arg.location == item.location) {
                    item.selected = false,
                        toasterService.info(item.location + $rootScope.messages.imsg.m0018)
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
                    debug: true,
                    paramsInBody: true,
                    request: {
                        endpoint: '/api/announcement/v1/attachment/upload',
                        //endpoint: createAnn.attachmentEndPoint,
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
                            if (responseJSON.responseCode === 'OK' && responseJSON.result.attachment) {
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
    }
])