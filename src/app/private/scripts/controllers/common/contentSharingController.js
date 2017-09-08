'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller.common:contentSharingController
 * @author Anuj Gupta
 * @description
 * # contentSharingController
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('contentSharingController', ['contentService', '$timeout', '$state', 'config',
        '$rootScope', 'toasterService', '$scope', '$location', '$window', function (contentService,
            $timeout, $state, config, $rootScope, toasterService, $scope, $location, $window) {
            var contentShare = this;
            contentShare.showContentShareModal = false;
            contentShare.id = $scope.id;
            contentShare.type = $scope.type;
            contentShare.baseUrl = new $window.URL($location.absUrl()).origin + '/public/#!/';
            var link = contentShare.baseUrl + contentShare.type + '/' + contentShare.id;
            contentShare.link = link;

            contentShare.hideContentShareModal = function () {
                $timeout(function () {
                    contentShare.showContentShareModal = false;
                    $('#contentShareModal').modal('hide');
                    $('#contentShareModal').modal('hide others');
                    $('#contentShareModal').modal('hide all');
                    $('#contentShareModal').modal('hide dimmer');
                }, 0);
            };

            contentShare.initializeModal = function () {
                contentShare.showContentShareModal = true;
                $timeout(function () {
                    $('#contentShareModal').modal({
                        onHide: function () {
                            contentShare.hideContentShareModal();
                        }
                    }).modal('show');
                }, 10);
                $timeout(function () {
                    $('#copyLinkButton').trigger('click', function () {
                        contentShare.copyLink();
                    });
                }, 1000);
            };

            contentShare.close = function () {
                contentShare.showContentShareModal = false;
                contentShare.hideContentShareModal();
            };

            contentShare.copyLink = function () {
                $('#copyLinkData').select();
                document.execCommand('copy');
                $('#buttonPopUp')
                        .popup({
                            popup: $('#LinkCopiedToClipboard'),
                            on: 'click',
                            position: 'top center',
                            color: '#4183c4'
                        });
            };
        }]);
