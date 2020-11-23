import { ContentDownload } from './../pages/ContentDownload';
import { startApp, stopApp } from '../hooks';
import { expect } from "chai";
import { config } from '../test.spec'

let app = null;
describe('#ContentDownload', function () {
    this.timeout(1000000)
    let contentDownload: ContentDownload;
    before(async () => {
        app = await startApp();
        contentDownload = new ContentDownload(app);
        // dialogAddon.mock([{ method: 'showOpenDialog', value: { filePaths: ['faked.txt'] } }])
    });
    it('should download content', async() => {
        await contentDownload.download();
        let ContentName = await contentDownload.getText(contentDownload.contentTitleSelector)
        expect(ContentName).to.be.equal(config.content.download.contentName)
    })
})