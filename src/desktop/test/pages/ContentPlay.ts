import { Page } from "./page";
import { config } from '../test.spec'
export class ContentPlay extends Page {

    logoSelector: string = `//div[@class="logo"]`
    contentCardTitleSelector: string = `//h4[text()='${config.content.play.collectionName}']`
    playBtnSelector:string = "//span[text()='Open']/parent::button"
    contentTitleSelector: string = `//div[@class='content-header__title font-weight-bold ellipsis text-left']`
    contentResourceSelector: string = `//sb-toc-card/div/h4[normalize-space()='{name}']`
    fullScreenBtnSelector: string = `//span[normalize-space()='Full screen']/parent::button`
    closeFullScreenBtnSelector: string = `//div[@class="video-close-btn ng-star-inserted"]`
    resourceTitleSelector: string = `//div[@class='content-video__player__title ellipsis text-left']`
    contentManagerSelector: string = `//span[normalize-space()='Content Manager']`
    async navigateToContent() {
        await this.click(this.logoSelector)
        await this.click(this.contentManagerSelector)
        await this.waitForExist(this.contentCardTitleSelector)
        await this.click(this.contentCardTitleSelector)
        await this.click(this.playBtnSelector)
    }

   async play(name: string) {
        const selector = this.contentResourceSelector.replace(`{name}`, name)
        await this.scrollToElement(selector)
        await this.click(selector).pause(3000)
    }

    maximize() {
        return this.click(this.fullScreenBtnSelector)
    }

    isMaximized() {
        return this.isExisting(this.closeFullScreenBtnSelector)
    }

    async minimize() {
        return this.click(this.closeFullScreenBtnSelector)
    }   

    getContentTitle() {
        return this.getText(this.contentTitleSelector)
    }

    async getCurrentResourceName() {
        let name =  await this.getText(this.resourceTitleSelector)
        name = name.trim()
        return name;
    }
}