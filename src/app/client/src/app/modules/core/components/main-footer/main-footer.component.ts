import { Component, OnInit, Input } from '@angular/core';
import { ResourceService, ConfigService } from '@sunbird/shared';
import { environment } from '@sunbird/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { IInteractEventEdata } from '@sunbird/telemetry';
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
    const sendUtmParams = _.get(this.activatedRoute, 'firstChild.firstChild.snapshot.data.sendDowndAppUtmParams');
    if (sendUtmParams) {
      this.activatedRoute.firstChild.firstChild.params.subscribe(params => {
        const slug = _.get(this.activatedRoute, 'snapshot.firstChild.firstChild.params.slug');
        const utm_source = slug ? `diksha-${slug}` : 'diksha';
        if (params.dialCode) {
          applink = `${applink}&utm_source=${utm_source}&utm_medium=search&utm_campaign=dial&utm_term=${params.dialCode}`;
        } else {
          applink = `${applink}&utm_source=${utm_source}&utm_medium=get&utm_campaign=redirection`;
        }
        window.location.href = applink.replace(/\s+/g, '');
      });
    } else {
      window.location.href = applink;
    }
  }

  setTelemetryInteractEdata(type): IInteractEventEdata {
    return {
      id: type,
      type: 'click',
      pageid: 'footer'
    };
  }

}
