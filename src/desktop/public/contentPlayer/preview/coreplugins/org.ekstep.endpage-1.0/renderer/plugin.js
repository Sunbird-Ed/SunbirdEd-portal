/**
 * Plugin to create repo instance and to register repo instance
 * @extends EkstepRenderer.Plugin
 * @author Manjunath Davanam <manjunathd@ilimi.in>
 * ref: http://ify.io/lazy-loading-in-angularjs/
 */
org.ekstep.contentrenderer.baseEndepage.extend({
    myApp: undefined,
    templatePath : undefined,
    controllerPath:undefined,
    _ngScopeVar: "endPage",
    _injectTemplateFn: undefined,
    initialize: function(data) {
        this.templatePath = EkstepRendererAPI.resolvePluginResource(data.id, data.ver, "renderer/templates/end.html");
        this.controllerPath = EkstepRendererAPI.resolvePluginResource(data.id, data.ver, "renderer/js/endpageApp.js");
        org.ekstep.service.controller.loadNgModules(this.templatePath, this.controllerPath);
    }
})
