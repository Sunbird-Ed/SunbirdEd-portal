/**
 * User switcher controller
 * @author Krushanu Mohapatra <krushanu.mohapatra@tarento.com> Akash Gupta <akash.gupta@tarento.com>
 */

app.controllerProvider.register('UserSwitchController', [
    '$scope',
    '$rootScope',
    '$state',
    '$stateParams',
    function($scope, $rootScope, $state, $stateParams) {
        $scope.AppLables = AppLables;
        $scope.groupLength = undefined;
        $scope.selectedUser = {};
        $scope.showUserSwitchModal = false;
        $scope.imageBasePath = globalConfig.assetbase;

        $scope.hideUserSwitchingModal = function() {
            $rootScope.safeApply(function() {
                EkstepRendererAPI.removeEventListener(EkstepRendererEvents['renderer:device:back'], $scope.hideUserSwitchingModal, $scope);
                $scope.showUserSwitchModal = false;
            });
        }

        $scope.showUserSwitchingModal = function() {
            if ($rootScope.enableUserSwitcher) {
                if ($scope.showUserSwitchModal)
                    return;
                TelemetryService.interact("TOUCH", "gc_userswitch_popup_open", "TOUCH", {
                    stageId: EkstepRendererAPI.getCurrentStageId() ?
                        EkstepRendererAPI.getCurrentStageId() : $rootScope.pageId
                }, $scope.TelemetryEvent.interact);
                EkstepRendererAPI.addEventListener(EkstepRendererEvents['renderer:device:back'], $scope.hideUserSwitchingModal, $scope);
                _.each($rootScope.users, function(user) {
                    if (user.selected === true)
                        user.selected = false;
                    if (user.uid === $rootScope.currentUser.uid)
                        user.selected = true;
                });
                $scope.sortUserlist();
                $rootScope.safeApply(function() {
                    $scope.showUserSwitchModal = true;
                });
            } else {
                showToaster('info', "User switch is disabled");
            }
        }

        $scope.checkUsersImage = function() {
            _.each($rootScope.users, function(user) {
                var imageUrl = user.profileImage;
                imageExists(imageUrl, function(exists) {
                    if (exists === false)
                        user.profileImage = "assets/icons/avatar_anonymous.png"
                    console.log('RESULT: url=' + imageUrl + ', exists=' + exists);
                });
            })
        }

        $scope.getUsersList = function() {
            org.ekstep.service.content.getAllUserProfile().then(function(usersData) {
                $rootScope.users = usersData;
                $scope.checkUsersImage();
                $scope.groupLength = (_.where($rootScope.users, { "isGroupUser": true })).length;
                if ($rootScope.users.length == 0)
                    $rootScope.users.push($rootScope.currentUser);
                $scope.addScroll();
                $scope.sortUserlist();
            }).catch(function(err) {
                console.error(err);
            });
        }

        $scope.sortUserlist = function() {
            $rootScope.users = _.sortBy(_.sortBy($rootScope.users, 'handle'), 'userIndex');
        }

        // this function changes the selected user
        $scope.selectUser = function(selectedUser) {
            // here the user Selection is happening
            _.each($rootScope.users, function(user) {
                if (user.selected === true)
                    user.selected = false;
            });
            TelemetryService.interact("TOUCH", selectedUser.uid, "TOUCH", {
                stageId: EkstepRendererAPI.getCurrentStageId() ?
                    EkstepRendererAPI.getCurrentStageId() : $rootScope.pageId
            }, $scope.TelemetryEvent.interact);
            selectedUser.selected = true;
            $scope.selectedUser = selectedUser;
        }

        // When the user clicks on replayContent, replayContent the content
        $scope.replayContent = function() {
            var replayContent = true;
            TelemetryService.interact("TOUCH", 'gc_userswitch_replayContent', "TOUCH", {
                stageId: EkstepRendererAPI.getCurrentStageId() ?
                    EkstepRendererAPI.getCurrentStageId() : $rootScope.pageId
            }, $scope.TelemetryEvent.interact);
            if (_.isEmpty($scope.selectedUser)) {
                EkstepRendererAPI.dispatchEvent('renderer:content:close');

                EkstepRendererAPI.dispatchEvent('renderer:content:replay');
                $scope.closeUserSwitchingModal(false);
                EkstepRendererAPI.hideEndPage(); // need to remove; hiding of endpage should happen on replay function
            } else {
                $scope.switchUser(replayContent);
            }
        }

        // When the user clicks on Continue, Continue the content from there
        $scope.continueContent = function() {
            // here the user Selection happens
            var replayContent = false;
            TelemetryService.interact("TOUCH", 'gc_userswitch_continue', "TOUCH", {
                stageId: EkstepRendererAPI.getCurrentStageId() ?
                    EkstepRendererAPI.getCurrentStageId() : $rootScope.pageId
            }, $scope.TelemetryEvent.interact);
            $scope.switchUser(replayContent);
        }

        $scope.switchUser = function(replayContent) {
            var userSwitchHappened;
            if (!_.isEmpty($scope.selectedUser)) {
                userSwitchHappened = true;
                org.ekstep.service.content.setUser($scope.selectedUser.uid).then(function(data) {
                    $rootScope.$apply(function() {
                        $rootScope.currentUser = $scope.selectedUser;
                        $rootScope.currentUser.userIndex = $rootScope.sortingIndex -= 1;
                        $scope.selectedUser = {};
                        if (userSwitchHappened) {
                            var version = TelemetryService.getGameVer();
                            var gameId = TelemetryService.getGameId();
                            if (replayContent == true) {
                                var data = {
                                    'callback': $scope.replayCallback
                                };
                                if (_.isUndefined($scope.TelemetryEvent.logGEEvent)) {
                                    TelemetryService.interrupt("SWITCH", EkstepRendererAPI.getCurrentStageId() ?
                                        EkstepRendererAPI.getCurrentStageId() :
                                        $rootScope.pageId);
                                }
                                EkstepRendererAPI.dispatchEvent('renderer:content:close', undefined, data);
                            } else {
                                if (_.isUndefined($scope.TelemetryEvent.logGEEvent)) {
                                    TelemetryService.interrupt("SWITCH", EkstepRendererAPI.getCurrentStageId() ?
                                        EkstepRendererAPI.getCurrentStageId() :
                                        $rootScope.pageId);
                                }
                                EkstepRendererAPI.dispatchEvent('renderer:telemetry:end');
                                TelemetryService.setUser($rootScope.currentUser, EkstepRendererAPI.getCurrentStageId() ?
                                    EkstepRendererAPI.getCurrentStageId() :
                                    $rootScope.pageId, $scope.TelemetryEvent.interact);
                                if (EkstepRendererAPI.getCurrentStageId()) { // If stage id is not available that means user is on Endpage.
                                    var data = {};
                                    data.stageid = EkstepRendererAPI.getCurrentStageId() ?
                                        EkstepRendererAPI.getCurrentStageId() :
                                        $rootScope.pageId;
                                    data.mode = getPreviewMode();
                                    TelemetryService.start(gameId, version, data);
                                }
                            }
                        }
                    });
                }).catch(function(err) {
                    console.log(err);
                })
            }
            $scope.closeUserSwitchingModal(false);
        }

        $scope.replayCallback = function() {
            TelemetryService.setUser($rootScope.currentUser, EkstepRendererAPI.getCurrentStageId() ?
                EkstepRendererAPI.getCurrentStageId() :
                $rootScope.pageId, $scope.TelemetryEvent.interact);
            $scope.hideUserSwitchingModal();
            EkstepRendererAPI.dispatchEvent('renderer:endpage:hide');
            EkstepRendererAPI.dispatchEvent('renderer:content:replay');
        }

        $scope.closeUserSwitchingModal = function(logTelemetry) {
            if (logTelemetry) {
                TelemetryService.interact("TOUCH", "gc_userswitch_popup_close", "TOUCH", {
                    stageId: EkstepRendererAPI.getCurrentStageId() ?
                        EkstepRendererAPI.getCurrentStageId() : $rootScope.pageId
                }, $scope.TelemetryEvent.interact);
            }
            $scope.hideUserSwitchingModal();
        }

        $scope.initializeCtrl = function() {
            var globalConfig = EkstepRendererAPI.getGlobalConfig();
            $rootScope.showUser = globalConfig.overlay.showUser;
            $rootScope.enableUserSwitcher = globalConfig.overlay.enableUserSwitcher;

            EventBus.addEventListener("event:showUser", function(value) {
                $rootScope.showUser = value.target;
            });

            EventBus.addEventListener("event:openUserSwitchingModal", function(data) {
                $scope.TelemetryEvent = {};
                if (data && data.target && data.target.logGEEvent) {
                    $scope.TelemetryEvent = {
                        'interact': 'GE_INTERACT',
                        'logGEEvent': true
                    };
                }
                $scope.showUserSwitchingModal();
            });

            /**
             * event:getcurrentuser Event to get the current user being playing the content.
             * @event event:getcurrentuser
             * @listen event:getcurrentuser
             * @memberOf EkstepRendererEvents
             */
            EventBus.addEventListener("event:getcurrentuser", function() {
                if (globalConfig.overlay.showUser)
                    currentUser = $rootScope.currentUser;
            });

            /**
             * event:getuserlist Event to get the user list.
             * @event event:getuserlist
             * @listen event:getuserlist
             * @memberOf EkstepRendererEvents
             */
            EventBus.addEventListener("event:getuserlist", function() {
                if (globalConfig.overlay.showUser)
                    userList = $rootScope.users;
            });

            /**
             * event:showuser Event to show the user icon.
             * @event event:showuser
             * @listen event:showuser
             * @memberOf EkstepRendererEvents
             */
            EventBus.addEventListener("event:showuser", function(value) {
                globalConfig.overlay.showUser = value;
                $rootScope.safeApply = function() {
                    $rootScope.showUser = value;
                }
            });

            /**
             * event:enableUserSwitcher Event to enable the userswitcher.
             * @event event:enableUserSwitcher
             * @listen event:enableUserSwitcher
             * @memberOf EkstepRendererEvents
             */
            EventBus.addEventListener("event:enableUserSwitcher", function(value) {
                if (globalConfig.overlay.enableUserSwitcher) {
                    $rootScope.safeApply = function() {
                        $rootScope.enableUserSwitcher = value.target;
                    }
                } else {
                    console.warn('User switcher is disabled in appconfig');
                }
            });

            if (_.isUndefined($rootScope.currentUser)) {
                org.ekstep.service.content.getCurrentUser().then(function(data) {
                    if (_.isEmpty(data.handle)) {
                        data.handle = "Anonymous";
                        data.profileImage = "assets/icons/avatar_anonymous.png";
                    }
                    /*
                     * Have an empty check for image validation
                     * If image is not available at the given path, replace the image with "avatar_anonymous" image
                     */
                    var imageUrl = data.profileImage;
                    imageExists(imageUrl, function(exists) {
                        if (exists === false)
                            data.profileImage = "assets/icons/avatar_anonymous.png"
                        console.log('RESULT: url=' + imageUrl + ', exists=' + exists);
                    });

                    $rootScope.currentUser = data;
                    $rootScope.currentUser.selected = true;
                    $scope.getUsersList();
                    $rootScope.safeApply();
                }).catch(function(err) {
                    console.log(err);
                })
            } else {
                $scope.getUsersList();
                $rootScope.safeApply();
            }
        }
    }
]);

