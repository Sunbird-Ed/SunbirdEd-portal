InActiveEvent = Class.extend({
    init: function() {},
    ext: function() {return this;},
    flush: function() {},
    __noSuchMethod__: function() {
        console.log('TelemetryService is inActive');
        return this;
    }
})