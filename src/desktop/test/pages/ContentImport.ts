import { Page } from "./page";
import { config } from './../test.spec'
export class ContentImport extends Page { 

    importCompleteSelector: string = `//div[@class='download-details-container cursor-pointer']//div//div[normalize-space()='${config.content.import.file}']`
    contentTitleSelector: string = `//div[@class='content-header__title font-weight-bold ellipsis text-left']`
    async playContent() {
        await this.waitForExist(this.importCompleteSelector)
        await this.click(this.importCompleteSelector)
    }

    getContentTitle() {
        return this.getText(this.contentTitleSelector)
    }
}