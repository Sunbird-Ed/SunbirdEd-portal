export interface TelemetryConfig {
  pdata: {
    id: string;
    ver: string;
    pid: string;
  };
  sid: string;
  env: string;
  rootOrgId: string;
  hashTagId: string;
  batchSize: number;
  enableValidation: boolean;
  runningEnv?: string;
  dispatcher: (events) => void;
}
