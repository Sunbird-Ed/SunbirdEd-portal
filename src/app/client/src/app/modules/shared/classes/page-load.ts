export class PageLoadTime {

    public readonly start = Date.now();

    constructor() {
    }

    getPageLoadTime() {
       const loadTime = Date.now() - this.start;
       return loadTime;
    }

}
