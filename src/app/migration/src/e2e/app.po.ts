import { browser, by, element } from 'protractor';
/**
 * App page component
 */
export class AppPage {
  /**
 * Navigation method
 */
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('app-root h1')).getText();
  }
}
