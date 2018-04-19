import { ConfigService } from '@sunbird/shared';
import { DataService } from '../data/data.service';
import { UserService } from '../user/user.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * This service returns the organizaation details.
 */

@Injectable()
export class TenantService extends DataService {
  /**
   * reference of http.
   */
  http: HttpClient;
  /**
   * reference of config service.
   */
  config: ConfigService;
  /**
   * reference of user service.
   */
  userService: UserService;

  /**
   * The constructor
   * @param {UserService} userService Reference of UserService.
   * @param {HttpClient} http Reference of HttpClient.
   * @param {ConfigService} config Reference of ConfigService.
   */
  constructor(userService: UserService, http: HttpClient, config: ConfigService) {
    super(http);
    this.config = config;
    this.baseUrl = this.config.urlConFig.URLS.TENANT_PREFIX;
    this.userService = userService;
  }

  /**
   * API call to gather organization details.
   * @param orgSlug Organization details passed from main-header component.
   */
  public getOrgDetails(orgSlug) {
    const option = {
      url: `${this.config.urlConFig.URLS.TENANT.INFO + '/'}${orgSlug}`
    };
    return this.get(option);
  }
}


