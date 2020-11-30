export class Page {


    constructor(public app) {
    }
    click(selector) {
       return this.app.client.click(selector).pause(2000);
    }

    waitUntilTextExists(selector, text, seconds=5000) {
       return this.app.client.waitUntilTextExists(selector, text, seconds);
    }

    waitForExist = function(selector, timeout = 10000, reverse = false) {
        return this.app.client.waitForExist(selector, timeout, reverse)
    }

    select(selector, value) {
        if(typeof value === 'number') {
            return this.app.client.element(selector).selectByIndex(value).pause(1000);
        } else {
            return this.app.client.element(selector).selectByVisibleText(value).pause(1000);
        }
        
    }

    getText(selector) {
        return this.app.client.element(selector).getText();
    }

    input(selector, text: string) {
        return this.app.client.setValue(selector, text)
    }

    getLocation(selector) {
        return this.app.client.getLocation(selector)
    }

    scrollToElement(selector) {
        return this.app.client.selectorExecute([selector], function(ele) {
             ele[0].scrollIntoView()
        })
    }

    isExisting(selector) {
        return this.app.client.isExisting(selector)
    }

    scroll(selector) {
        return this.app.client.scroll(selector)
    }

    isEnabled(selector) {
        return this.app.client.isEnabled(selector)
    }

    waitForEnabled(selector, timeout=10000, reverse=false) {
        return this.app.client.waitForEnabled(selector, timeout, reverse)
    }

}