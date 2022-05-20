import { Injectable } from '@angular/core';
/**
 * Service to fetch user details from server
 *
 */
@Injectable()
export class BrowserCacheTtlService {
  /**
   * Contains user id
   */
  private _browserCacheTtl = '600';
  constructor() {
    try {
      this._browserCacheTtl = document.getElementById('apiCacheTtl')?(<HTMLInputElement>document.getElementById('apiCacheTtl')).value:'';
    } catch (error) {
    }

  }

  /**
   * get method to fetch browserCacheTtl.
   */
  get browserCacheTtl(): number {
    return Number(this._browserCacheTtl);
  }

}

