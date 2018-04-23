import { ConfigService, ServerResponse } from '@sunbird/shared';
import { DataService } from '../data/data.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * This service returns the organization details.
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
   * Variable that holds tenant details.
   */
  tenantData: object;
  /**
   * This variable holds favicon details.
   */
  favicon: string;

  /**
   * The constructor
   * @param {HttpClient} http Reference of HttpClient.
   * @param {ConfigService} config Reference of ConfigService.
   */
  constructor(http: HttpClient, config: ConfigService) {
    super(http);
    this.config = config;
    this.baseUrl = this.config.urlConFig.URLS.TENANT_PREFIX;
  }

  /**
   * API call to gather organization details.
   * @param orgSlug Organization details passed from main-header component.
   */
  public getOrgDetails(orgSlug) {
    const option = {
      url: `${this.config.urlConFig.URLS.TENANT.INFO + '/'}${orgSlug}`
    };
    this.get(option).subscribe(data => {
      this.favicon = data.result.favicon;
      document.title = data.result.titleName || 'Sunbird';
      document.querySelector('link[rel*=\'icon\']').setAttribute('href', this.favicon || '/assets/common/images/favicon.ico');
      this.setTenantData(data.result);
    });
  }

  /**
   * A method to set tenant data.
   */

  public setTenantData(data) {
    this.tenantData = data;
  }

  /**
   * A method to get tenant data.
   */
  get getTenantData() {
    return this.tenantData;
  }
}


