/**
 * Plugin to read the telemetry event from the renderer
 * @extends { Renderer BasePlugin}
 * @author Manjunath Davanam
 */


Plugin.extend({
    initialize: function(){
        EventBus.addEventListener('telemetryEvent',this.sendTelemetry,this);
    },
    isPreviewInIframe: function(){
        return (window.self != window.top) ? true : false;
    },
    sendTelemetry: function(evt) {
        var instance = this;
        if (instance.isPreviewInIframe()) {
            if (evt.target) {
                var parsedData = JSON.parse(evt.target);
                if (parsedData.eid === 'OE_END') {
                    var custTelemetryEvent = new new CustomEvent("renderer:telemety:end");
                    window.parent.dispatchEvent(custTelemetryEvent, {
                        "detail": {
                            "telemetryData": parsedData
                        }
                    });
                    console.info('OE_END Event is sending..');
                }
            }
        }
    }
});


//# sourceURL=rendererEventReaderer.js
