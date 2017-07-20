/**
 * @author Manjunath Davanam <manjunathd@ilimi.in>
 */


/**
 * Namespace for the sunbird portal
 */
var content_portal = function() {};
window.org = { sunbird: {} };
org.sunbird.portal = new content_portal();

org.sunbird.portal.init = function() {
    console.info("Sunbrid portal init..");
    org.sunbird.portal.addUnloadEvent();
    TelemetryService.registerEvents();
    org.sunbird.portal.telemetryInit();
};


/**
 * To add the any window unload events
 */
org.sunbird.portal.addUnloadEvent = function() {
    console.info("unload is registerd")
    window.onbeforeunload = function(e) {
        console.info("window unload is calling..")
        e = e || window.event;
        var y = e.pageY || e.clientY;
        !y && org.sunbird.portal.eventManager.dispatchEvent("sunbird:window:unload", {
            TelemetryData: TelemetryService._data
        });
    };
};

org.sunbird.portal.telemetryInit = function() {
    var _instance = {
        correlationData: [{ "id": "", "type": "" }],
        user: {
            "uid": org.sunbird.portal.uid 
        },
        otherData:{
            channel: org.sunbird.portal.channel,
            pdata:{
                "id": org.sunbird.portal.appid,
                "ver": "1.0"
            },
            "etags": {
                "app": [""],
                "partner": [""],
                "dims": [org.sunbird.portal.channel ]
            },
            "sid": org.sunbird.portal.sid,
            "did": ""
        }
    }
    org.sunbird.portal.eventManager.dispatchEvent('sunbird:telemetry:init', _instance);
}
