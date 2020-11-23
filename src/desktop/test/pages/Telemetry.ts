import { Page } from "./page";
import { config } from '../test.spec'
export class Telemetry extends Page { 

    profileIconSelector: string = `//a[contains(@class, 'profile-avtar')]`
    telemetryLinkSelector: string = `//a[contains(@routerlink, 'telemetry')]`
    syncTelemetryBtnSelector: string = `//button[contains(normalize-space(), 'Sync telemetry')]`
    shareTelemetryBtnSelector: string = `//button[contains(normalize-space(), 'Share Telemetry')]`
    async navigate() {
        await this.click(this.profileIconSelector)
        await this.click(this.telemetryLinkSelector)
    }

    isSyncButtonEnabled() {
        return this.isEnabled(this.syncTelemetryBtnSelector)
    }

    isShareButtonEnabled() {
        return this.isEnabled(this.shareTelemetryBtnSelector)
    }

   async sync() {
         await this.click(this.syncTelemetryBtnSelector)
         await this.waitForEnabled(this.syncTelemetryBtnSelector, 10000, true)
    }

}