
import {filter} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, RouterStateSnapshot } from '@angular/router';
import { CacheService } from 'ng2-cache-service';
import * as _ from 'lodash';
interface UrlHistory {
  url: string;
  queryParams?: any;
}
@Injectable()
export class NavigationHelperService {
  // Workaround for issue https://github.com/angular/angular/issues/12889
  // Dependency injection creates new instance each time if used in router sub-modules
  static singletonInstance: NavigationHelperService;

  private _resourceCloseUrl: UrlHistory;
  /**
   * Stores workspaceCloseUrl
   */
  private _workspaceCloseUrl: UrlHistory;
  /**
   * Stores routing history
   */
  private _history: Array<UrlHistory> = [];
  /**
   * Name used to store previous url in session
   */
  private cacheServiceName = 'previousUrl';
  constructor(private router: Router, public activatedRoute: ActivatedRoute, public cacheService: CacheService) {
    if (!NavigationHelperService.singletonInstance) {
      NavigationHelperService.singletonInstance = this;
    }
    return NavigationHelperService.singletonInstance;
  }
  /**
   * Stores routing history
   * @memberof NavigationHelperService
   */
  private storeUrlHistory(): void {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((urlAfterRedirects: NavigationEnd) => {
      const queryParams = this.activatedRoute.root.children[this.activatedRoute.root.children.length - 1].snapshot.queryParams;
      const url = urlAfterRedirects.url.split('?')[0];
      let history: UrlHistory;
      if (_.isEmpty(queryParams)) {
        history = {url};
      } else {
        history = {url, queryParams};
      }
      const previousUrl = this._history.pop();
      if (previousUrl === undefined || (previousUrl && previousUrl.url === history.url )) {
        this._history.push(history);
      } else {
        this._history.push(previousUrl, history);
      }
    });
  }
  storeResourceCloseUrl() {
    this._resourceCloseUrl = this._history[this._history.length - 1];
  }
  storeWorkSpaceCloseUrl() {
    this._workspaceCloseUrl = this.history[this._history.length - 1];
  }
  public navigateToResource(defaultUrl: string = '/home') {
    if (this._resourceCloseUrl && this._resourceCloseUrl.url) {
      if (this._resourceCloseUrl.queryParams) {
        this.router.navigate([this._resourceCloseUrl.url], {queryParams: this._resourceCloseUrl.queryParams});
      } else {
        this.router.navigate([this._resourceCloseUrl.url]);
      }
    } else {
      this.router.navigate([defaultUrl]);
    }
  }

  public navigateToWorkSpace(defaultUrl: string = '/home') {
    if (this._workspaceCloseUrl && this._workspaceCloseUrl.url) {
      if (this._workspaceCloseUrl.queryParams) {
        this.router.navigate([this._workspaceCloseUrl.url], {queryParams: this._workspaceCloseUrl.queryParams});
        this._workspaceCloseUrl = undefined;
      } else {
        this.router.navigate([this._workspaceCloseUrl.url]);
        this._workspaceCloseUrl = undefined;
      }
    } else {
      this.router.navigate([defaultUrl]);
    }
  }
  /**
   * returns routing history
   */
  get history(): Array<UrlHistory> {
    return this._history;
  }
  /**
   * initialize storeUrlHistory function to store routing history.
   * Add callback function for window.onunload to store previous url.
   */
  initialize() {
    this.storeUrlHistory();
    window.onunload = () => {
      if (this.history[this._history.length - 2]) {
        this.cacheService.set(this.cacheServiceName, this.history[this._history.length - 2]);
      }
    };
  }
  /**
   * returns PreviousUrl
   * 1. First fetches from _history property.
   * 2. From session if _history is not present, for reload case.
   * 3. if both are not present then default home is returned.
   */
  public getPreviousUrl(): UrlHistory {
    const previousUrl = this.history[this._history.length - 2];
    const sessionUrl = this.cacheService.get(this.cacheServiceName);
    if (previousUrl) {
      return previousUrl;
    } else if (sessionUrl) {
      return sessionUrl;
    } else {
      return {url: '/home'};
    }
  }
  /**
   * Navigates to previous Url
   * 1. Goes to previous url, If Url and queryParams are present either from local property or session store.
   * 2. If not, then goes to default url provided.
   */
  public navigateToPreviousUrl(defaultUrl: string = '/home') {
    const previousUrl = this.getPreviousUrl();
    if (previousUrl.url === '/home') {
      this.router.navigate([defaultUrl]);
    } else {
      if (previousUrl.queryParams) {
        this.router.navigate([previousUrl.url], {queryParams: previousUrl.queryParams});
      } else {
        this.router.navigate([previousUrl.url]);
      }
    }
  }

}
