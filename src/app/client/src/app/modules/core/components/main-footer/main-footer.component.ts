import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer2,
  ChangeDetectorRef,
  HostListener,
  AfterViewInit,
  Input,
  OnDestroy
} from '@angular/core';
import { ResourceService, ConfigService, LayoutService, COLUMN_TYPE, NavigationHelperService, UtilService } from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import { IInteractEventEdata } from '@sunbird/telemetry';
import { combineLatest as observableCombineLatest, Subject } from 'rxjs';
import * as _ from 'lodash-es';
import {UserService, TenantService} from './../../services';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-footer',
  templateUrl: './main-footer.component.html',
  styleUrls: ['./main-footer.component.scss']
})
export class MainFooterComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() layoutConfiguration;
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

  FIRST_PANEL_LAYOUT: string;
  SECOND_PANEL_LAYOUT: string;
  isFullScreenView;
  isDesktopApp = false;
  appBaseUrl: string;

  constructor(resourceService: ResourceService, public router: Router, public activatedRoute: ActivatedRoute,
    public configService: ConfigService, private renderer: Renderer2, private cdr: ChangeDetectorRef, public userService: UserService,
      public tenantService: TenantService, public layoutService: LayoutService,
      public navigationHelperService: NavigationHelperService, private utilService: UtilService
    ) {
    this.resourceService = resourceService;
  }

  ngOnInit() {
    this.initlayout();
    this.checkFullScreenView();
    this.isDesktopApp = this.utilService.isDesktopApp;

    if (this.isDesktopApp) {
      this.getBaseUrl();
    }

    this.instance = _.upperCase(this.resourceService.instance);
    this.tenantService.tenantSettings$.subscribe((data) => {
      this.tenantFooter = data;
    });
    this.defaultFooterConfig = {
      helpCenterLink: '/help/getting-started/explore-' + _.lowerCase(this.instance) + '/index.html',
      helpDeskEmail: 'support@' + _.lowerCase(this.instance) + '-ncte.freshdesk.com'
    };
  }

  getBaseUrl() {
    this.appBaseUrl = this.utilService.getAppBaseUrl();
  }

  checkFullScreenView() {
    this.navigationHelperService.contentFullScreenEvent.pipe(takeUntil(this.unsubscribe$)).subscribe(isFullScreen => {
      this.isFullScreenView = isFullScreen;
    });
  }

  initlayout() {
    this.redoLayout();
  }

 ngAfterViewInit() {
    // this.footerAlign();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    // this.footerAlign();
  }

  setTelemetryInteractEdata(type): IInteractEventEdata {
    return {
      id: type,
      type: 'click',
      pageid: _.get(this.activatedRoute, 'root.firstChild.snapshot.data.telemetry.pageid')
    };
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

  redoLayout() {
    if (this.layoutConfiguration != null) {
      this.FIRST_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(0, this.layoutConfiguration, COLUMN_TYPE.threeToNine);
      this.SECOND_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(1, this.layoutConfiguration, COLUMN_TYPE.threeToNine);
    } else {
      this.FIRST_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(0, null, COLUMN_TYPE.fullLayout);
      this.SECOND_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(1, null, COLUMN_TYPE.fullLayout);
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
      let applink = this.configService.appConfig.UrlLinks.downloadSunbirdApp;
      const sendUtmParams = _.get(this.activatedRoute, 'firstChild.firstChild.snapshot.data.sendUtmParams');
      const utm_source = this.userService.slug ? `${this.instance}-${this.userService.slug}` : this.instance;
      if (sendUtmParams) {
        observableCombineLatest(this.activatedRoute.firstChild.firstChild.params, this.activatedRoute.queryParams,
          (params, queryParams) => {
            return { ...params, ...queryParams };
          }).subscribe((params) => {
            this.redirect(applink.replace(/\s+/g, ''));
          });
      } else {
        const path = this.router.url.split('/')[1];
        this.redirect(applink);
      }
    }
  }

  redirect(url) {
    if (this.isDesktopApp) {
      window.open(url, '_blank');
    } else {
      window.location.href = url;
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
