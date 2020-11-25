import { EventManager } from "./../managers/EventManager";
import { Singleton } from "typescript-ioc";
import * as dns from "dns";
import { TelemetryInstance } from "./../services/telemetry/telemetryInstance";
import { Inject } from "typescript-ioc";
const URL = require('url').URL;
@Singleton
export default class NetworkSDK {
  private internetStatus;
  @Inject
  private telemetryInstance: TelemetryInstance;

  constructor() {
    this.setInitialStatus();
    this.setEventEmitter();
  }

  isInternetAvailable = (baseUrl?: string): Promise<boolean> => {
    return new Promise(resolve => {
      let endPointUrl: string = baseUrl
        ? baseUrl
        : (process.env.APP_BASE_URL as string);
      const url = new URL(endPointUrl);
      dns.resolve(url.hostname, err => {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  };
  private async setInitialStatus() {
    this.internetStatus = await this.isInternetAvailable();
  }
  private setEventEmitter() {
    setInterval(async () => {
      let status = await this.isInternetAvailable();
      if (this.internetStatus !== status) {
        if (status) {
          EventManager.emit("network:available", {});
          this.internetStatus = status;
        } else {
          EventManager.emit("network:disconnected", {});
          this.internetStatus = status;
        }
        this.telemetryInstance.interrupt({
          context: {
            env: "network"
          },
          edata: {
            type: status ? "connected" : "disconnected"
          }
        });
      }
    }, 300000);
  }
}

//network:available
//network:disconnected
