import { Component, OnInit, ViewChild, ElementRef, Renderer2, ChangeDetectorRef,  HostListener, AfterViewInit} from '@angular/core';
import { ResourceService, ConfigService } from '@sunbird/shared';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { IInteractEventEdata } from '@sunbird/telemetry';
import { combineLatest as observableCombineLatest, Subject } from 'rxjs';
import * as _ from 'lodash-es';
import {UserService, TenantService} from './../../services';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-footer',
  templateUrl: './main-footer.component.html'
})
export class MainFooterComponent implements OnInit, AfterViewInit {
  @ViewChild('footerFix') footerFix: ElementRef;
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
  showDownloadmanager: any;
  instance: string;
  bodyPaddingBottom: string;
  tenantFooter: any;
  defaultFooterConfig: any;
  public unsubscribe$ = new Subject<void>();
  constructor(resourceService: ResourceService, public router: Router, public activatedRoute: ActivatedRoute,
    public configService: ConfigService, private renderer: Renderer2, private cdr: ChangeDetectorRef, public userService: UserService,
      public tenantService: TenantService
    ) {
    this.resourceService = resourceService;
  }

  ngOnInit() {
    this.instance = _.upperCase(this.resourceService.instance);
    this.tenantService.tenantSettings$.subscribe((data) => {
      this.tenantFooter = data;
    });
    this.defaultFooterConfig = {
      helpCenterLink: '/help/getting-started/explore-' + _.lowerCase(this.instance) + '/index.html',
      helpDeskEmail: 'support@' + _.lowerCase(this.instance) + '-ncte.freshdesk.com'
    };
  }
 ngAfterViewInit() {
    this.footerAlign();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.footerAlign();
  }
  // footer dynamic height
  footerAlign() {
    const footerHeight = $('footer').outerHeight();
    const bodyHeight = $('body').outerHeight();

    if (window.innerWidth <= 767) {
      (document.querySelector('.download-mobile-app-logo') as HTMLElement).style.minHeight = 0 + 'px';
      (document.querySelector('.download-mobile-app') as HTMLElement).style.bottom = footerHeight + 'px';
    } else {
      (document.querySelector('.footer-fix') as HTMLElement).style.minHeight = bodyHeight - footerHeight + 'px';
      (document.querySelector('.download-mobile-app-logo') as HTMLElement).style.minHeight = footerHeight + 'px';
      (document.querySelector('.download-mobile-app') as HTMLElement).style.bottom = 0 + 'px';
    }
  }

  checkRouterPath() {
    this.showDownloadmanager = this.router.url.includes('/profile') || this.router.url.includes('/play/collection') ||
      this.router.url.includes('/play/content');
  }


  redirectToMobileApp() {
    const playstoreLink = _.get(this.tenantFooter, 'playstoreLink');
    if (playstoreLink) {
      // For iGot the URL is direclty taken; no UTM needed
      this.redirect(playstoreLink);
    } else {
      let applink = this.configService.appConfig.UrlLinks.downloadDikshaApp;
      const sendUtmParams = _.get(this.activatedRoute, 'firstChild.firstChild.snapshot.data.sendUtmParams');
      const utm_source = this.userService.slug ? `${this.instance}-${this.userService.slug}` : this.instance;
      if (sendUtmParams) {
        observableCombineLatest(this.activatedRoute.firstChild.firstChild.params, this.activatedRoute.queryParams,
          (params, queryParams) => {
            return { ...params, ...queryParams };
          }).subscribe((params) => {
            if (params.dialCode) {
              const source = params.source || 'search';
              applink = `${applink}&referrer=utm_source=${utm_source}&utm_medium=${source}&utm_campaign=dial&utm_term=${params.dialCode}`;
            } else {
              applink = `${applink}&referrer=utm_source=${utm_source}&utm_medium=get&utm_campaign=redirection`;
            }
            this.redirect(applink.replace(/\s+/g, ''));
          });
      } else {
        const path = this.router.url.split('/')[1];
        applink = `${applink}&referrer=utm_source=${utm_source}&utm_medium=${path}`;
        this.redirect(applink);
      }
    }
  }

  redirect(url) {
    window.location.href = url;
  }

  setTelemetryInteractEdata(type): IInteractEventEdata {
    return {
      id: type,
      type: 'click',
      pageid: _.get(this.activatedRoute, 'root.firstChild.snapshot.data.telemetry.pageid')
    };
  }
}
