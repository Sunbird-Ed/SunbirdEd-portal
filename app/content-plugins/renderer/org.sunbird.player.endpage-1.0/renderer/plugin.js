/**
 * Plugin to create repo instance and to register repo instance
 * @extends EkstepRenderer.Plugin
 * @author Manjunath Davanam <manjunathd@ilimi.in>
 * ref: http://ify.io/lazy-loading-in-angularjs/
 */
Plugin.extend({
    myApp: undefined,
    templatePath : undefined,
    controllerPath:undefined,
    _ngScopeVar: "endPage",
    _injectTemplateFn: undefined,
    initialize: function() {
        this.templatePath = EkstepRendererAPI.resolvePluginResource(this._manifest.id, this._manifest.ver, "renderer/templates/end.html");
        this.controllerPath = EkstepRendererAPI.resolvePluginResource(this._manifest.id, this._manifest.ver, "renderer/js/endpageApp.js");
        var instance = this;
        org.ekstep.service.controller.loadNgModules(this.templatePath, this.controllerPath);
    },
    initEndPage:function(event, instance){
        this.configEndPage();
        EkstepRendererAPI.dispatchEvent("renderer:add:template", {templatePath: this.templatePath, scopeVariable: this._ngScopeVar, toElement: '#pluginTemplate'});
    },
    configEndPage:function(){
        console.info("Config end page");
    }

})