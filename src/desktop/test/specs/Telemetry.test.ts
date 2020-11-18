import { Telemetry } from '../pages/Telemetry';
import { startApp } from '../hooks';
import { expect } from "chai";
import { config } from '../test.spec'

let app = null;
describe.skip('#Telemetry', function () {
    this.timeout(100000)
    let telemetry: Telemetry;
    before(async () => {
        app = await startApp();
        telemetry = new Telemetry(app);
    });
    it('should navigate to telemetry page', async() => {
        await telemetry.navigate()
        expect(await telemetry.isSyncButtonEnabled()).to.be.true;
        expect(await telemetry.isShareButtonEnabled()).to.be.true;
    })

    it('should sync telemetry', async () => {
        await telemetry.sync()
        expect(await telemetry.isSyncButtonEnabled()).to.be.false;
        expect(await telemetry.isShareButtonEnabled()).to.be.false;
    })
})