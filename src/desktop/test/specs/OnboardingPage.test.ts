import { OnboardingPage } from '../pages/OnboardingPage';
import { startApp, stopApp } from '../hooks';
import { expect } from "chai";
import { config } from './../test.spec'
let app = null;
describe('#Onboarding', function () {
    this.timeout(100000)
    let onBoardingPage: OnboardingPage;
    before(async () => {
        app = await startApp();
        onBoardingPage = new OnboardingPage(app);
        // await app.client.waitUntilWindowLoaded();
        
    });

    it('should show initial window',  () => {
        return app.client.getWindowCount().then(function (count) {
            count.should.equal(1)
        })
    })
    
    it('location', async () => {
        await onBoardingPage.selectState()
        await onBoardingPage.selectDistrict()
        await onBoardingPage.submitLocation()
    })

    it('framework', async () => {
        await onBoardingPage.selectBoard()
        await onBoardingPage.selectMedium()
        await onBoardingPage.selectClass()
        await onBoardingPage.submitFramework()
    })

    it('should verify location and framework on profile', async () => {
        await onBoardingPage.navigateToProfile()
        const state = await onBoardingPage.getText(onBoardingPage.profileState);
        const district = await onBoardingPage.getText(onBoardingPage.profileDistrict);
        state.should.equal(config.onBoarding.location.state)
        district.should.equal(config.onBoarding.location.district)
        let {board, mediums, classes} = await onBoardingPage.getSelectedFramework()
        board.should.equal(config.onBoarding.framework.board)
        expect(mediums).to.have.members(config.onBoarding.framework.mediums)
        expect(classes).to.have.members(config.onBoarding.framework.classes)
    })

});