/**
 * Plugin to create repo instance and to register repo instance
 * @extends EkstepRenderer.Plugin
 * @author Gourav More <gourav_m@tekditechonologies.com>, Akash Gupta <akash.gupta@tarento.com>
 */
Plugin.extend({
    _templatePath: undefined,
    _type: "userswitcher",
    initialize: function() {
        console.info('user switch plugin is doing initialize....');
        var instance = this;
        this._templatePath = org.ekstep.pluginframework.pluginManager.resolvePluginResource(this._manifest.id, this._manifest.ver, "renderer/templates/sunbird-user-switch-popup.html");
        this.controllerPath = org.ekstep.pluginframework.pluginManager.resolvePluginResource(this._manifest.id, this._manifest.ver, "renderer/controller/sunbirdUserSwitcher.js");
        org.ekstep.service.controller.loadNgModules(this._templatePath, this.controllerPath);
    }
});

//# sourceURL=sunbirdUserSwitcher.js