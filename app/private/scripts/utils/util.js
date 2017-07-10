/**
 * @author Manjunath Davanam <manjunathd@ilimi.in>
 */


/**
 * Namespace for the sunbird portal
 */
var content_portal = function() {};
window.org = {sunbird: {} };
org.sunbird.portal = new content_portal();

org.sunbird.portal.init = function() {
    console.info("Sunbrid portal init..");
    org.sunbird.portal.addUnloadEvent();
    org.sunbird.portal.syncTelemetry();
    TelemetryService.registerEvents();
};


/**
 * To add the any window unload events
 */
org.sunbird.portal.addUnloadEvent = function() {
    window.onbeforeunload = function(e) {
        console.info("window unload is calling..")
        e = e || window.event;
        var y = e.pageY || e.clientY;
        !y && org.sunbird.portal.eventmanager.dispatchEvent("sunbird:telemetry:sync", {
            TelemetryData: TelemetryService._data
        });
    };
};

/**
 * Registerd for the sunbird telemetry sync event
 */
org.sunbird.portal.syncTelemetry = function() {
    org.sunbird.portal.eventManager.addEventListener("sunbird:telemetry:sync", function(event, data) {
    	console.info("Telemetry sync in progress..");
    })
};