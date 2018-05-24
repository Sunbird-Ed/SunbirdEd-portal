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
                    var custTelemetryEvent = new CustomEvent('renderer:telemetry:event', {
                        "detail": {
                            "telemetryData": parsedData
                        }
                    });
                    window.parent.document.getElementById('contentPlayer').dispatchEvent(custTelemetryEvent);
                  //  console.info('OE_END Event is sending..');
            }
        }
    }
});


//# sourceURL=rendererEventReaderer.js
