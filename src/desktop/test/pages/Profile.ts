import { Page } from "./page";
import { config } from '../test.spec'
export class Profile extends Page { 

  
    profileIconSelector: string = `//a[contains(@class, 'profile-avtar')]`
    profileOptionSelector: string = `//div[@class='item cursor-pointer' and normalize-space()='Profile']`

    locationEditSelector: string = `//button[contains(@class, 'location_button') and normalize-space()='Edit']`
    stateSelectSelector: string = `//label[normalize-space()='State :']//preceding-sibling::select`
    districtSelectSelector: string = `//label[normalize-space()='District :']//preceding-sibling::select`
    submitSelector: string = `//button[@type='submit' and normalize-space()='Submit']`

    profileState: string = `//div[contains(normalize-space(), 'State')]/following-sibling::div[@class="fmedium ml-4"]`
    profileDistrict: string = `//div[contains(normalize-space(), 'District')]/following-sibling::div[@class="fmedium ml-4"]`

    frameworkEditSelector: string = `//button[contains(@class, 'button_content_preferences') and normalize-space()='Edit']`
    boardSelectSelector: string = `//sui-select[@formcontrolname='board']`
    boardOptionSelector: string = `//sui-select-option//span[normalize-space()='{board}']`
    mediumSelector: string = `//label[normalize-space()='Medium :']/following-sibling::div`
    mediumOptionSelector: string = `//label[normalize-space()='Medium :']/following-sibling::div/app-custom-checkbox/sui-multi-select/div/sui-select-option/div[normalize-space()='{medium}']`;
    classSelector: string = `//label[normalize-space()='Classes :']/following-sibling::div`;
    classOptionSelector: string = `//label[normalize-space()='Classes :']/following-sibling::div/app-custom-checkbox/sui-multi-select/div/sui-select-option/div[normalize-space()='{class}']`;
    subjectSelector: string = `//label[normalize-space()='Subjects :']/following-sibling::div`
    subjectOptionSelector: string = `//label[normalize-space()='Subjects :']/following-sibling::div/app-custom-checkbox/sui-multi-select/div/sui-select-option/div[normalize-space()='{subject}']`

    profileBoard: string = `//span[contains(normalize-space(), 'Board')]/following-sibling::span`
    profileMedium: string = `//span[contains(normalize-space(), 'Medium')]/following-sibling::span`
    profileClasses: string = `//span[contains(normalize-space(), 'Classes')]/following-sibling::span`
    profileSubjects: string = `//span[contains(normalize-space(), 'Subjects')]/following-sibling::span`
    

    async editLocation() {
        await this.click(this.profileIconSelector)
        await this.click(this.profileOptionSelector)
        await this.waitForExist(this.locationEditSelector)
        await this.click(this.locationEditSelector)
        await this.select(this.stateSelectSelector,  config.profile.location.state)
        await this.waitForExist(this.districtSelectSelector)
        await this.select(this.districtSelectSelector,  config.profile.location.district)
        await this.click(this.submitSelector)
    }

    async getEditedLocation() {
        const state = await this.getText(this.profileState)
        const district = await this.getText(this.profileDistrict)
        return {state, district}
    }

   async editFramework() {
        await this.click(this.frameworkEditSelector)
        await this.waitForExist(this.boardSelectSelector)
        await this.click(this.boardSelectSelector)
        await this.click(this.boardOptionSelector.replace(`{board}`, config.profile.framework.board))
        
        await this.waitForExist(this.mediumSelector)
        await this.click(this.mediumSelector)
        for (const medium of config.profile.framework.mediums) {
            await this.click(this.mediumOptionSelector.replace(`{medium}`, medium))
        }        
        await this.click(this.mediumSelector)

        await this.waitForExist(this.classSelector)
        await this.click(this.classSelector)
        for (const className of config.profile.framework.classes) {
            await this.click(this.classOptionSelector.replace(`{class}`, className))
        } 
        await this.click(this.classSelector)

        await this.waitForExist(this.subjectSelector)
        await this.click(this.subjectSelector)
        for (const subject of config.profile.framework.subjects) {
            await this.click(this.subjectOptionSelector.replace(`{subject}`, subject))
        } 
        await this.click(this.subjectSelector)
        await this.click(this.submitSelector)
    }

    async getEditedFramework() {
        const board = await this.getText(this.profileBoard)
        const mediums = []
        const mediumsCount = config.profile.framework.mediums.length
        for(let i =0; i< mediumsCount; i++) {
            let medium = await this.getText(`${this.profileMedium}[${i + 1}]`)
            medium = medium.replace(',', '')
            mediums.push(medium)
        }

        const classes = []
        const classesCount = config.profile.framework.classes.length
        for(let i =0; i< classesCount; i++) {
            let className = await this.getText(`${this.profileClasses}[${i + 1}]`)
            className = className.replace(',', '')
            classes.push(className)
        }

        const subjects = []
        const subjectsCount = config.profile.framework.subjects.length
        for(let i =0; i< subjectsCount; i++) {
            let subject = await this.getText(`${this.profileSubjects}[${i + 1}]`)
            subject = subject.replace(',', '').trim()
            subjects.push(subject)
        }
        return {
            board,
            mediums,
            classes,
            subjects
        }
    }

}