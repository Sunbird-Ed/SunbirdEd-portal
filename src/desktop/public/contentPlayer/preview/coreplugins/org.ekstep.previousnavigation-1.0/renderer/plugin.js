/**
 * Plugin to create create previous navigation directive and handle show and hide of previous nav button
 * @extends EkstepRenderer.Plugin
 * @author Akash Gupta <akash.gupta@tarento.com>
 */
Plugin.extend({
    _type: "navigation",
    initialize: function() {
        var instance = this;
        app.compileProvider.directive('previousNavigation', ['$rootScope', "$compile", function ($rootScope, $compile) {
            return {
                restrict: 'E',
                template: '<div id="nav-previous"></div>',
                link: function(scope, element) {
                    var events = [ "overlayPrevious", "renderer:previous:show", "renderer:previous:hide"];
                    var defaultTempate = org.ekstep.pluginframework.pluginManager.resolvePluginResource(instance._manifest.id, instance._manifest.ver, "renderer/templates/default.html");
					var navigationTop = org.ekstep.pluginframework.pluginManager.resolvePluginResource(instance._manifest.id, instance._manifest.ver, "renderer/templates/top.html");

                    scope.changeNavigation = function (event) {
						var tempUrl = "";
						switch (event.target.tempName) {
                            case "navigationTop": tempUrl = navigationTop; break;
                            default: tempUrl = defaultTempate;
                                    setTimeout(function() {
                                        jQuery('custom-previous-navigation').show();
                                    }, 100);
                                    break;
						}
						var template = '<div ng-include="\'' + tempUrl + '\'"></div>';
						// var tempUrl = (event.target.tempName === "navigationTop") ? scope.navigationTop : scope.defaultTempate;
						element.html(template).show();
						$compile(element.contents())(scope);
                    }

                    scope.changeValue = function(event) {
                        var val;
                        var globalConfig = EkstepRendererAPI.getGlobalConfig();
                        var defaultValue = globalConfig.overlay.showPrevious ? "on" : "off";
                        switch (event.type) {
                            case "overlayPrevious":
                                val = event.target ? event.target : defaultValue;
                                break;
                                /**
                                 * renderer:previous:show Event to show previous navigation icon.
                                 * @event renderer:previous:show
                                 * @listen renderer:previous:show
                                 * @memberOf EkstepRendererEvents
                                 */
                            case "renderer:previous:show":
                                val = "on"
                                break
                                /**
                                 * renderer:previous:hide Event to hide previous navigation icon.
                                 * @event renderer:previous:hide
                                 * @listen renderer:previous:hide
                                 * @memberOf EkstepRendererEvents
                                 */
                            case "renderer:previous:hide":
                                val = "off"
                                break
                        }
                        if (val === "on") {
                            var navigateToStage = EkstepRendererAPI.getStageParam("previous")
                            if (_.isUndefined(navigateToStage)) {
                                val = "disable"
                                if (EkstepRendererAPI.isItemScene() && EkstepRendererAPI.getCurrentController().hasPrevious()) {
                                    val = "enable"
                                }
                            } else {
                                val = "enable"
                            }
                        }
                        scope.showOverlayPrevious = val
                        $rootScope.safeApply()
                    }
                    _.each(events, function(event) {
                        EkstepRendererAPI.addEventListener(event, scope.changeValue, scope)
                    })
                    EkstepRendererAPI.addEventListener("renderer:navigation:load", scope.changeNavigation, scope);
                }
            }
        }])
    }
})

// # sourceURL=previousnavigationplugin.js