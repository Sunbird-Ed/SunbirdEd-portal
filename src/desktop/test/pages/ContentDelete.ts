import { Page } from "./page";
import { config } from '../test.spec'
export class ContentDelete extends Page { 

    logoSelector: string = `//div[@class="logo"]`
    contentCardTitleSelector: string = `//h4[text()='${config.content.delete.contentName}']`
    playBtnSelector:string = "//span[text()='Open']/parent::button"
    deleteBtnSelector: string = `//button[normalize-space()="Delete Book"]`
    allDownloadsSectionSelector: string = `//h3[normalize-space()='All downloads']`
    popUpDeleteBtn: string = `//button[@class="sb-btn sb-btn-normal sb-btn-primary" and normalize-space()="Delete"]`
    async delete() {
        await this.click(this.logoSelector)
        await this.waitForExist(this.contentCardTitleSelector)
        await this.click(this.contentCardTitleSelector)
        await this.click(this.playBtnSelector)
        await this.waitForExist(this.deleteBtnSelector)
        await this.click(this.deleteBtnSelector)
        await this.click(this.popUpDeleteBtn).pause(5000)
    }

    getContentExists() {
        return this.isExisting(this.contentCardTitleSelector)
    }

}