import { Component, OnInit, ViewChild, ElementRef, Renderer2, ChangeDetectorRef,  HostListener, AfterViewInit} from '@angular/core';
import { ResourceService, ConfigService } from '@sunbird/shared';
import { environment } from '@sunbird/environment';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { IInteractEventEdata } from '@sunbird/telemetry';
import { combineLatest as observableCombineLatest } from 'rxjs';
import * as _ from 'lodash-es';
import {UserService} from './../../services';
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
  isOffline: boolean = environment.isOffline;
  instance: string;
  bodyPaddingBottom: string;
  constructor(resourceService: ResourceService, public router: Router, public activatedRoute: ActivatedRoute,
    public configService: ConfigService, private renderer: Renderer2, private cdr: ChangeDetectorRef, public userService: UserService
    ) {
    this.resourceService = resourceService;
  }

  ngOnInit() {
    this.instance = _.upperCase(this.resourceService.instance);
  }
 ngAfterViewInit() {
    this.footerAlign();
  }
 @HostListener('window:resize', ['$event'])
  onResize(event) {
    console.log('event', event);
    this.footerAlign();
  }
// footer dynamic height
footerAlign() {
    $('.footerfix').css('height', 'auto');
    const footerHeight = $('footer').outerHeight();
    $('.footerfix').css('height', footerHeight);
    if (window.innerWidth <= 767) {
      (document.querySelector('.download-mobile-app') as HTMLElement).style.minHeight = 0 + 'px';
      (document.querySelector('.download-mobile-app') as HTMLElement).style.bottom = footerHeight + 'px';
      (document.querySelector('body') as HTMLElement).style.paddingBottom = footerHeight + 178 + 'px';
    } else {
      (document.querySelector('.download-mobile-app') as HTMLElement).style.minHeight = 200 + 'px';
      (document.querySelector('.download-mobile-app') as HTMLElement).style.bottom = 0 + 'px';
      (document.querySelector('body') as HTMLElement).style.paddingBottom = footerHeight + 67 + 'px';
    }
  }
  checkRouterPath() {
    this.showDownloadmanager = this.router.url.includes('/profile') || this.router.url.includes('/play/collection') ||
      this.router.url.includes('/play/content');
  }


  redirectToDikshaApp() {
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
