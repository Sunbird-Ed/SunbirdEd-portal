import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { combineLatest as observableCombineLatest, of } from 'rxjs';
import { ResourceService, ToasterService, ConfigService, UtilService, NavigationHelperService, LayoutService} from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import { SearchService, PlayerService, CoursesService, UserService } from '@sunbird/core';
import { PublicPlayerService } from '@sunbird/public';
import * as _ from 'lodash-es';
import { IInteractEventEdata, IImpressionEventInput, TelemetryService } from '@sunbird/telemetry';
import {mergeMap, tap, retry, catchError, map, finalize, debounceTime, takeUntil} from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DialCodeService } from '../../services/dial-code/dial-code.service';
import { CslFrameworkService } from '../../../public/services/csl-framework/csl-framework.service';

@Component({
  selector: 'app-dial-code',
  templateUrl: './dial-code.component.html',
  styleUrls: ['./dial-code.component.scss']
})
export class DialCodeComponent implements OnInit, OnDestroy {
  public inviewLogs: any = [];
  /**
	 * telemetryImpression
	*/
  public telemetryImpression: IImpressionEventInput;
  public dialResultImpression: IImpressionEventInput;
  /**
   * Initializing the infinite scroller
   */
  public itemsToDisplay: any = [];
  public itemsToLoad = 50;
  public throttle = 50;
  public numOfItemsToAddOnScroll = 20;
  public scrollDistance = 2;
  public dialCode;
  public showLoader = true;
  public loaderMessage: any;
  public searchResults: Array<any> = [];
  public unsubscribe$ = new Subject<void>();
  public telemetryCdata: Array<{}> = [];
  public backInteractEdata: IInteractEventEdata;
  public selectChapterTelemetryCdata: Array<{}> = [];
  public selectChapterInteractEdata: IInteractEventEdata;
  public showMobilePopup = false;
  public isRedirectToSunbirdApp = false;
  public closeMobilePopupInteractData: any;
  public appMobileDownloadInteractData: any;
  public dialSearchSource: string;
  public showBatchInfo = false;
  public selectedCourseBatches: any;
  public singleContentRedirect = '';
  public numberOfSections = new Array(this.configService.appConfig.DIAL_CODE.PAGE_LIMIT);
  showExportLoader = false;
  contentName: string;
  instance: string;
  redirectCollectionUrl: string;
  redirectContentUrl: string;
  redirectQuestionsetUrl: string;
  showDownloadLoader = false;
  isBrowse = false;
  showSelectChapter = false;
  chapterName: string;
  dialContentId: string;
  textbookList = [];
  courseList = [];
  isTextbookDetailsPage = false;
  layoutConfiguration: any;
  public categoryKeys;

  constructor(public resourceService: ResourceService, public userService: UserService,
    public coursesService: CoursesService, public router: Router, public activatedRoute: ActivatedRoute,
    public searchService: SearchService, public toasterService: ToasterService, public configService: ConfigService,
    public utilService: UtilService, public navigationHelperService: NavigationHelperService,
    public playerService: PlayerService, public telemetryService: TelemetryService,
    public publicPlayerService: PublicPlayerService, private dialCodeService: DialCodeService, public cslFrameworkService: CslFrameworkService,
    public layoutService: LayoutService) {
  }

  ngOnInit() {
    this.initLayout();
    this.categoryKeys = this.cslFrameworkService.transformDataForCC();
    observableCombineLatest(this.activatedRoute.params, this.activatedRoute.queryParams,
      (params, queryParams) => {
        return { ...params, ...queryParams };
      }).pipe(
        debounceTime(10),
        tap(this.initialize),
        mergeMap(params => _.get(params, 'textbook') ? this.processTextBook(params) : this.processDialCode(params)),
      ).subscribe(res => {
        const linkedContents = _.flatMap(_.values(res));
        const { constantData, metaData, dynamicFields } = this.configService.appConfig.GetPage;
        this.searchResults = this.utilService.getDataForCard(linkedContents, constantData, dynamicFields, metaData);
        if (_.get(this.searchResults[0], 'contentType') === 'TextBook') {
          sessionStorage.setItem('l1parent', this.searchResults[0].identifier);
        }
        this.appendItems(0, this.itemsToLoad);
        if (this.searchResults.length === 1) {
          if (_.get(this.searchResults[0], 'metaData.mimeType') === 'application/vnd.ekstep.content-collection' ||
            !sessionStorage.getItem('singleContentRedirect')) {
            this.singleContentRedirect = this.searchResults[0]['name'];
            if (this.searchResults[0].contentType.toLowerCase() !== 'course') {
              this.getEvent({
                data: this.searchResults[0]
              });
            }
          }
        }
        this.showLoader = false;
        const telemetryInteractEdata = {
          id: 'content-explode',
          type: 'view',
          subtype: 'post-populate'
        };
        if (_.get(res, 'collection.length') > 1) {
          telemetryInteractEdata.id = 'content-collection';
        }
        if (this.searchResults.length !== 1) {
          this.logInteractEvent(telemetryInteractEdata);
        }
      }, err => {
        this.showLoader = false;
        this.toasterService.error(this.resourceService.messages.fmsg.m0049);
      }, () => {
        this.showLoader = false;
      });
  }

