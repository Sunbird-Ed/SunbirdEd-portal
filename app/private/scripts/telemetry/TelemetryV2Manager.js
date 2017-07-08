TelemetryV2Manager = Class.extend({
    _end: new Array(),
    _start: new Array(),
     init: function() {
        console.info("TelemetryService Version 2 initialized..");
    },
    exitWithError: function(error) {
        var message = '';
        if (error) message += ' Error: ' + JSON.stringify(error);
        TelemetryServiceV2.exitApp();
    },
    createEvent: function(eventName, body) {
        return new TelemetryEvent(eventName, TelemetryService._version, body, TelemetryService._user, TelemetryService._gameData, TelemetryService._correlationData);
    },
    start: function(id, ver, data) {
        TelemetryService._gameData = {id: id , ver : ver};
        this._end.push(this.createEvent("OE_END", {}).start());
        this._start.push({id: id , ver : ver});
        return this.createEvent("OE_START", data);
    },
    end: function(gameId) {
        if (!_.isEmpty(this._start)) {
            this._start.pop();
            return this._end.pop().end();
        } else {
            console.warn("Telemetry service end is already logged Please log start telemetry again");
        }
    },
    interact: function(type, id, extype, eks) {
        if (eks.optionTag)
            TelemetryService.flushEvent(this.itemResponse(eks), TelemetryService.apis.telemetry);
        if (type != "DRAG") {
            var eks = {
                "stageid": eks.stageId ? eks.stageId : "",
                "type": type,
                "subtype": eks.subtype ? eks.subtype : "",
                "pos": eks.pos ? eks.pos : [],
                "id": id,
                "tid": eks.tid ? eks.tid : "",
                "uri": eks.uri ? eks.uri : "",
                "extype": "",
                "values": eks.values ? eks.values : []
            };
            return this.createEvent("OE_INTERACT", eks);
        }
    },
    assess: function(qid, subj, qlevel, data) {
        var maxscore;
        subj = subj ? subj : "";
        if (data) {
            maxscore = data.maxscore || 1;
        }
        qlevel = qlevel ? qlevel : "MEDIUM";
        if (qid) {
            var eks = {
                qid: qid,
                maxscore: maxscore ,
                params: []
            };
            return this.createEvent("OE_ASSESS", eks).start();
        } else {
            console.error("qid is required to create assess event.", qid);
            // TelemetryService.logError("OE_ASSESS", "qid is required to create assess event.")
            return new InActiveEvent();
        }

    },
    error: function(data) {
        var data = {env: data.env || '', type: data.type || '', stageid: data.stageId || '', objecttype: data.objectType || '', objectid: data.objectId || '', err: data.err || '', action: data.action || '', data: data.data || '', severity: data.severity || ''}
        return this.createEvent("OE_ERROR", data);
    },
    assessEnd: function(eventObj, data) {
        if (eventObj) {

            if (!eventObj._isStarted) {
                eventObj._isStarted = true; // reset start status to true for re-assess events
            }

            eventObj.event.edata.eks.score = data.score || 0;
            eventObj.event.edata.eks.pass = data.pass ? 'Yes' : 'No';
            eventObj.event.edata.eks.resvalues = _.isEmpty(data.res)? [] : data.res;
            eventObj.event.edata.eks.uri = data.uri || "";
            eventObj.event.edata.eks.qindex = data.qindex || 0;
            eventObj.event.edata.eks.exlength = 0;
            eventObj.event.edata.eks.qtitle = data.qtitle;
            eventObj.event.edata.eks.qdesc = data.qdesc.substr(0,140);
            eventObj.event.edata.eks.mmc = data.mmc;
            eventObj.event.edata.eks.mc = data.mc;
            if (_.isArray(eventObj.event.edata.eks.resvalues)) {
                eventObj.event.edata.eks.resvalues = _.map(eventObj.event.edata.eks.resvalues, function(val) {
                    val = _.isObject(val) ? val :{"0" : val};
                    return val;
                });
            } else {
                eventObj.event.edata.eks.resvalues = [];
            }

            eventObj.end();
            return eventObj;
        }
    },
    interrupt: function(type, id) {
            var eventStr = TelemetryService._config.events["OE_INTERRUPT"];
            var eks = {
                "type": type,
                "stageid": id || ''
            };
            return this.createEvent("OE_INTERRUPT", eks);
    },
    exitApp: function() {
        setTimeout(function() {
            navigator.app.exitApp();
        }, 5000);
    },
    navigate: function(stageid, stageto) {
        if (stageto != undefined && stageid != undefined && stageto != stageid) {
            var eks = {
                stageid: stageid ? stageid : "",
                stageto: stageto ? stageto : "",
                type: "",
                itype: ""
            };
            return this.createEvent("OE_NAVIGATE", eks);
        }
    },
    itemResponse: function(data) {
        var type = data.optionTag == "MCQ" ? "CHOOSE" : "MATCH";
        var eks = {
                "qid": data.itemId ? data.itemId : "",
                "type": type ? type : "",
                "state": data.state ? data.state : "",
                "resvalues": _.isEmpty(data.res) ? [] : data.res
            };
        return this.createEvent("OE_ITEM_RESPONSE", eks);
    },
    sendFeedback: function(eks) {
        return this.createEvent("", eks);
    }
})
