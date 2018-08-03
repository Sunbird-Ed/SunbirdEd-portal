import { Injectable } from '@angular/core';
import { ConfigService, ServerResponse, IUserProfile, IUserData, IAppIdEnv } from '@sunbird/shared';
import { HttpClient } from '@angular/common/http';
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
      this._browserCacheTtl = (<HTMLInputElement>document.getElementById('apiCacheTtl')).value;
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