  initLayout() {
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.layoutService.switchableLayout().pipe(takeUntil(this.unsubscribe$)).subscribe(layoutConfig => {
      if (layoutConfig != null) {
        this.layoutConfiguration = layoutConfig.layout;
      }
    });
  }

  private initialize = (params) => {
    EkTelemetry.config.batchsize = 2;
    this.isBrowse = Boolean(this.router.url.includes('browse'));
    this.dialSearchSource = _.get(params, 'source') || 'search';
    this.isTextbookDetailsPage = !!_.get(params, 'textbook');
    this.itemsToDisplay = [];
    this.searchResults = [];
    this.dialCode = _.get(params, 'dialCode');
    this.showLoader = true;
    this.instance = _.upperCase(_.get(this.resourceService, 'instance'));
    this.handleMobilePopupBanner();
    this.setTelemetryData();
    this.inview({ inview: [] })
  }

  private processDialCode(params) {
    return of(params).pipe(
      finalize(() => {
        this.logInteractEvent({
          id: 'search-dial-init',
          type: 'view',
          subtype: 'auto',
        });
      }),
      mergeMap(param => this.dialCodeService.searchDialCodeAssemble(_.get(param, 'dialCode'), this.isBrowse)
        .pipe(
          tap(value => {
            this.logInteractEvent({
              id: 'search-dial-success',
              type: 'view',
              subtype: 'auto',
            });
            this.logTelemetryEvents(true);
          }, err => {
            this.logInteractEvent({
              id: 'search-dial-failed',
              type: 'view',
              subtype: 'auto',
            });
            this.logTelemetryEvents(false);
          }),
          retry(1),
          catchError(error => {
            return of({
              content: [],
              collections: []
            });
          }),
          mergeMap(this.dialCodeService.filterDialSearchResults),
          tap((res) => {
            this.showSelectChapter = false;
          })
        ))
    );
  }
  private processTextBook(params) {
    const textBookUnit = _.get(params, 'textbook');
    const content = _.find(_.get(this.dialCodeService, 'dialCodeResult.contents'), contentObj => {
      return (_.get(contentObj, 'identifier') === textBookUnit);
    });
    if (content) {
      if (_.toLower(_.get(content, 'contentType')) === 'textbook') {
        this.chapterName = _.get(content, 'name');
        this.dialContentId = _.get(content, 'identifier');
        this.showSelectChapter = true;
      }
      return this.dialCodeService.getAllPlayableContent([textBookUnit]).pipe(
        map(contents => {
          return { contents };
        })
      );
    } else {
      this.router.navigate(['/get/dial', _.get(this.activatedRoute, 'snapshot.params.dialCode')]);
      return of([]);
    }
  }
  onScrollDown() {
    const startIndex = this.itemsToLoad;
    this.itemsToLoad = this.itemsToLoad + this.numOfItemsToAddOnScroll;
    this.appendItems(startIndex, this.itemsToLoad);
  }

  appendItems(startIndex, endIndex) {
    this.itemsToDisplay.push(...this.searchResults.slice(startIndex, endIndex));
    this.courseList = this.itemsToDisplay.filter(item => item.contentType.toLowerCase() === 'course');
    this.textbookList = this.itemsToDisplay.filter(item => item.contentType.toLowerCase() !== 'course');
  }

