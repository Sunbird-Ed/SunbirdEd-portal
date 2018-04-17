/**
 * telemetry envelope
*/
interface IProducerData {
  'id': String;
  'ver': String;
  'pid': String;
}

export interface ITelemetry {
  'pdata': IProducerData;
  'env': String;
  'channel': String;
  'did'?: String;
  'authtoken'?: String;
  'uid': String;
  'sid'?: String;
  'batchsize'?: Number;
  'runningEnv'?: String;
  'mode'?: String;
  'host'?: String;
  'endpoint': String;
  'tags'?: Array<String>;
  'cdata'?: Array<Object>;
  'dispatcher'?: undefined;
  'apislug': String;
}
