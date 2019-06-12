import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ResourceService, ServerResponse, ToasterService, ConfigService, UtilService, NavigationHelperService } from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import { SearchService, SearchParam, PlayerService } from '@sunbird/core';
import * as _ from 'lodash-es';
import { IInteractEventObject, IInteractEventEdata, IImpressionEventInput, TelemetryService } from '@sunbird/telemetry';
import { takeUntil, map, catchError, mergeMap } from 'rxjs/operators';
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
  isOffline: boolean = environment.isOffline;
  showExportLoader = false;
  contentName: string;
  instance: string;
  constructor(public resourceService: ResourceService, public router: Router, public activatedRoute: ActivatedRoute,
    public searchService: SearchService, public toasterService: ToasterService, public configService: ConfigService,
    public utilService: UtilService, public navigationhelperService: NavigationHelperService,
    public playerService: PlayerService, public telemetryService: TelemetryService,
    public downloadManagerService: DownloadManagerService) {

  }

  ngOnInit() {
    EkTelemetry.config.batchsize = 2;
    this.activatedRoute.params.subscribe(params => {
      this.itemsToDisplay = [];
      this.searchResults = [];
      this.dialCode = params.dialCode;
      this.setTelemetryData();
      this.searchDialCode();
    });
    this.handleMobilePopupBanner();

    if (this.isOffline) {
      this.downloadManagerService.downloadListEvent.subscribe((data) => {
        this.updateCardData(data);
      });
    }
    this.instance = _.upperCase(this.resourceService.instance);

  }

  public searchDialCode() {
    this.showLoader = true;
    const requestParams = {
      filters: {
        dialcodes: this.dialCode
      }
    };
    this.searchService.contentSearch(requestParams, false).pipe(mergeMap(apiResponse => {
      const linkedCollectionsIds = [];
      this.linkedContents = [];
      _.forEach(_.get(apiResponse, 'result.content'), (data) => {
        if (data.mimeType === 'application/vnd.ekstep.content-collection') {
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

  public getEvent(event) {

    // For offline envirnoment content will not play if action not open. It will get downloaded
    if (_.includes(this.router.url, 'browse') && this.isOffline) {
      this.startDownload(event.data.metaData.identifier);
      return false;
    } else if (event.action === 'export' && this.isOffline) {
      this.showExportLoader = true;
      this.contentName = event.data.name;
      this.exportOfflineContent(event.data.metaData.identifier);
      return false;
    }

    if (event.data.metaData.mimeType === this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.collection) {
      this.router.navigate(['play/collection', event.data.metaData.identifier],
        { queryParams: { dialCode: this.dialCode, l1Parent: event.data.metaData.l1Parent } });
    } else {
      this.router.navigate(['play/content', event.data.metaData.identifier],
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
    window.location.href = 'https://play.google.com/store/apps/details?id=in.gov.diksha.app';
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
      this.downloadManagerService.downloadContentId = '';
      _.each(this.itemsToDisplay, (contents) => {
        contents['addedToLibrary'] = false;
        contents['showAddingToLibraryButton'] = false;
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

      // If download is completed card should show added to library
      _.find(downloadListdata.result.response.downloads.completed, (completed) => {
        if (contents.metaData.identifier === completed.contentId) {
          contents['addedToLibrary'] = true;
          contents['showAddingToLibraryButton'] = false;
        }
      });

      // If download failed, card should show again add to library
      _.find(downloadListdata.result.response.downloads.failed, (failed) => {
        if (contents.metaData.identifier === failed.contentId) {
          contents['addedToLibrary'] = false;
          contents['showAddingToLibraryButton'] = false;
        }
      });
    });
  }
}
