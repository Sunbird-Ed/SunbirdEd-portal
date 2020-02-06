import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { combineLatest as observableCombineLatest, iif, of } from 'rxjs';
import { ResourceService, ServerResponse, ToasterService, ConfigService, UtilService, NavigationHelperService } from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import { SearchService, SearchParam, PlayerService, CoursesService, UserService } from '@sunbird/core';
import { PublicPlayerService } from '@sunbird/public';
import * as _ from 'lodash-es';
import { IInteractEventEdata, IImpressionEventInput, TelemetryService, TelemetryInteractDirective } from '@sunbird/telemetry';
import { takeUntil, mergeMap, first, tap, retry, catchError, map, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as TreeModel from 'tree-model';
import { environment } from '@sunbird/environment';
import {
  ContentManagerService
} from './../../../../../../projects/desktop/src/app/modules/offline/services/content-manager/content-manager.service';
import { DialCodeService } from '../../services/dial-code/dial-code.service';
const treeModel = new TreeModel();

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
  public closeIntractEdata: IInteractEventEdata;
  public selectChapterTelemetryCdata: Array<{}> = [];
  public selectChapterInteractEdata: IInteractEventEdata;
  public showMobilePopup = false;
  public isRedirectToDikshaApp = false;
  public closeMobilePopupInteractData: any;
  public appMobileDownloadInteractData: any;
  public dialSearchSource: string;
  public showBatchInfo = false;
  public selectedCourseBatches: any;
  public singleContentRedirect = '';
  isOffline: boolean = environment.isOffline;
  showExportLoader = false;
  contentName: string;
  instance: string;
  redirectCollectionUrl: string;
  redirectContentUrl: string;
  showDownloadLoader = false;
  isBrowse = false;
  showSelectChapter = false;
  chapterName: string;
  dialContentId: string;

  constructor(public resourceService: ResourceService, public userService: UserService,
    public coursesService: CoursesService, public router: Router, public activatedRoute: ActivatedRoute,
    public searchService: SearchService, public toasterService: ToasterService, public configService: ConfigService,
    public utilService: UtilService, public navigationhelperService: NavigationHelperService,
    public playerService: PlayerService, public telemetryService: TelemetryService,
    public contentManagerService: ContentManagerService, public publicPlayerService: PublicPlayerService,
    private dialCodeService: DialCodeService) {
  }

  ngOnInit() {
    observableCombineLatest(this.activatedRoute.params, this.activatedRoute.queryParams,
      (params, queryParams) => {
        return { ...params, ...queryParams };
      }).pipe(
        tap(this.initialize),
        mergeMap(params => _.get(params, 'textbook') ? this.processTextBook(params) : this.processDialCode(params)),
      ).subscribe(res => {
        const linkedContents = _.flatMap(_.values(res));
        const { constantData, metaData, dynamicFields } = this.configService.appConfig.GetPage;
        this.searchResults = this.utilService.getDataForCard(linkedContents, constantData, dynamicFields, metaData);
        this.appendItems(0, this.itemsToLoad);
        if (this.searchResults.length === 1) {
          if (_.get(this.searchResults[0], 'metaData.mimeType') === 'application/vnd.ekstep.content-collection' ||
            !sessionStorage.getItem('singleContentRedirect')) {
            this.singleContentRedirect = this.searchResults[0]['name'];
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
    if (this.isOffline) {
      this.contentManagerService.downloadListEvent.pipe(takeUntil(this.unsubscribe$)).subscribe((data) => {
        this.updateCardData(data);
      });
      this.contentManagerService.downloadEvent.pipe(first(),
        takeUntil(this.unsubscribe$)).subscribe(() => {
          this.showDownloadLoader = false;
        });
    }
  }

  private initialize = (params) => {
    EkTelemetry.config.batchsize = 2;
    this.isBrowse = Boolean(this.router.url.includes('browse'));
    this.dialSearchSource = _.get(params, 'source') || 'search';
    this.itemsToDisplay = [];
    this.searchResults = [];
    this.dialCode = _.get(params, 'dialCode');
    this.showLoader = true;
    this.instance = _.upperCase(_.get(this.resourceService, 'instance'));
    this.handleMobilePopupBanner();
    this.setTelemetryData();
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
      mergeMap(param => this.dialCodeService.searchDialCode(_.get(param, 'dialCode'), this.isBrowse)
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
    const content = _.find(_.get(this.dialCodeService, 'dialCodeResult.content'), contentObj => {
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
  }

  public playCourse({ section, data }) {
    const { metaData } = data;
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
        this.publicPlayerService.playExploreCourse(metaData.identifier);
      });
    } else {
      this.publicPlayerService.playExploreCourse(metaData.identifier);
    }
  }

  public getEvent(event) {

    // For offline environment content will only play when event.action is open
    if (event.action === 'download' && this.isOffline) {
      this.startDownload(event.data.metaData.identifier);
      this.showDownloadLoader = true;
      this.contentName = event.data.name;
      return false;
    } else if (event.action === 'export' && this.isOffline) {
      this.showExportLoader = true;
      this.contentName = event.data.name;
      this.exportOfflineContent(event.data.metaData.identifier);
      return false;
    }

    if (_.includes(this.router.url, 'browse') && this.isOffline) {
      this.redirectCollectionUrl = 'browse/play/collection';
      this.redirectContentUrl = 'browse/play/content';
    } else {
      this.redirectCollectionUrl = 'play/collection';
      this.redirectContentUrl = 'play/content';
    }

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
    } else {
      this.router.navigate([this.redirectContentUrl, event.data.metaData.identifier],
        { queryParams: { dialCode: this.dialCode, l1Parent: event.data.metaData.l1Parent } });
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
    if (!this.isRedirectToDikshaApp) {
      this.telemetryService.interact(this.closeMobilePopupInteractData);
      (document.querySelector('.mobile-app-popup') as HTMLElement).style.bottom = '-999px';
      (document.querySelector('.mobile-popup-dimmer') as HTMLElement).style.display = 'none';
    }
  }
  redirectToDikshaApp() {
    this.isRedirectToDikshaApp = true;
    this.telemetryService.interact(this.appMobileDownloadInteractData);
    let applink = this.configService.appConfig.UrlLinks.downloadDikshaApp;
    const slug = _.get(this.activatedRoute, 'snapshot.firstChild.firstChild.params.slug');
    const utm_source = slug ? `diksha-${slug}` : 'diksha';
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

    this.closeIntractEdata = {
      id: 'dialpage-close',
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
        uri: this.router.url,
        subtype: _.get(this.activatedRoute, 'snapshot.data.telemetry.subtype'),
        duration: this.navigationhelperService.getPageLoadTime()
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
      this.showMobilePopup = true;
    }, 500);
  }
  startDownload(contentId) {
    this.contentManagerService.downloadContentId = contentId;
    this.contentManagerService.startDownload({}).subscribe(data => {
      this.contentManagerService.downloadContentId = '';
    }, error => {
      this.showDownloadLoader = false;
      this.contentManagerService.downloadContentId = '';
      _.each(this.itemsToDisplay, (contents) => {
        contents['downloadStatus'] = this.resourceService.messages.stmsg.m0138;
      });
      this.toasterService.error(this.resourceService.messages.fmsg.m0090);
    });
  }
  exportOfflineContent(contentId) {
    this.contentManagerService.exportContent(contentId).subscribe(data => {
      this.showExportLoader = false;
      this.toasterService.success(this.resourceService.messages.smsg.m0059);
    }, error => {
      this.showExportLoader = false;
      if (error.error.responseCode !== 'NO_DEST_FOLDER') {
        this.toasterService.error(this.resourceService.messages.fmsg.m0091);
      }
    });
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
      this.router.navigate(['/get/dial', _.get(this.activatedRoute, 'snapshot.params.dialCode')]);
    } else {
      this.router.navigate(['/get']);
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

}