app.compileProvider.directive('userSwitcher', ['$rootScope', '$compile', function($rootScope, $compile) {
    return {
        restrict: 'E',
        controller: 'UserSwitchController',
        template: "<div ng-include='getUserSwitcherTemplate()' ></div>",
        link: function(scope, element, attrs, controller) {

            scope.addScroll = function() {
                // get the user selection div
                var userSlider = element.find("#userSlider");
                var groupSlider = element.find("#groupSlider");

                userSlider.mCustomScrollbar({
                    axis: "x",
                    theme: "dark-3",
                    advanced: {
                        autoExpandHorizontalScroll: true
                    }
                });
                groupSlider.mCustomScrollbar({
                    axis: "x",
                    theme: "dark-3",
                    advanced: {
                        autoExpandHorizontalScroll: true
                    }
                });
            }
            scope.init = function() {
                if (globalConfig.overlay.showUser === true) {
                    element.find("#userSlider").mCustomScrollbar('destroy');
                    element.find("#groupSlider").mCustomScrollbar('destroy');
                    scope.initializeCtrl();
                }
            };
            scope.getUserSwitcherTemplate = function() {
                var userSwitcherPluginInstance = EkstepRendererAPI.getPluginObjs("org.ekstep.userswitcher");
                //var config = EkstepRendererAPI.getGlobalConfig();
                return userSwitcherPluginInstance._templatePath;
                // if (!config.isCorePluginsPackaged) {
                //     return userSwitcherPluginInstance._templatePath;
                // } else {
                //     return 'userSwitch.html';
                // }
            }
        }
    }
}]);