TelemetryService = {
  _version: '2.1',
  _baseDir: '',
  isActive: false,
  _config: undefined,
  instance: undefined,
  gameOutputFile: undefined,
  _gameErrorFile: undefined,
  _gameData: undefined,
  _correlationData: undefined,
  _data: [],
  _batchEvents: [],
  _gameIds: [],
  _user: {},
  apis: {
    telemetry: 'sendTelemetry',
    feedback: 'sendFeedback'
  },
  mouseEventMapping: {
    click: 'TOUCH',
    dblclick: 'CHOOSE',
    mousedown: 'DROP',
    pressup: 'DRAG'
  },

    /**
     * Telemetry service init should happen before calling any telemetry action
     * @param  {obj} event name of the event which has been calling by using sunbird eventmanager
     * @param  {obj} obj   object whihc should have mandtory fileds to instantiate the
     */

  registerEvents: function () {
        /**
         * player events are being registred
         */

    org.sunbird.portal.eventManager.addEventListener('sunbird:telemetry:init', this.init, this)
    org.sunbird.portal.eventManager.addEventListener('sunbird:telemetry:start', this.start, this)
    org.sunbird.portal.eventManager.addEventListener('sunbird:telemetry:end', this.end, this)
    org.sunbird.portal.eventManager.addEventListener('sunbird:telemetry:intreact', this.interact, this)
    org.sunbird.portal.eventManager.addEventListener('sunbird:telemetry:navigate', this.navigate, this)

        /**
         * portal events are being registred
         */
    org.sunbird.portal.eventManager.addEventListener('sunbird:telemetery:portal:impression', this.impression, this)
    org.sunbird.portal.eventManager.addEventListener('sunbird:telemetry:portal:sessionStart', this.sessionStart, this)
    org.sunbird.portal.eventManager.addEventListener('sunbird:telemetry:portal:sessionEnd', this.sessionEnd, this)
    org.sunbird.portal.eventManager.addEventListener('sunbird:telemetry:portal:profileupdate', this.profileUpdate, this)
    org.sunbird.portal.eventManager.addEventListener('sunbird:telemetry:portal:intreact', this.portalIntreact, this)
        /**
         * Announcement events are being registred
         */
    org.sunbird.portal.eventManager.addEventListener('sunbird:telemetry:announcement:impression', this.announcementImpression, this)
  },

    /**
     * Telemetry service init should happen before calling any telemetry action
     * @param  {obj} event name of the event which has been calling by using sunbird eventmanager
     * @param  {obj} obj   object whihc should have mandtory fileds to instantiate the
     */
  init: function (event, obj) {
    return new Promise(function (resolve, reject) {
      TelemetryService._user = obj.user
      TelemetryService.instance = new TelemetryV2Manager()
      TelemetryService.instance.init()
      if (obj.gameData) {
        if (obj.gameData.id && obj.gameData.ver) {
          TelemetryService._parentGameData = obj.gameData
          TelemetryService._gameData = obj.gameData
        } else {
          reject('Invalid game data.')
        }
      }
      TelemetryServiceUtil.getConfig().then(function (config) {
        TelemetryService._config = config
        if (TelemetryService._config.isActive) TelemetryService.isActive = TelemetryService._config.isActive
        resolve(true)
      }).catch(function (err) {
        reject(err)
      })
      if (obj.correlationData && !_.isEmpty(obj.correlationData)) {
        TelemetryService._correlationData = obj.correlationData
      };
      if (obj.otherData && !_.isEmpty(obj.otherData)) {
        TelemetryService._otherData = obj.otherData
      };
      if (obj.context && !_.isEmpty(obj.context.dims)) {
        TelemetryService._otherData.etags.dims = obj.context.dims
      }
      resolve(true)
    })
  },
  webInit: function (gameData, user) {
    return new Promise(function (resolve, reject) {
      TelemetryService.init(gameData, user)
                .then(function () {
                  TelemetryService.start(gameData.id, gameData.ver)
                  resolve(true)
                })
                .catch(function (err) {
                  reject(err)
                })
    })
  },
  changeVersion: function (version) {
    TelemetryService._version = version
    TelemetryService.instance = (TelemetryService._version == '1.0') ? new TelemetryV1Manager() : new TelemetryV2Manager()
    console.info('Telemetry Version updated to:', version)
  },
  getDataByField: function (field) {

  },
  getGameData: function () {
    return TelemetryService.isActive ? TelemetryService._gameData : undefined
  },
  getInstance: function () {
    return TelemetryService.isActive ? TelemetryService.instance : undefined
  },
  getMouseEventMapping: function () {
    return TelemetryService.mouseEventMapping
  },
  getGameId: function () {
    return TelemetryService.isActive ? TelemetryService._gameData.id : undefined
  },
  getGameVer: function () {
    return TelemetryService.isActive ? TelemetryService._gameData.ver : undefined
  },
  exitWithError: function (error) {
    var message = ''
    if (error) message += ' Error: ' + JSON.stringify(error)
    TelemetryService.instance.exitApp()
  },
  flushEvent: function (event, apiName) {
    if (event) { event.flush(apiName) }
    return event
  },
  start: function (evt, obj) {
    if (!TelemetryService.isActive) {
      console.log('TelemetryService is not active.')
      return new InActiveEvent()
    } else {
      obj.ver = (obj.ver) ? obj.ver + '' : '1' // setting default ver to 1
      if (_.find(TelemetryService.instance._start, {
        id: obj.id
      })) { return new InActiveEvent() } else { return TelemetryService.flushEvent(TelemetryService.instance.start(obj.id, obj.ver, obj.data), TelemetryService.apis.telemetry) }
    }
  },
  end: function (evt, obj) {
    if (!TelemetryService.isActive) {
      return new InActiveEvent()
    }
    return this.flushEvent(TelemetryService.instance.end(obj.progress), TelemetryService.apis.telemetry)
  },
  interact: function (evt, obj) {
    if (!TelemetryService.isActive) {
      return new InActiveEvent()
    }
    return TelemetryService.flushEvent(TelemetryService.instance.interact(obj.type, obj.id, obj.extype, obj.data), TelemetryService.apis.telemetry)
  },
  setUser: function () {
    TelemetryService._user = obj.data
    obj.data.stageId = obj.stageid
    TelemetryService.interact('TOUCH', 'gc_userswitch', 'TOUCH', obj.data)
  },
  assess: function (evt, obj) {
    if (!TelemetryService.isActive) {
      return new InActiveEvent()
    }
    return TelemetryService.instance.assess(obj.qid, obj.subj, obj.qlevel, obj.data)
  },
  error: function (evt, obj) {
    if (!TelemetryService.isActive) {
      return new InActiveEvent()
    }
    return TelemetryService.flushEvent(TelemetryService.instance.error(obj), TelemetryService.apis.telemetry)
  },
  assessEnd: function (evt, obj) {
    if (!TelemetryService.isActive) {
      return new InActiveEvent()
    }
    return TelemetryService.flushEvent(TelemetryService.instance.assessEnd(obj.event, obj.data), TelemetryService.apis.telemetry)
  },
  levelSet: function (evt, eventData) {
    if (TelemetryService.isActive) {
      var eventName = 'OE_LEVEL_SET'
      return new InActiveEvent()
    }
  },
  interrupt: function (evt, obj) {
    if (!TelemetryService.isActive) {
      return new InActiveEvent()
    }
    return TelemetryService.flushEvent(TelemetryService.instance.interrupt(obj.type, obj.id), TelemetryService.apis.telemetry)
  },
  exitApp: function () {
    setTimeout(function () {
      navigator.app.exitApp()
    }, 5000)
  },
  navigate: function (evt, obj) {
    if (!TelemetryService.isActive) {
      return new InActiveEvent()
    }
    return TelemetryService._version == '1.0' ? '' : this.flushEvent(TelemetryService.instance.navigate(obj.stageid, obj.stageto), TelemetryService.apis.telemetry)
  },
  sendFeedback: function (evt, eks) {
    if (!TelemetryService.isActive) {
      return new InActiveEvent()
    }
    return this.flushEvent(TelemetryService.instance.sendFeedback(eks), TelemetryService.apis.feedback)
  },
  itemResponse: function (evt, obj) {
    if (!TelemetryService.isActive) {
      return new InActiveEvent()
    }
    return TelemetryService.instance.itemResponse(obj)
  },
  resume: function (evt, obj) {
    var previousContentId = TelemetryService._gameData
    var previousUserId = TelemetryService._user.uid
    if (previousContentId != obj.NewContentId || obj.newUserId != previousUserId) {
      TelemetryService.end()
      TelemetryService.init(TelemetryService._gameData, TelemetryService._user)
      TelemetryService.start()
    }
  },
  exit: function () {
    if (TelemetryService.isActive) {
      TelemetryService._data = []
      if (!_.isEmpty(TelemetryService.instance._end)) {
        var len = TelemetryService.instance._end.length
        for (var i = 0; i < len; i++) { TelemetryService.end() }
      }
      if (_.isEmpty(TelemetryService.instance._end)) {
        TelemetryService.isActive = false
      }
    }
  },
  logError: function (eventName, error) {
    var data = {
      'eventName': eventName,
      'message': error,
      'time': getCurrentTime()
    }
            // change this to write to file??
    console.log('TelemetryService Error:', JSON.stringify(data))
        // create the event and Dispatch the Event
    var evt = document.createEvent('Event')
    evt.initEvent('logError', true, true)
    document.body.dispatchEvent(evt)
    console.info('Telemetry :' + JSON.stringify(data.message))
  },
  print: function () {
    if (TelemetryService._data.length > 0) {
      var events = TelemetryService._data.cleanUndefined()
      events = _.pluck(events, 'event')
      console.log(JSON.stringify(events))
    } else {
      console.log('No events to print.')
    }
  },
  impression: function (eventName, obj) {
    if (!TelemetryService.isActive) {
      return InActiveEvent()
    }
    return TelemetryService.flushEvent(TelemetryService.instance.impression(obj), TelemetryService.apis.telemetry)
  },
    /**
     * @method announcementImpression
     * @param   {string}  eventName  [event name]
     * @param   {object}  obj  [telemetry data]
     */
  announcementImpression: function (eventName, obj) {
    TelemetryService._correlationData = [{
      id: obj.userIdHashTag,
      type: 'announcement'
    }]
    delete obj.userIdHashTag
    if (!TelemetryService.isActive) {
      return InActiveEvent()
    }
    return TelemetryService.flushEvent(TelemetryService.instance.impression(obj), TelemetryService.apis.telemetry)
  },
  sessionStart: function (eventName, obj) {
    if (!TelemetryService.isActive) {
      return InActiveEvent()
    }
    return TelemetryService.flushEvent(TelemetryService.instance.sessionStart(obj), TelemetryService.apis.telemetry)
  },
  sessionEnd: function (eventName, obj) {
    if (!TelemetryService.isActive) {
      return InActiveEvent()
    }
    return TelemetryService.flushEvent(TelemetryService.instance.sessionEnd(obj), TelemetryService.apis.telemetry)
  },
  profileUpdate: function (eventName, obj) {
    if (!TelemetryService.isActive) {
      return InActiveEvent()
    }
    return TelemetryService.flushEvent(TelemetryService.instance.profileUpdate(obj), TelemetryService.apis.telemetry)
  },
  portalIntreact: function (eventName, obj) {
    if (!TelemetryService.isActive) {
      return InActiveEvent()
    }
    return TelemetryService.flushEvent(TelemetryService.instance.portalIntreact(obj), TelemetryService.apis.telemetry)
  }
}

Array.prototype.cleanUndefined = function () {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == undefined) {
      this.splice(i, 1)
      i--
    }
  }
  return this
}
