/**
 * Plugin to create repo instance and to register repo instance
 * @extends EkstepRenderer.Plugin
 * @author Gourav More <gourav_m@tekditechnologies.com>
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
        this.controllerPath = EkstepRendererAPI.resolvePluginResource(data.id, data.ver, "renderer/endpageApp.js");
        EkstepRendererAPI.addEventListener("renderer:genie:click",this.gotTohome,this)
        var instance = this;
        org.ekstep.service.controller.loadNgModules(this.templatePath, this.controllerPath);
    },
    initEndPage:function(event, instance){
        
        EkstepRendererAPI.dispatchEvent("renderer:add:template", {templatePath: this.templatePath, scopeVariable: this._ngScopeVar, toElement: '#pluginTemplate'});
    },
    gotTohome: function() {
        if (!isbrowserpreview) {
            EkstepRendererAPI.hideEndPage();
            stageId = !_.isUndefined(Renderer && Renderer.theme) ? Renderer.theme._currentStage : " ";
            TelemetryService.interact("TOUCH", "gc_genie", "TOUCH", {
                stageId: stageId
            });
            exitApp();
        };
    }
})