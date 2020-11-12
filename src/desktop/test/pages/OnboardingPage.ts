import { Page } from "./page";
import { config } from './../test.spec'
export class OnboardingPage extends Page {
   
    stateSelector: string = `//label[normalize-space()='Select State :']//preceding-sibling::select`
    districtSelector: string = `//label[normalize-space()='Select District :']//preceding-sibling::select`
    submitBtnSelector: string = `//button[normalize-space()='CONTINUE']`
    boardSelector: string = `//div[normalize-space()='Select board']/parent::sui-select` 
    boardOptionSelector: string = 'span'
    mediumSelector: string = `//label[normalize-space()='Medium']/preceding-sibling::app-custom-checkbox/sui-multi-select`
    mediumOptionSelector: string = `//sui-select-option/div[contains(text(),'{medium}')]`
    classSelector: string = `//label[normalize-space()='Class']/preceding-sibling::app-custom-checkbox/sui-multi-select`
    classOptionSelector: string = `//sui-select-option/div[contains(text(),'{class}')]`
    submitFrameworkBtnSelector: string = `//button[normalize-space()='SUBMIT']`

    telemetryLinkSelector: string = `//a[contains(@routerlink, 'telemetry')]`
    telemetrySyncOffSelector: string = `//input[@id='off']`

    profileIconSelector: string = `//a[contains(@class, 'profile-avtar')]`
    profileOptionSelector: string = `//div[@class='item cursor-pointer' and normalize-space()='Profile']`

    profileState: string = `//div[contains(normalize-space(), 'State')]/following-sibling::div[@class="fmedium ml-4"]`
    profileDistrict: string = `//div[contains(normalize-space(), 'District')]/following-sibling::div[@class="fmedium ml-4"]`

    profileBoard: string = `//span[contains(normalize-space(), 'Board')]/following-sibling::span`

    profileMedium: string = `//span[contains(normalize-space(), 'Medium')]/following-sibling::span`

    profileClasses: string = `//span[contains(normalize-space(), 'Classes')]/following-sibling::span`

    async selectState() {
       await this.select(this.stateSelector,  config.onBoarding.location.state)
       await this.waitForExist(this.districtSelector)
    }

    selectDistrict() {
        return this.select(this.districtSelector, config.onBoarding.location.district)
    }

    submitLocation() {
        return this.click(this.submitBtnSelector);
    }

    async selectBoard() {
        await this.click(this.boardSelector)
        await this.click(`${this.boardOptionSelector}*=${config.onBoarding.framework.board}`)
    }

    async selectMedium() {
        await this.click(this.mediumSelector)
        for (const medium of config.onBoarding.framework.mediums) {
            await this.click(this.mediumOptionSelector.replace(`{medium}`, medium))
        }        
        await this.click(this.mediumSelector)
    }

    async selectClass() {
        await this.click(this.classSelector)
        for (const className of config.onBoarding.framework.classes) {
            await this.click(this.classOptionSelector.replace(`{class}`, className))
        } 
        await this.click(this.classSelector)
    }

    submitFramework() {
        return this.click(this.submitFrameworkBtnSelector)
    }

   async navigateToProfile() {
        await this.click(this.profileIconSelector)
        // disable telemetry sync
        await this.click(this.telemetryLinkSelector)
        await this.click(this.telemetrySyncOffSelector)
        
        await this.click(this.profileIconSelector)
        await this.click(this.profileOptionSelector)
    }

    async getSelectedFramework() {
        const board = await this.getText(this.profileBoard)
        const mediums = []
        const mediumsCount = config.onBoarding.framework.mediums.length
        for(let i =0; i< mediumsCount; i++) {
            let medium = await this.getText(`${this.profileMedium}[${i + 1}]`)
            medium = medium.replace(',', '')
            mediums.push(medium)
        }

        const classes = []
        const classesCount = config.onBoarding.framework.classes.length
        for(let i =0; i< classesCount; i++) {
            let className = await this.getText(`${this.profileClasses}[${i + 1}]`)
            className = className.replace(',', '')
            classes.push(className)
        }

        return {
            board,
            mediums,
            classes
        }

    }
    
}