  public playCourse({ section, data }) {
    const metaData = data;
    if (this.userService.loggedIn) {
      this.coursesService.getEnrolledCourses().subscribe(() => {
        const { onGoingBatchCount, expiredBatchCount, openBatch, inviteOnlyBatch } =
          this.coursesService.findEnrolledCourses(metaData.identifier);
        if (!expiredBatchCount && !onGoingBatchCount) { // go to course preview page, if no enrolled batch present
          return this.playerService.playContent(metaData);
        }
        if (onGoingBatchCount === 1) { // play course if only one open batch is present
          metaData.batchId = openBatch.ongoing.length ? openBatch.ongoing[0].batchId : inviteOnlyBatch.ongoing[0].batchId;
          return this.playerService.playContent(metaData);
        }
        this.selectedCourseBatches = { onGoingBatchCount, expiredBatchCount, openBatch, inviteOnlyBatch, courseId: metaData.identifier };
        this.showBatchInfo = true;
      }, error => {
        this.publicPlayerService.playContent(metaData);
      });
    } else {
      this.publicPlayerService.playContent(metaData);
    }
  }

  public getEvent(event) {

    this.redirectCollectionUrl = 'play/collection';
    this.redirectContentUrl = 'play/content';
    this.redirectQuestionsetUrl = 'play/questionset';

    if (event.data.metaData.mimeType === this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.collection) {
      if (_.get(event, 'data.metaData.childTextbookUnit') || _.toLower(_.get(event, 'data.contentType') === 'textbook')) {
        this.router.navigate([], {
          relativeTo: this.activatedRoute,
          queryParams: {
            l1Parent: event.data.metaData.l1Parent,
            textbook: _.get(event, 'data.metaData.childTextbookUnit.identifier') || _.get(event, 'data.metaData.identifier')
          }
        });
      } else {
        this.router.navigate([this.redirectCollectionUrl, event.data.metaData.identifier],
          { queryParams: { dialCode: this.dialCode, l1Parent: event.data.metaData.l1Parent } });
      }
    } else if (event.data.metaData.mimeType === this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.questionset) {
      this.router.navigate([this.redirectQuestionsetUrl, event.data.metaData.identifier],
        { queryParams: { dialCode: this.dialCode, l1Parent: sessionStorage.getItem('l1parent') || event.data.metaData.l1Parent },
          state: { 'isSingleContent': this.searchResults.length > 1 ? false : true} });
    } else {
      this.router.navigate([this.redirectContentUrl, event.data.metaData.identifier],
        { queryParams: { dialCode: this.dialCode, l1Parent: sessionStorage.getItem('l1parent') || event.data.metaData.l1Parent },
          state: { 'isSingleContent': this.searchResults.length > 1 ? false : true} });
    }
  }

