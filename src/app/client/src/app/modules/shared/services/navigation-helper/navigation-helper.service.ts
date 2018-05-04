import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CacheService } from 'ng2-cache-service';
@Injectable()
export class NavigationHelperService {
  /**
   * Stores routing history
   */
  private _history = [];
  /**
   * Name used to store previous url in session
   */
  private cacheServiceName = 'previousUrl';
  constructor(private router: Router, public cacheService: CacheService) {
  }
  /**
   * Stores routing history
   * @memberof NavigationHelperService
   */
  public storeUrlHistory(): void {
    this.router.events.filter(event => event instanceof NavigationEnd).subscribe((urlAfterRedirects: NavigationEnd) => {
      this._history = [...this._history, urlAfterRedirects.url];
    });
  }
  /**
   * returns routing history
   */
  get history(): string[] {
    return this._history;
  }
  /**
   * initialize storeUrlHistory function to store routing history.
   * Add callback function for window.onunload to store previous url.
   */
  initialize() {
    this.storeUrlHistory();
    window.onunload = () => {
      this.cacheService.set(this.cacheServiceName, this.history[this._history.length - 1]);
    };
  }
  /**
   * returns PreviousUrl
   * 1. First fetches from _history property.
   * 2. From session if _history is not present, for reload case.
   * 3. if both are not present then default home is returned.
   */
  public getPreviousUrl(): string {
    const previousUrl = this.history[this._history.length - 2];
    const sessionUrl = this.cacheService.get(this.cacheServiceName);
    if (previousUrl) {
      console.log('returning previousUrl:', previousUrl);
      return previousUrl;
    } else if (sessionUrl) {
      console.log('returning sessionPreviousUrl:', sessionUrl);
      return sessionUrl;
    } else {
      console.log('returning defaultUrl:', '/home');
      return '/home';
    }
  }

}
