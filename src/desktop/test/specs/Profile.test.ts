import { Profile } from '../pages/Profile';
import { startApp } from '../hooks';
import { expect } from "chai";
import { config } from '../test.spec'

let app = null;
describe('#Profile', function () {
    this.timeout(100000)
    let profile: Profile;
    before(async () => {
        app = await startApp();
        profile = new Profile(app);
    });
    it('should be able to edit location data', async() => {
        await profile.editLocation();
        const {state, district} = await profile.getEditedLocation();
        expect(state.toLowerCase()).to.be.equal(config.profile.location.state.toLowerCase())
        expect(district.toLowerCase()).to.be.equal(config.profile.location.district.toLowerCase())
    })

    it('should be able to edit framework data', async() => {
        await profile.editFramework();
        let {board, mediums, classes, subjects} = await profile.getEditedFramework()
        board.should.equal(config.profile.framework.board)
        expect(mediums).to.have.members(config.profile.framework.mediums)
        expect(classes).to.have.members(config.profile.framework.classes)
        expect(subjects).to.have.members(config.profile.framework.subjects)
    })


})