  inview(event) {
    _.forEach(event.inview, (inview, key) => {
      const obj = _.find(this.inviewLogs, (o) => {
        return o.objid === inview.data.metaData.identifier;
      });
      if (obj === undefined) {
        this.inviewLogs.push({
          objid: inview.data.metaData.identifier,
          objtype: inview.data.metaData.contentType || 'content',
          index: inview.id
        });
      }
    });
    this.telemetryImpression.edata.visits = this.inviewLogs;
    this.telemetryImpression.edata.pageid = this.activatedRoute.snapshot.data.telemetry.pageid;
    this.telemetryImpression.edata.subtype = 'pageexit';
    this.telemetryImpression = Object.assign({}, this.telemetryImpression);
  }
  closeMobileAppPopup() {
    if (localStorage) {
      localStorage.setItem('showMobilePopUp', 'true');
    }
    if (!this.isRedirectToSunbirdApp) {
      this.telemetryService.interact(this.closeMobilePopupInteractData);
      (document.querySelector('.mobile-app-popup') as HTMLElement).style.bottom = '-999px';
      (document.querySelector('.mobile-popup-dimmer') as HTMLElement).style.display = 'none';
    }
  }
  redirectToSunbirdApp() {
    this.isRedirectToSunbirdApp = true;
    this.telemetryService.interact(this.appMobileDownloadInteractData);
    let applink = this.configService.appConfig.UrlLinks.downloadDikshaApp;
    const utm_source = this.userService.slug ? `diksha-${this.userService.slug}` : 'diksha';
    applink = `${applink}&utm_source=${utm_source}&utm_medium=${this.dialSearchSource}&utm_campaign=dial&utm_term=${this.dialCode}`;
    window.location.href = applink.replace(/\s+/g, '');
  }
  setTelemetryData() {
    if (this.dialCode) {
      this.telemetryCdata = [{ 'type': 'DialCode', 'id': this.dialCode }];
    }
    this.closeMobilePopupInteractData = {
      context: {
        cdata: this.telemetryCdata,
        env: this.activatedRoute.snapshot.data.telemetry.env,
      },
      edata: {
        id: 'mobile-popup-close',
        type: 'click',
        pageid: 'get-dial'
      }
    };

    this.backInteractEdata = {
      id: 'dialpage-back',
      type: 'click',
      pageid: 'get-dial',
    };

    this.selectChapterInteractEdata = {
      id: 'select-chapter-button',
      type: 'click',
      pageid: 'get-dial'
    };

    this.selectChapterTelemetryCdata = [
      { 'type': 'DialCode', 'id': this.dialCode },
      { 'id': 'scan:result:collection:list', 'type': 'Feature' },
      { 'id': 'SB-15628', 'type': 'Task' }];

    this.appMobileDownloadInteractData = {
      context: {
        cdata: this.telemetryCdata,
        env: this.activatedRoute.snapshot.data.telemetry.env,
      },
      edata: {
        id: 'app-download-mobile',
        type: 'click',
        pageid: 'get-dial'
      }
    };
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env,
        cdata: [{
          type: 'DialCode',
          id: this.activatedRoute.snapshot.params.dialCode
        }]
      },
      object: {
        id: this.activatedRoute.snapshot.params.dialCode,
        type: 'DialCode',
        ver: '1.0'
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: `${this.activatedRoute.snapshot.data.telemetry.pageid}`,
        uri: this.userService.slug ? '/' + this.userService.slug + this.router.url : this.router.url,
        subtype: _.get(this.activatedRoute, 'snapshot.data.telemetry.subtype'),
        duration: this.navigationHelperService.getPageLoadTime()
      }
    };
  }
  ngOnDestroy() {
    sessionStorage.removeItem('singleContentRedirect');
    EkTelemetry.config.batchsize = 10;
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  handleMobilePopupBanner() {
    setTimeout(() => {
      if (localStorage && !localStorage.getItem('showMobilePopUp')) {
        this.showMobilePopup = true;
      }
    }, 500);
  }
  updateCardData(downloadListdata) {
    _.each(this.itemsToDisplay, (contents) => {
      this.publicPlayerService.updateDownloadStatus(downloadListdata, contents);
    });
  }
  logTelemetryEvents(status: boolean) {
    let level = 'ERROR';
    let msg = 'Search Dialcode failed';
    if (status) {
      level = 'SUCCESS';
      msg = 'Search Dialcode was success';
    }
    const event = {
      context: {
        env: 'dialcode',
        cdata: this.telemetryCdata
      },
      edata: {
        type: 'search-dialcode',
        level: level,
        message: msg,
        pageid: this.router.url.split('?')[0]
      }
    };
    this.telemetryService.log(event);
  }
  public handleCloseButton() {
    if (_.get(this.activatedRoute, 'snapshot.queryParams.textbook') && _.get(this.dialCodeService, 'dialCodeResult.count') > 1) {
      return this.router.navigate(['/get/dial', _.get(this.activatedRoute, 'snapshot.params.dialCode')]);
    }
    const previousUrl = _.get(this.navigationHelperService.getPreviousUrl(), 'url') || '/get';
    if (_.includes(previousUrl, 'play')) {
      if (this.userService.loggedIn) {
        this.router.navigate(['/resources']);
      } else {
        this.router.navigate(['/explore']);
      }
    }
  }

  goBack() {
    /*istanbul ignore else */
    if (_.get(this.activatedRoute, 'snapshot.queryParams.textbook') && _.get(this.dialCodeService, 'dialCodeResult.count') > 1) {
      return this.router.navigate(['/get/dial', _.get(this.activatedRoute, 'snapshot.params.dialCode')]);
    }
    if (this.userService.loggedIn) {
      this.router.navigate(['/resources']);
    } else {
      this.router.navigate(['/explore']);
    }
  }
  public redirectToDetailsPage(contentId) {
    if (this.userService.loggedIn) {
      this.router.navigate(['/resources/play/collection', contentId], {
        queryParams: { contentType: 'TextBook', 'dialCode': this.dialCode },
        state: { action: 'dialcode' }
      });
    } else {
      this.router.navigate(['/play/collection', contentId], { queryParams: { contentType: 'TextBook', 'dialCode': this.dialCode } });
    }
  }

  logInteractEvent({ id, type, subtype }) {
    const telemetry = {
      context: { env: _.get(this.activatedRoute, 'snapshot.data.telemetry.env'), cdata: this.telemetryCdata },
      edata: {
        id,
        type,
        pageid: 'get-dial'
      }
    };
    if (subtype) {
      telemetry.edata['subtype'] = subtype;
    }
    this.telemetryService.interact(telemetry);
  }


  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    if (event && this.router.url.includes('/get/dial')) {
      this.goBack();
    }
  }

}
