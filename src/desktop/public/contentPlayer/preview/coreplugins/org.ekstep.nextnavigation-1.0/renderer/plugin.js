/**
 * Plugin to create create next navigation directive and handle show and hide of next nav button
 * @extends EkstepRenderer.Plugin
 * @author Akash Gupta <akash.gupta@tarento.com>
 */
Plugin.extend({
	_type: "nextNavigation",
	initialize: function () {
		var instance = this;
		app.compileProvider.directive("nextNavigation", ["$rootScope", "$compile", function ($rootScope, $compile) {
			return {
				restrict: "E",
				template: '<div id="nav-next"></div>',
				link: function (scope, element) {
					var events = ["overlayNext", "renderer:next:show", "renderer:next:hide"]
					var defaultTempate = org.ekstep.pluginframework.pluginManager.resolvePluginResource(instance._manifest.id, instance._manifest.ver, "renderer/templates/default.html");
					var navigationTop = org.ekstep.pluginframework.pluginManager.resolvePluginResource(instance._manifest.id, instance._manifest.ver, "renderer/templates/top.html");

					scope.changeNavigation = function (event) {
						var tempUrl = "";
						switch (event.target.tempName) {
							case "navigationTop": tempUrl = navigationTop; break;
							default: tempUrl = defaultTempate; 
								setTimeout(function() {
									jQuery('custom-next-navigation').show();
								}, 100);
								break;
						}
						var template = '<div ng-include="\'' + tempUrl + '\'"></div>';
						// var tempUrl = (event.target.tempName === "navigationTop") ? scope.navigationTop : scope.defaultTempate;
						element.html(template).show();
						$compile(element.contents())(scope);
					}

					scope.toggleNav = function (event) {
						var val
						var globalConfig = EkstepRendererAPI.getGlobalConfig()
						var defaultValue = globalConfig.overlay.showNext ? "on" : "off"
						switch (event.type) {
						/**
                             * renderer:next:show Event to show next navigation icon.
                             * @event renderer:next:show
                             * @listen renderer:next:show
                             * @memberOf EkstepRendererEvents
                             */
						case "renderer:next:show":
							val = "on"
							break
							/**
                                 * renderer:next:hide Event to hide next navigation icon.
                                 * @event renderer:next:hide
                                 * @listen renderer:next:hide
                                 * @memberOf EkstepRendererEvents
                                 */
						case "renderer:next:hide":
							val = "off"
							break
						case "overlayNext":
							val = event.target ? event.target : defaultValue
						}
						scope.showOverlayNext = val
						$rootScope.safeApply()
					}
					_.each(events, function (event) {
						EkstepRendererAPI.addEventListener(event, scope.toggleNav, scope)
					})

					EkstepRendererAPI.addEventListener("renderer:navigation:load", scope.changeNavigation, scope);
				}
			}
		}])
	}
})

// # sourceURL=nextnavigationplugin.js