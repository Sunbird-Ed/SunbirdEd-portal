import { logger } from "@project-sunbird/logger";
import * as _ from "lodash";
import { containerAPI } from "@project-sunbird/OpenRAP/api";

export default class Device {
  private settingSDK;
  constructor(manifest) {
    this.settingSDK = containerAPI.getSettingSDKInstance(manifest.id);
  }

  public async updateDeviceProfile(request) {
    const { userDeclaredLocation } = request;
    await this.settingSDK.put(`location`, userDeclaredLocation)
      .catch((error) => { logger.error("Error while adding data to setting SDK", error); });
  }

  public async getDeviceProfile() {
    return await this.settingSDK.get(`location`)
      .catch((error) => { logger.error("Error while getting location data from setting SDK", error); });
  }
  
}