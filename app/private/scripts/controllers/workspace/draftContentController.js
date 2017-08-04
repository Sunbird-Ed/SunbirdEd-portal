'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:DraftContentController
 * @description
 * @author Anuj Gupta
 * # DraftContentController
 * Controller of the playerApp
 */

angular.module('playerApp')
    .controller('DraftContentController', ['contentService', 'searchService', 'config',
        '$rootScope', '$state', 'toasterService', '$scope', function (contentService, searchService,
        config, $rootScope, $state, toasterService, $scope) {
            var draftContent = this;
            draftContent.userId = $rootScope.userId;
            draftContent.status = ['Draft'];
            draftContent.mimeType = [
                'application/vnd.ekstep.ecml-archive',
                'application/vnd.ekstep.content-collection'
            ];
            draftContent.sortBy = 'desc';
            $scope.isSelected = false;
            draftContent.selectedContentItem = [];
            draftContent.message = $rootScope.errorMessages.WORKSPACE;

            draftContent.getDraftContent = function () {
                draftContent.loader = toasterService.loader('', draftContent.message.DRAFT.START);

                var request = {
                    filters: {
                        status: draftContent.status,
                        createdBy: draftContent.userId,
                        mimeType: draftContent.mimeType
                    },
                    sort_by: {
                        lastUpdatedOn: draftContent.sortBy
                    }
                };

                searchService.search(request).then(function (res) {
                    if (res && res.responseCode === 'OK') {
                        draftContent.loader.showLoader = false;
                        draftContent.draftContentData = res.result.content || [];
                    } else {
                        draftContent.loader.showLoader = false;
                        toasterService.error(draftContent.message.DRAFT.FAILED);
                    }
                }).catch(function () {
                    draftContent.loader.showLoader = false;
                    toasterService.error(draftContent.message.DRAFT.FAILED);
                });
            };

            draftContent.openContentEditor = function (item) {
                if (item.mimeType === 'application/vnd.ekstep.content-collection') {
                    $state.go('CollectionEditor', {
                        contentId: item.identifier,
                        type: item.contentType,
                        state: 'WorkSpace.DraftContent'
                    });
                } else {
                    $state.go('EditContent', { contentId: item.identifier });
                }
            };

            draftContent.initializeUIElement = function () {
                $('#actionDropDown').dropdown();
            };

            $scope.addContentOnSelect = function (content, add) {
                if (add) {
                    draftContent.selectedContentItem.push(content);
                } else {
                    draftContent.selectedContentItem = draftContent.selectedContentItem.filter(
                    function (data) {
                        return data.identifier !== content.identifier;
                    });
                }
            };

            draftContent.applyAction = function () {
                var action = $('#actionDropDown').dropdown('get value');
                switch (action) {
                case 'delete':
                    draftContent.deleteContent();
                    break;
                default:
                    break;
                }
            };

            function reduceObjectIntoArray(items, key) {
                return items.reduce(function (validation, item, index) {
                    validation[index] = item[key];
                    return validation;
                }, []);
            }

            function removeContentLocal(requestData) {
                draftContent.draftContentData = draftContent.draftContentData.filter(
                function (content) {
                    return requestData.indexOf(content.identifier) === -1;
                });
            }

            function getDeletedContentIds(requestedIds, failedIds) {
                return requestedIds.filter(function (contentId) {
                    return failedIds.indexOf(contentId) === -1;
                });
            }

            draftContent.deleteContent = function () {
                var requestData = reduceObjectIntoArray(draftContent.selectedContentItem,
                                                                                    'identifier');
                draftContent.loader = toasterService.loader('', draftContent.message.RETIRE_CONTENT
                                                    .START);
                var request = {
                    contentIds: requestData
                };
                contentService.retire(request).then(function (res) {
                    if (res && res.responseCode === 'OK') {
                        draftContent.loader.showLoader = false;
                        toasterService.success(draftContent.message.RETIRE_CONTENT.SUCCESS);
                        removeContentLocal(requestData);
                    } else {
                        draftContent.loader.showLoader = false;
                        var length = res && res.result ? res.result.length : requestData.length;
                        var failedContentIds = res && res.result ? reduceObjectIntoArray(res.result,
                                                                         'contentId') : requestData;
                        var deletedContentIds = getDeletedContentIds(requestData, failedContentIds);
                        removeContentLocal(deletedContentIds);
                        toasterService.error(length + ' ' + draftContent.message.RETIRE_CONTENT
                                                                                    .NOT_DELETE);
                    }
                }).catch(function () {
                    draftContent.loader.showLoader = false;
                    toasterService.error(draftContent.message.RETIRE_CONTENT.FAILED);
                });
            };
        }]);
