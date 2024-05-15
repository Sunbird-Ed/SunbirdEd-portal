import { Singleton, Inject } from "typescript-ioc";
const GetMac = require("getmac");
const crypto = require("crypto");
const { v4: uuid } = require('uuid');
import { logger } from "@project-sunbird/logger";
import * as os from "os";
import * as si from "systeminformation";
import * as _ from "lodash";
import SettingSDK from "./SettingSDK";

import { StandardLogger } from '../services/standardLogger/standardLogger';

@Singleton
export default class SystemSDK {
  private deviceId: string;
  @Inject private settingSDK: SettingSDK;
  @Inject private standardLog: StandardLogger;
  
  constructor(pluginId?: string) {}

  async getDeviceId() {
    if (this.deviceId) return Promise.resolve(this.deviceId);
    const  deviceInfo: any = await this.settingSDK.get('deviceId').catch(err => {
      this.standardLog.error({ id: 'SYSTEM_SDK_DEVICE_ID_FETCH_FAILED', message: 'While getting deviceId from settingSDK', error: err });
    });
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
          resolve(uuid());
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
      .catch(error => {
        this.standardLog.error({ id: 'SYSTEM_SDK_HARD_DISK_SIZE_FETCH_FAILED', message: 'while getting hard disk size', error })
      }); 
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
      this.standardLog.error({ id: 'SYSTEM_SDK_MEMORY_SIZE_FETCH_FAILED', message: 'while getting memory size', error });
    }
    return { totalMemory, availableMemory };
  }
  async getCpuLoad(){
    let currentLoad = await si
    .currentLoad()
    .catch(err => {
    this.standardLog.error({ id: 'SYSTEM_SDK_CPU_LOAD_FETCH_FAILED', message: 'while reading CPU Load', error: err })
    });
    return currentLoad;
  }
  async getNetworkInfo(){
    let networkInfo = await si
    .networkInterfaces()
      .catch(err => { 
        this.standardLog.error({ id: 'SYSTEM_SDK_NETWORK_INFO_READ_FAILED', message: 'while reading Network info', error: err })
      });
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
      .catch(err => {
        this.standardLog.error({ id: 'SYSTEM_SDK_OS_INFO_READ_FAILED', message: 'while reading os info', error: err })
      }); 
    if (osInfo) {
      deviceInfo.platform = osInfo.platform;
      deviceInfo.distro = osInfo.distro;
      deviceInfo.osVersion = osInfo.release;
      deviceInfo.arch = osInfo.arch;
      deviceInfo.servicePack = osInfo.servicepack;
    }

    let cpu = await si
      .cpu()
      .catch(err => {
        this.standardLog.error({ id: 'SYSTEM_SDK_CPU_INFO_READ_FAILED', message: 'while reading cpu info ', error: err })
      });
    if (cpu) {
      deviceInfo.cores = cpu.cores;
      deviceInfo.cpuManufacturer = cpu.manufacturer;
      deviceInfo.cpuBrand = cpu.brand;
      deviceInfo.cpuSpeed = cpu.speed as any;
    }

    let currentLoad = await si
      .currentLoad()
      .catch(err => {
        this.standardLog.error({id: 'SYSTEM_SDK_CURRENT_LOAD_READ_FAILED', message: 'while reading current load', error: err})
      }) as any;
    if (currentLoad) {
      deviceInfo.cpuLoad = currentLoad.currentload;
    }
    let time = si.time() ? (si.time()["current"]) : Date.now();
    deviceInfo.systemTime = (time) as any;

    let battery = await si
      .battery()
      .catch(err => {
        this.standardLog.error({ id: 'SYSTEM_SDK_BATTERY_READ_FAILED', message: 'while reading battery info', error: err })
      }) as any;

    if (battery) {
      deviceInfo.hasBattery = battery.hasbattery as any;
    }

    let graphics = await si
      .graphics()
      .catch(err => { 
        this.standardLog.error({id: 'SYSTEM_SDK_GRAPHICS_INFO_READ_FAILED', message: 'while reading graphics info', error: err})
      });
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
    console.log('sonu======>', deviceInfo)

    return deviceInfo;
  }
}
