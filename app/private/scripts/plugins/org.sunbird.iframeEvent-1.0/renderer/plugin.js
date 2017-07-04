/**
 * Plugin to read the telemetry event from the renderer
 * @extends { Renderer BasePlugin}
 * @author Manjunath Davanam
 */


Plugin.extend({
    initialize: function(){
        console.info('Sunbird Telemetry get plugin is initialized..');
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
                    var custTelemetryEvent = new CustomEvent('renderer:telemetryevent:end', {
                        "detail": {
                            "telemetryData": parsedData
                        }
                    });
                    window.parent.dispatchEvent(custTelemetryEvent);
                    console.info('OE_END Event is sending..');
                }
            }
        }
    }
});


//# sourceURL=rendererEventReaderer.js
