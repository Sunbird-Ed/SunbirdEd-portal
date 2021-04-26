import { Singleton, Inject } from "typescript-ioc";
const GetMac = require("getmac");
const crypto = require("crypto");
const uuid = require("uuid");
import { logger } from "@project-sunbird/logger";
import * as os from "os";
import * as si from "systeminformation";
import * as _ from "lodash";
import SettingSDK from "./SettingSDK";
import { ClassLogger } from '@project-sunbird/logger/decorator';

@ClassLogger({
  logLevel: "debug",
  logTime: true
})
@Singleton
export default class SystemSDK {
  private deviceId: string;
  @Inject
  private settingSDK: SettingSDK;
  
  constructor(pluginId?: string) {}

  async getDeviceId() {
    if (this.deviceId) return Promise.resolve(this.deviceId);
    const  deviceInfo: any = await this.settingSDK.get('deviceId').catch(err => logger.error('While getting deviceId from settingSDK', err));
    if (deviceInfo && deviceInfo.did) {
      this.deviceId = deviceInfo.did
      return Promise.resolve(deviceInfo.did)
    } 
    let address = await this.getAddress()
    this.deviceId = crypto
                          .createHash("sha256")
                          .update(address)
                          .digest("hex");
    await this.settingSDK.put('deviceId', {did: this.deviceId});
    return Promise.resolve(this.deviceId);
  }

  // This method will return the address or unique id
  private getAddress(): Promise<string> {
    return new Promise((resolve) => {
      GetMac.getMac((err, macAddress) => { 
        if(err) {
          resolve(uuid.v4());
        } else {
          resolve(macAddress);
        }
      })
    })
  }

  async getHardDiskInfo() {
    let totalHarddisk = 0;
    let availableHarddisk = 0;
    let fsSize = await si
      .fsSize()
      .catch(error => logger.error(`while getting hard disk size`, error));
    if (fsSize) {
      if (os.platform() === "win32") {
        totalHarddisk = fsSize
          .map(mountFS => mountFS.size)
          .reduce((acc, size) => acc + size, 0);
        let usedHarddisk = fsSize
          .map(mountFS => mountFS.used)
          .reduce((acc, size) => acc + size, 0);
        availableHarddisk = totalHarddisk - usedHarddisk;
      } else {
        totalHarddisk = _.find(fsSize, { mount: "/" })["size"] || 0;
        let usedHarddisk = _.find(fsSize, { mount: "/" })["used"] || 0;
        availableHarddisk = totalHarddisk - usedHarddisk;
      }
    }

    return { totalHarddisk, availableHarddisk, fsSize };
  }

  async getMemoryInfo() {
    let totalMemory = 0;
    let availableMemory = 0;
    try {
      let memory = await si.mem();
      totalMemory = _.get(memory, "total") || 0;
      availableMemory = _.get(memory, "free") || 0;
    } catch (error) {
      logger.error(`while getting memory size`, error);
    }
    return { totalMemory, availableMemory };
  }
  async getCpuLoad(){
    let currentLoad = await si
    .currentLoad()
    .catch(err => logger.error("while reading CPU Load ", err));
    return currentLoad;
  }
  async getNetworkInfo(){
    let networkInfo = await si
    .networkInterfaces()
    .catch(err => logger.error("while reading Network info", err));
    return networkInfo;
  }
  async getDeviceInfo() {
    let deviceInfo = {
      id: "",
      platform: "",
      distro: "",
      osVersion: "",
      servicePack: "",
      arch: "",
      cores: 4,
      cpuManufacturer: "",
      cpuBrand: "",
      cpuSpeed: "",
      cpuLoad: 0,
      systemTime: 0,
      hasBattery: false,
      displayResolution: "",
      appVersion: process.env.APP_VERSION,
      appId: process.env.APP_ID,
      totalMemory: 0,
      availableMemory: 0,
      totalHarddisk: 0,
      availableHarddisk: 0,
      drives: undefined
    };

    deviceInfo.id = await this.getDeviceId();
    let osInfo = await si
      .osInfo()
      .catch(err => logger.error("while reading os info ", err));
    if (osInfo) {
      deviceInfo.platform = osInfo.platform;
      deviceInfo.distro = osInfo.distro;
      deviceInfo.osVersion = osInfo.release;
      deviceInfo.arch = osInfo.arch;
      deviceInfo.servicePack = osInfo.servicepack;
    }

    let cpu = await si
      .cpu()
      .catch(err => logger.error("while reading cpu info ", err));
    if (cpu) {
      deviceInfo.cores = cpu.cores;
      deviceInfo.cpuManufacturer = cpu.manufacturer;
      deviceInfo.cpuBrand = cpu.brand;
      deviceInfo.cpuSpeed = cpu.speed;
    }

    let currentLoad = await si
      .currentLoad()
      .catch(err => logger.error("while reading current load ", err));
    if (currentLoad) {
      deviceInfo.cpuLoad = currentLoad.currentload;
    }
    deviceInfo.systemTime = si.time()
      ? parseInt(si.time()["current"])
      : Date.now();

    let battery = await si
      .battery()
      .catch(err => logger.error("while reading battery info", err));

    if (battery) {
      deviceInfo.hasBattery = battery.hasbattery;
    }

    let graphics = await si
      .graphics()
      .catch(err => logger.error("while reading graphics info", err));
    if (!_.isEmpty(graphics["displays"][0])) {
      deviceInfo.displayResolution =
        graphics["displays"][0].currentResX +
        "*" +
        graphics["displays"][0].currentResY;
    }

    const hardDiskInfo = await this.getHardDiskInfo();

    deviceInfo.totalHarddisk = hardDiskInfo.totalHarddisk;
    deviceInfo.availableHarddisk = hardDiskInfo.availableHarddisk;
    deviceInfo.drives = hardDiskInfo.fsSize;

    const memoryInfo = await this.getMemoryInfo();
    deviceInfo.totalMemory = memoryInfo.totalMemory;
    deviceInfo.availableMemory = memoryInfo.availableMemory;

    return deviceInfo;
  }
}
