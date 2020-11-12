import { ContentDelete } from '../pages/ContentDelete';
import { startApp } from '../hooks';
import { expect } from "chai";
import { config } from '../test.spec'

let app = null;
describe('#ContentDelete', function () {
    this.timeout(100000)
    let contentDelete: ContentDelete;
    before(async () => {
        app = await startApp();
        contentDelete = new ContentDelete(app);
    });
    it('should play and delete the content', async() => {
        await contentDelete.delete()
        expect(await contentDelete.getContentExists()).to.be.false;
    })
})