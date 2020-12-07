/**
 * Plugin to create repo instance and to register repo instance
 * @extends EkstepRenderer.Plugin
 * @author Manjunath Davanam <manjunathd@ilimi.in>
 * ref: http://ify.io/lazy-loading-in-angularjs/
 */
Plugin.extend({
    _templatePath: undefined,
    _userSwitcherTP: undefined,
    _menuTP: undefined,
    _type: "overlay",
    _ngScopeVar: "overlay",
    _config:{},
    overlayVisible: false, 
    initialize: function() {
        console.info('overlay plugin is doing initialize....');
        var instance = this;
        var globalConfig = EkstepRendererAPI.getGlobalConfig();
        instance._config = _.extend(instance._config, globalConfig.overlay);
        this._templatePath = org.ekstep.pluginframework.pluginManager.resolvePluginResource(this._manifest.id, this._manifest.ver, "renderer/templates/overlay.html");
        this.controllerPath = org.ekstep.pluginframework.pluginManager.resolvePluginResource(this._manifest.id, this._manifest.ver, "renderer/controller/overlay.js");
        org.ekstep.service.controller.loadNgModules(this._templatePath, this.controllerPath);

        //Loading other related temaplated of overlay 
        // this._userSwitcherTP = org.ekstep.pluginframework.pluginManager.resolvePluginResource(this._manifest.id, this._manifest.ver, "renderer/templates/user-switch-popup.html");
        this._menuTP = org.ekstep.pluginframework.pluginManager.resolvePluginResource(this._manifest.id, this._manifest.ver, "renderer/templates/menu.html");
        // org.ekstep.service.controller.loadNgModules(this._menuTP);

        EkstepRendererAPI.addEventListener("render:overlay:applyStyles", instance.updateRendererStyles, instance);
        EkstepRendererAPI.addEventListener("renderer:overlay:show", instance.showOrHideOverlay, instance);
        EkstepRendererAPI.addEventListener("renderer:content:start", instance.showOrHideOverlay, instance);
    },
    showOrHideOverlay: function(){
        this.overlayVisible = true;
    },
    updateRendererStyles: function(event, instance){
        setTimeout(function(){
            var gameArea = document.getElementById("overlay");
            var widthToHeight = 16 / 9;
            var newWidth = (window.innerWidth > window.innerHeight) ? window.innerWidth : window.innerHeight;
            var newHeight = (window.innerWidth > window.innerHeight) ? window.innerHeight : window.innerWidth;
            var newWidthToHeight = newWidth / newHeight;
            if (newWidthToHeight > widthToHeight) {
                newWidth = newHeight * widthToHeight;
                gameArea.style.height = newHeight + 'px';
                gameArea.style.width = newWidth + 'px';
            } else {
                newHeight = newWidth / widthToHeight;
                gameArea.style.width = newWidth + 'px';
                gameArea.style.height = newHeight + 'px';
            }

            gameArea.style.left = "50%";
            gameArea.style.top = "50%";
            gameArea.style.marginTop = (-newHeight / 2) + 'px';
            gameArea.style.marginLeft = (-newWidth / 2) + 'px';
        }, 0);
    },
    applyStyles: function(ele, prop, val){
        ele.style[prop] = val;
        var contentArea = document.getElementById(Renderer.divIds.contentArea);
       // contentArea.style[prop] = val;
    },
});

//# sourceURL=overlayPlugin.js