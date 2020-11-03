import { Page } from "./page";
import { config } from '../test.spec'
export class ContentDownload extends Page { 

    searchBoxSelector: string = "//input[contains(@class, 'sbsearchbox__input')]"
    searchBtnSelector: string = "//div[contains(@class, 'sbsearchbox__input-action')]"
    contentCardTitleSelector: string = `//h4[text()='${config.content.download.contentName}']`
    downloadBtnSelector:string = "//span[text()='Download']/parent::button"
    popupYesBtn: string = '//button[normalize-space()="Yes"]'
    pauseBtn: string = `//button[normalize-space()='Pause']`
    resumeBtn: string = `//button[normalize-space()='Resume']`
    cancelBtn: string = "//button[normalize-space()='Cancel']"
    cancelYesBtn: string = '//button[normalize-space()="Yes"]'
    downloadCompleteSelector: string = `//div[@class='download-details-container cursor-pointer']//div//div[normalize-space()='${config.content.download.contentName}']`
    contentTitleSelector: string = `//div[@class='content-header__title font-weight-bold ellipsis text-left']`
    async download() {

        await this.input(this.searchBoxSelector, config.content.download.contentId)
        await this.click(this.searchBtnSelector)
        await this.waitForExist(this.contentCardTitleSelector)
        await this.click(this.contentCardTitleSelector)
        await this.click(this.downloadBtnSelector)
        await this.click(this.popupYesBtn)
        await this.waitForExist(this.pauseBtn)
        await this.click(this.pauseBtn).pause(5000)
        await this.click(this.resumeBtn)
        await this.waitForExist(this.cancelBtn)
        await this.click(this.cancelBtn)
        await this.waitForExist(this.cancelYesBtn)
        await this.click(this.cancelYesBtn).pause(1000)
        await this.click(this.contentCardTitleSelector)
        await this.click(this.downloadBtnSelector)
        await this.click(this.popupYesBtn)
        await this.waitForExist(this.downloadCompleteSelector, 600000)
        await this.click(this.downloadCompleteSelector)
        
    }
}