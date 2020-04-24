const opentracing = require('opentracing');
const telemetryHelper = require('./telemetryHelper.js');
module.exports = function (req, res, next) {
    if(req.headers['x-traceid'] && req.headers['x-spanid']) {
      req.parentSpanId = req.headers['x-spanid'];
      let trace = new opentracing.MockTracer();
      let parentSpan = trace.startSpan(req.get('x-tracename'));
      let childSpan = trace.startSpan(req.get('x-spanname'));
      req.headers['x-traceid'] = parentSpan._uuid;
      req.headers['x-spanid']  = childSpan._uuid;
      req.traceStartTime = childSpan._startMs;
      trace.clear();
      res.on("finish", () => {
          telemetryHelper.generateTelemetryForTraceEvent(req,res);
      });
    }
    next();
}