import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { combineLatest as observableCombineLatest } from 'rxjs';
import { ResourceService, ServerResponse, ToasterService, ConfigService, UtilService, NavigationHelperService } from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import { SearchService, SearchParam, PlayerService, CoursesService, UserService } from '@sunbird/core';
import { PublicPlayerService } from '@sunbird/public';
import * as _ from 'lodash-es';
import { IInteractEventObject, IInteractEventEdata, IImpressionEventInput, TelemetryService } from '@sunbird/telemetry';
import { takeUntil, map, catchError, mergeMap, first } from 'rxjs/operators';
import { Subject, forkJoin, of } from 'rxjs';
import * as TreeModel from 'tree-model';
import { environment } from '@sunbird/environment';
import { DownloadManagerService } from './../../../offline/services';

const treeModel = new TreeModel();


@Component({
  selector: 'app-dial-code',
  templateUrl: './dial-code.component.html',
  styleUrls: ['./dial-code.component.scss']
})
export class DialCodeComponent implements OnInit, OnDestroy, AfterViewInit {
  public inviewLogs: any = [];
  /**
	 * telemetryImpression
	*/
  public telemetryImpression: IImpressionEventInput;
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
  public linkedContents: Array<any>;
  public showMobilePopup = false;
  public isRedirectToDikshaApp = false;
  public closeMobilePopupInteractData: any;
  public appMobileDownloadInteractData: any;
  public dialSearchSource: string;
  public showBatchInfo = false;
  public selectedCourseBatches: any;
  isOffline: boolean = environment.isOffline;
  showExportLoader = false;
  contentName: string;
  instance: string;
  redirectCollectionUrl: string;
  redirectContentUrl: string;
  showDownloadLoader = false;

  constructor(public resourceService: ResourceService, public userService: UserService,
    public coursesService: CoursesService, public router: Router, public activatedRoute: ActivatedRoute,
    public searchService: SearchService, public toasterService: ToasterService, public configService: ConfigService,
    public utilService: UtilService, public navigationhelperService: NavigationHelperService,
    public playerService: PlayerService, public telemetryService: TelemetryService,
    public downloadManagerService: DownloadManagerService, public publicPlayerService: PublicPlayerService) {
  }

  ngOnInit() {
    EkTelemetry.config.batchsize = 2;
    observableCombineLatest(this.activatedRoute.params, this.activatedRoute.queryParams,
    (params, queryParams) => {
      return { ...params, ...queryParams };
    }).subscribe((params) => {
      this.dialSearchSource = params.source || 'search';
      this.itemsToDisplay = [];
      this.searchResults = [];
      this.dialCode = params.dialCode;
      this.setTelemetryData();
      this.searchDialCode();
    });
    this.handleMobilePopupBanner();

    if (this.isOffline) {
      this.downloadManagerService.downloadListEvent.pipe(takeUntil(this.unsubscribe$)).subscribe((data) => {
        this.updateCardData(data);
      });
      this.downloadManagerService.downloadEvent.pipe(first(),
      takeUntil(this.unsubscribe$)).subscribe(() => {
        this.showDownloadLoader = false;
      });

    }
    this.instance = _.upperCase(this.resourceService.instance);

  }

  public searchDialCode() {
    this.showLoader = true;
    const requestParams = {
      filters: {
        dialcodes: this.dialCode
      },
      params: this.configService.appConfig.dialPage.contentApiQueryParams
    };
    this.searchService.contentSearch(requestParams, false).pipe(mergeMap(apiResponse => {
      const linkedCollectionsIds = [];
      this.linkedContents = [];
      _.forEach(_.get(apiResponse, 'result.content'), (data) => {
        if (data.mimeType === 'application/vnd.ekstep.content-collection' && data.contentType.toLowerCase() !== 'course') {
          linkedCollectionsIds.push(data.identifier);
        } else {
          this.linkedContents.push(data);
        }
      });
      if (linkedCollectionsIds.length) {
        return this.getAllPlayableContent(linkedCollectionsIds);
      } else {
        return of([]);
      }
    })).subscribe(data => {
      const { constantData, metaData, dynamicFields } = this.configService.appConfig.GetPage;
      this.searchResults = this.utilService.getDataForCard(this.linkedContents, constantData, dynamicFields, metaData);
      this.appendItems(0, this.itemsToLoad);
      this.showLoader = false;
    }, error => {
      this.showLoader = false;
      this.toasterService.error(this.resourceService.messages.fmsg.m0049);
    });
  }

