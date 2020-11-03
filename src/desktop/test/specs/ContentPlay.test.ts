import { ContentPlay } from '../pages/ContentPlay';
import { startApp } from '../hooks';
import { expect } from "chai";
import { config } from '../test.spec'

let app = null;
describe('#ContentPlay', function () {
    this.timeout(100000)
    let contentPlay: ContentPlay;
    before(async () => {
        app = await startApp();
        contentPlay = new ContentPlay(app);
    });

    it('should navigate to the content page', async() => {
        await contentPlay.navigateToContent()
        expect(await contentPlay.getContentTitle()).to.be.equal(config.content.play.collectionName);
    })

    it('should show maximize and minimize content player', async () => {
        await contentPlay.play(config.content.play.resource[0])
        await contentPlay.maximize().pause(5000)
        expect(await contentPlay.isMaximized()).to.be.true;
        await contentPlay.minimize()
        expect(await contentPlay.isMaximized()).to.be.false;
        expect(await contentPlay.getCurrentResourceName()).to.be.equal(config.content.play.resource[0])
    })

    it('should play all the resources', async () =>  {
        for (const resource of config.content.play.resource) {
            await contentPlay.play(resource)
            expect(await contentPlay.getCurrentResourceName()).to.be.equal(resource)
        }
    })
})