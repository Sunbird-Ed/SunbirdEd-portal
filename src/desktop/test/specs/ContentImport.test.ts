import { ContentImport } from '../pages/ContentImport';
import { startApp } from '../hooks';
import { expect } from "chai";
import { config } from './../test.spec'

let app = null;
describe('#ContentImport', function () {
    this.timeout(100000)
    let contentImport: ContentImport;
    before(async () => {
        app = await startApp();
        contentImport = new ContentImport(app);
    });
    it('should play imported content', async() => {
        await contentImport.playContent()
        let contentName = await contentImport.getContentTitle()
        expect(contentName).to.be.equal(config.content.import.contentName)
    })
})