function InActiveEvent () {
  this.__noSuchMethod__ = function () {
    console.log('TelemetryService is inActive')
    return this
  }
  this.init = function () {

  }
  this.ext = function () {

  }
  this.flush = function () {}
}
