import { TelemetryInstance } from "./../services/telemetry/telemetryInstance";
import { TelemetryExport } from './../services/telemetry/TelemetryExport';
import { Inject } from "typescript-ioc";
import SettingSDK from './SettingSDK';
import * as _ from "lodash";
import { EventManager } from "./../managers/EventManager";

export default class TelemetrySDK {
  @Inject private telemetryInstance: TelemetryInstance;
  @Inject private telemetryExport: TelemetryExport;
  @Inject private settingSDK: SettingSDK;

  getInstance() {
    return this.telemetryInstance;
  }

  send(events: any[]): Promise<any> {
    return this.telemetryInstance.send(events);
  }

  export(destPath: string, cb) {
    return this.telemetryExport.export(destPath, cb);
  }

  info(cb) {
    return this.telemetryExport.info(cb)
  }

  async setTelemetrySyncSetting(enable: boolean) {
    let mapData;
    try {
      const dbData: any = await this.settingSDK.get('networkQueueInfo');
      let isTelemetryExist = _.find(dbData.config, { type: 'TELEMETRY' });
      if (isTelemetryExist) {
        mapData = _.map(dbData.config, doc => {
          if (doc.type === 'TELEMETRY') {
            doc.sync = enable;
            return doc;
          }
          return doc;
        });
      } else {
        dbData.config.push({ type: "TELEMETRY", sync: enable });
        mapData = dbData.config;
      }
    } catch (error) {
      mapData = [{ type: 'TELEMETRY', sync: enable }];
    }
    await this.settingSDK.put('networkQueueInfo', { config: mapData });
    EventManager.emit(`networkQueueInfo`, {});
    return mapData;
  }

  async getTelemetrySyncSetting(): Promise<{} | { enable: boolean }> {
    try {
      const dbData: any = await this.settingSDK.get('networkQueueInfo');
      let mapData = _.map(_.filter(dbData.config, { type: 'TELEMETRY' }), 'sync');
      if (!_.isEmpty(mapData)) {
        return Promise.resolve({ enable: mapData[0] });
      }
      return Promise.resolve({ enable: true });
    } catch (error) {
      return Promise.resolve({ enable: true });
    }
  }
}

export interface TelemetrySDKError {
  code: string;
  status: number;
  message: string;
}
