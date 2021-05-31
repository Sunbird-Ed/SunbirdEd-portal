import * as _ from "lodash";
import { containerAPI } from "@project-sunbird/OpenRAP/api";
import { StandardLogger } from '@project-sunbird/OpenRAP/services/standardLogger';
export default class Device {
  private settingSDK;
  private standardLog: StandardLogger;
  constructor(manifest) {
    this.settingSDK = containerAPI.getSettingSDKInstance(manifest.id);
    this.standardLog = containerAPI.getStandardLoggerInstance();
  }

  public async updateDeviceProfile(request) {
    const { userDeclaredLocation } = request;
    await this.settingSDK.put(`location`, userDeclaredLocation)
      .catch((error) => { 
        this.standardLog.error({ id: 'DEVICE_DB_UPDATE_FAILED', message: 'Error while adding data to setting SDK', error });
      });
  }

  public async getDeviceProfile() {
    return this.settingSDK.get(`location`)
      .catch((error) => { 
        this.standardLog.error({ id: 'DEVICE_DB_READ_FAILED', message: 'Error while getting location data from setting SDK', error });
      });
  }
  
}