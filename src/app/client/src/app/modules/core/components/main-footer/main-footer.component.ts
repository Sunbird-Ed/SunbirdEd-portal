import { Component, OnInit, Input } from '@angular/core';
import { ResourceService, ConfigService } from '@sunbird/shared';
import { environment } from '@sunbird/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { IInteractEventEdata } from '@sunbird/telemetry';
import { combineLatest as observableCombineLatest } from 'rxjs';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-footer',
  templateUrl: './main-footer.component.html'
})
export class MainFooterComponent implements OnInit {
  /**
   * reference of resourceService service.
   */
  public resourceService: ResourceService;
  /*
  Date to show copyright year
  */
  date = new Date();
  /*
  Hide or show footer
  */
  showFooter = true;

  isOffline: boolean = environment.isOffline;
  instance: string;

  constructor(resourceService: ResourceService, public router: Router, public activatedRoute: ActivatedRoute,
    public configService: ConfigService) {
    this.resourceService = resourceService;
  }

  ngOnInit() {
    this.instance = _.upperCase(this.resourceService.instance);
  }

  redirectToDikshaApp () {
    let applink = this.configService.appConfig.UrlLinks.downloadDikshaApp;
    const sendUtmParams = _.get(this.activatedRoute, 'firstChild.firstChild.snapshot.data.sendUtmParams');
    if (sendUtmParams) {
      observableCombineLatest(this.activatedRoute.firstChild.firstChild.params, this.activatedRoute.queryParams,
      (params, queryParams) => {
        return { ...params, ...queryParams };
      }).subscribe((params) => {
        const slug = _.get(this.activatedRoute, 'snapshot.firstChild.firstChild.params.slug');
        const utm_source = slug ? `diksha-${slug}` : 'diksha';
        if (params.dialCode) {
          const source = params.source || 'search';
          applink = `${applink}&utm_source=${utm_source}&utm_medium=${source}&utm_campaign=dial&utm_term=${params.dialCode}`;
        } else {
          applink = `${applink}&utm_source=${utm_source}&utm_medium=get&utm_campaign=redirection`;
        }
        this.redirect(applink.replace(/\s+/g, ''));
      });
    } else {
      this.redirect(applink);
    }
  }

  redirect(url) {
    window.location.href = url;
    }

  setTelemetryInteractEdata(type): IInteractEventEdata {
    return {
      id: type,
      type: 'click',
      pageid: 'footer'
    };
  }

}