  onScrollDown() {
    const startIndex = this.itemsToLoad;
    this.itemsToLoad = this.itemsToLoad + this.numOfItemsToAddOnScroll;
    this.appendItems(startIndex, this.itemsToLoad);
  }

  appendItems (startIndex, endIndex) {
    this.itemsToDisplay.push(...this.searchResults.slice(startIndex, endIndex));
  }

  public getAllPlayableContent(collectionIds) {
    const apiArray = _.map(collectionIds, collectionId => this.getCollectionHierarchy(collectionId));
    return forkJoin(apiArray).pipe(map((results) => {
      _.forEach(results, (eachCollection) => {
        if (typeof eachCollection === 'object') {
          const parsedCollection = treeModel.parse(eachCollection);
          parsedCollection.walk((node) => {
            if (_.get(node, 'model.mimeType') && node.model.mimeType !== 'application/vnd.ekstep.content-collection') {
              node.model.l1Parent = eachCollection.identifier;
              this.linkedContents.push(node.model);
            }
            return true;
          });
        }
      });
    }));
  }

  public getCollectionHierarchy(collectionId) {
    return this.playerService.getCollectionHierarchy(collectionId).pipe(
      map((res) => _.get(res, 'result.content')), catchError(e => of(undefined)));
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
      this.router.navigate([this.redirectCollectionUrl, event.data.metaData.identifier],
        { queryParams: { dialCode: this.dialCode, l1Parent: event.data.metaData.l1Parent } });
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
    this.telemetryImpression.edata.subtype = 'pageexit';
    this.telemetryImpression = Object.assign({}, this.telemetryImpression);
  }

  ngAfterViewInit () {
    setTimeout(() => {
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
          pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
          uri: this.router.url,
          subtype: this.activatedRoute.snapshot.data.telemetry.subtype,
          duration: this.navigationhelperService.getPageLoadTime()
        }
      };
    });
  }
  closeMobileAppPopup () {
    if (!this.isRedirectToDikshaApp) {
      this.telemetryService.interact(this.closeMobilePopupInteractData);
      (document.querySelector('.mobile-app-popup') as HTMLElement).style.bottom = '-999px';
      (document.querySelector('.mobile-popup-dimmer') as HTMLElement).style.display = 'none';
    }
  }

  redirectToDikshaApp () {
    this.isRedirectToDikshaApp = true;
    this.telemetryService.interact(this.appMobileDownloadInteractData);
    let applink = this.configService.appConfig.UrlLinks.downloadDikshaApp;
    const slug = _.get(this.activatedRoute, 'snapshot.firstChild.firstChild.params.slug');
    const utm_source = slug ? `diksha-${slug}` : 'diksha';
    applink = `${applink}&utm_source=${utm_source}&utm_medium=${this.dialSearchSource}&utm_campaign=dial&utm_term=${this.dialCode}`;
    window.location.href = applink.replace(/\s+/g, '');
  }
  setTelemetryData () {
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
  }
  ngOnDestroy() {
    EkTelemetry.config.batchsize = 10;
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  handleMobilePopupBanner () {
    setTimeout(() => {
      this.showMobilePopup = true;
    }, 500);
  }

  startDownload (contentId) {
    this.downloadManagerService.downloadContentId = contentId;
    this.downloadManagerService.startDownload({}).subscribe(data => {
      this.downloadManagerService.downloadContentId = '';
    }, error => {
      this.showDownloadLoader = false;
      this.downloadManagerService.downloadContentId = '';
      _.each(this.itemsToDisplay, (contents) => {
        contents['downloadStatus'] = 'FAILED';
      });
      this.toasterService.error(this.resourceService.messages.fmsg.m0090);
    });
  }

  exportOfflineContent(contentId) {
    this.downloadManagerService.exportContent(contentId).subscribe(data => {
      const link = document.createElement('a');
      link.href = data.result.response.url;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      this.showExportLoader = false;
    }, error => {
      this.showExportLoader = false;
      this.toasterService.error(this.resourceService.messages.fmsg.m0091);
    });
  }

  updateCardData(downloadListdata) {
    _.each(this.itemsToDisplay, (contents) => {
    this.publicPlayerService.updateDownloadStatus(downloadListdata, contents);
    });
  }
}
