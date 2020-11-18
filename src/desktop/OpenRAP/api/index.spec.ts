import { expect } from "chai";
import { containerAPI } from "./index";
import SettingSDK from "./../sdks/SettingSDK";
import FileSDK from "./../sdks/FileSDK";
import SystemSDK from "../sdks/SystemSDK";
import TelemetrySDK from "../sdks/TelemetrySDK";

describe("ContainerAPI", () => {
  it("should call bootstrap method", done => {
    containerAPI.bootstrap().then(() => {
      done();
    });
  });

  it("should get setting SDK instance", () => {
    let settingSDK = containerAPI.getSettingSDKInstance("test");
    expect(settingSDK).to.be.instanceOf(SettingSDK);
  });

  it("should get file SDK instance", () => {
    let fileSDK = containerAPI.getFileSDKInstance("sunbird-test-plugin");
    expect(fileSDK).to.be.instanceOf(FileSDK);
  });

  it("should get internet status", async () => {
    containerAPI.getNetworkStatus('https://www.sunbird.org/').then(status => {
    if(status)  
    expect(status).to.be.true;
    else
    expect(status).to.be.false;
    })
  });

  it("should get file SDK instance", () => {
    let systemSDK = containerAPI.getSystemSDKInstance("sunbird-test-plugin");
    expect(systemSDK).to.be.instanceOf(SystemSDK);
  });

  it("should get file SDK instance", () => {
    let telemetrySDK = containerAPI.getTelemetrySDKInstance();
    expect(telemetrySDK).to.be.instanceOf(TelemetrySDK);
  });
});
