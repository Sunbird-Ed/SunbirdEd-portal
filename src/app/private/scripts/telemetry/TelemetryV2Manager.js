TelemetryV2Manager = function () {
  this._end = new Array()
  this._start = new Array()
  this.init = function () {
    console.info('Telemetryservice 2 is initialized')
  }
  this.exitWithError = function () {
    var message = ''
    if (error) message += ' Error: ' + JSON.stringify(error)
    this.exitApp()
  }
  this.createEvent = function (eventName, body, consumer) {
    var event = new TelemetryEvent()
    if (consumer == 'PORTAL') {
      event.portalInit(eventName, TelemetryService._version, body, TelemetryService._user, TelemetryService._correlationData, TelemetryService._otherData)
      return event
    } else {
      event.init(eventName, TelemetryService._version, body, TelemetryService._user, TelemetryService._gameData, TelemetryService._correlationData, TelemetryService._otherData)
      return event
    }
  }
  this.start = function (id, ver, data) {
    TelemetryService._gameData = {
      id: id,
      ver: ver
    }
    this._end.push(this.createEvent('OE_END', {}).start())
    this._start.push({
      id: id,
      ver: ver
    })
    return this.createEvent('OE_START', data)
  }
  this.end = function (progress) {
    if (!_.isEmpty(this._start)) {
      this._start.pop()
      return this._end.pop().end(progress)
    } else {
      console.warn('Telemetry service end is already logged Please log start telemetry again')
    }
  }
  this.interact = function (type, id, extype, eks) {
    if (eks.optionTag) { TelemetryService.flushEvent(this.itemResponse(eks), TelemetryService.apis.telemetry) }
    if (type != 'DRAG') {
      var eks = {
        'stageid': eks.stageId ? eks.stageId : '',
        'type': type,
        'subtype': eks.subtype ? eks.subtype : '',
        'pos': eks.pos ? eks.pos : [],
        'id': id,
        'tid': eks.tid ? eks.tid : '',
        'uri': eks.uri ? eks.uri : '',
        'extype': '',
        'values': eks.values ? eks.values : []
      }
      return this.createEvent('OE_INTERACT', eks)
    }
  }

  this.assess = function (qid, subj, qlevel, data) {
    var maxscore
    subj = subj || ''
    if (data) {
      maxscore = data.maxscore || 1
    }
    qlevel = qlevel || 'MEDIUM'
    if (qid) {
      var eks = {
        qid: qid,
        maxscore: maxscore,
        params: []
      }
      return this.createEvent('OE_ASSESS', eks).start()
    } else {
      console.error('qid is required to create assess event.', qid)
            // TelemetryService.logError("OE_ASSESS", "qid is required to create assess event.")
      return new InActiveEvent()
    }
  }

  this.error = function (data) {
    var data = {
      env: data.env || '',
      type: data.type || '',
      stageid: data.stageId || '',
      objecttype: data.objectType || '',
      objectid: data.objectId || '',
      err: data.err || '',
      action: data.action || '',
      data: data.data || '',
      severity: data.severity || ''
    }
    return this.createEvent('OE_ERROR', data)
  }

  this.assessEnd = function (eventObj, data) {
    if (eventObj) {
      if (!eventObj._isStarted) {
        eventObj._isStarted = true // reset start status to true for re-assess events
      }

      eventObj.event.edata.eks.score = data.score || 0
      eventObj.event.edata.eks.pass = data.pass ? 'Yes' : 'No'
      eventObj.event.edata.eks.resvalues = _.isEmpty(data.res) ? [] : data.res
      eventObj.event.edata.eks.uri = data.uri || ''
      eventObj.event.edata.eks.qindex = data.qindex || 0
      eventObj.event.edata.eks.exlength = 0
      eventObj.event.edata.eks.qtitle = data.qtitle
      eventObj.event.edata.eks.qdesc = data.qdesc.substr(0, 140)
      eventObj.event.edata.eks.mmc = data.mmc
      eventObj.event.edata.eks.mc = data.mc
      if (_.isArray(eventObj.event.edata.eks.resvalues)) {
        eventObj.event.edata.eks.resvalues = _.map(eventObj.event.edata.eks.resvalues, function (val) {
          val = _.isObject(val) ? val : {
            '0': val
          }
          return val
        })
      } else {
        eventObj.event.edata.eks.resvalues = []
      }

      eventObj.end()
      return eventObj
    }
  }

  this.interrupt = function (type, id) {
    var eventStr = TelemetryService._config.events['OE_INTERRUPT']
    var eks = {
      'type': type,
      'stageid': id || ''
    }
    return this.createEvent('OE_INTERRUPT', eks)
  }

  this.exitApp = function () {
    setTimeout(function () {
      navigator.app.exitApp()
    }, 5000)
  }

  this.navigate = function (stageid, stageto) {
    if (stageto != undefined && stageid != undefined && stageto != stageid) {
      var eks = {
        stageid: stageid || '',
        stageto: stageto || '',
        type: '',
        itype: ''
      }
      return this.createEvent('OE_NAVIGATE', eks)
    }
  }

  this.itemResponse = function (data) {
    var type = data.optionTag == 'MCQ' ? 'CHOOSE' : 'MATCH'
    var eks = {
      'qid': data.itemId ? data.itemId : '',
      'type': type || '',
      'state': data.state ? data.state : '',
      'resvalues': _.isEmpty(data.res) ? [] : data.res
    }
    return this.createEvent('OE_ITEM_RESPONSE', eks)
  }

  this.sendFeedback = function (eks) {
    return this.createEvent('', eks)
  }
  this.impression = function (data) {
    var obj = {
      env: data.env || '',
      type: data.type || '',
      pageid: data.pageid || '',
      id: data.id || '',
      name: data.name || '',
      url: data.url || ''
    }
    return this.createEvent('CP_IMPRESSION', obj, 'PORTAL')
  }
  this.sessionStart = function (data) {
    return this.createEvent('CP_SESSION_START', data, 'PORTAL')
  }
  this.sessionEnd = function (data) {
    return this.createEvent('CP_SESSION_END', data, 'PORTAL')
  }
  this.profileUpdate = function (data) {
    var obj = {
      'name': data.name || '',
      'email': data.email || '',
      'access': data.access || [],
      'partners': data.partners || [],
      'profile': data.profile || []
    }
    return this.createEvent('CP_UPDATE_PROFILE', data, 'PORTAL')
  }
  this.portalIntreact = function (data) {
    var obj = {
      'env': data.env || '',
      'context': data.context || '',
      'type': data.type || '',
      'target': data.target || '',
      'targetid': data.targetid || '',
      'subtype': data.subtype || '',
      'values': data.values || []
    }

    return this.createEvent('CP_INTERACT', data, 'PORTAL')
  }
}
