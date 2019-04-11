import { Component, OnInit, OnDestroy } from '@angular/core';
import { ResourceService, ServerResponse, ToasterService, ConfigService, UtilService } from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import { SearchService, SearchParam, PlayerService } from '@sunbird/core';
import * as _ from 'lodash-es';
import { IInteractEventObject, IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';
import { takeUntil, map, catchError, mergeMap } from 'rxjs/operators';
import { Subject, forkJoin, of } from 'rxjs';
import * as TreeModel from 'tree-model';
import * as $ from 'jquery';

@Component({
  selector: 'app-dial-code',
  templateUrl: './dial-code.component.html',
  styleUrls: ['./dial-code.component.scss']
})
export class DialCodeComponent implements OnInit, OnDestroy {
  inviewLogs: any = [];
  /**
	 * telemetryImpression
	*/
  telemetryImpression: IImpressionEventInput;
  /**
   * reference of SearchService
   */
  private searchService: SearchService;

  telemetryInteractObject: IInteractEventObject;
  closeMobilePopup: IInteractEventEdata;
  appMobileDownload: IInteractEventEdata;
  /**
   * reference of ToasterService
   */
  private toasterService: ToasterService;

  /**
  * reference of ResourceService
  */
  public resourceService: ResourceService;
  /**
   * used to store insatnce name
   */
  public instanceName;
  /**
   * used to store searched keyword
   */
  public dialCode;
  /**
   * used to store searched keyword
   */
  public searchKeyword;
  /**
  * To navigate to other pages
   */
  public router: Router;

  /**
   * To send activatedRoute.snapshot to routerNavigationService
   */
  public activatedRoute: ActivatedRoute;

  /**
  * This variable hepls to show and hide page loader.
  * It is kept true by default as at first when we comes
  * to a page the loader should be displayed before showing
  * any data
  */
  showLoader = true;

  /**
    * loader message
   */
  loaderMessage: any;

  /**
   * to store search results
  */
  searchResults: Array<any> = [];
  /**
   * to unsubscribe
  */
  public unsubscribe$ = new Subject<void>();

  linkedContents: Array<any>;


  constructor(resourceService: ResourceService, router: Router, activatedRoute: ActivatedRoute,
    searchService: SearchService, toasterService: ToasterService, public configService: ConfigService,
    public utilService: UtilService, public playerService: PlayerService) {
    this.resourceService = resourceService;
    this.router = router;
    this.activatedRoute = activatedRoute;
    this.searchService = searchService;
    this.toasterService = toasterService;
  }

  ngOnInit() {
    this.instanceName = this.resourceService.instance;
    this.activatedRoute.params.subscribe(params => {
      this.searchKeyword = this.dialCode = params.dialCode;
      this.searchDialCode();
      this.setTelemetryData();
    });
    this.handleMobilePopupBanner();
  }

  handleMobilePopupBanner () {
    setTimeout(() => {
      $('.mobile-app-popup').css({ 'bottom': '0' });
      $('.mobile-popup-dimmer').css({ 'bottom': '0' });
    }, 500);

    $('.app-download').click(function (event) {
      const btnId = $(this).attr('id');
      window.location.href = 'https://play.google.com/store/apps/details?id=in.gov.diksha.app';
    });

    $('.close-mobile-div').click(() => {
      $('.mobile-app-popup').css({ 'bottom': '-999px' });
      $('.mobile-popup-dimmer').css({ 'display': 'none' });
    });

    $('.mobile-popup-dimmer').click(() => {
      $('.mobile-app-popup').css({ 'bottom': '-999px' });
      $('.mobile-popup-dimmer').css({ 'display': 'none' });
    });
  }

  setTelemetryData() {
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env,
        cdata: [{
          type: 'dialCode',
          id: this.dialCode
        }]
      },
      object: {
        id: this.dialCode,
        type: 'dialCode',
        ver: '1.0'
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        uri: this.router.url,
        subtype: this.activatedRoute.snapshot.data.telemetry.subtype
      }
    };
    this.telemetryInteractObject = {
      id: this.dialCode,
      type: 'dialCode',
      ver: '1.0'
    };
    this.closeMobilePopup = {
      id: 'mobile-popup-close',
      type: 'click',
      pageid: 'get-dial'
    };

    this.appMobileDownload = {
      id: 'app-download-mobile',
      type: 'click',
      pageid: 'get-dial'
    };
  }
  public searchDialCode() {
    this.showLoader = true;
    const requestParams = {
      filters: {
        'dialcodes': this.dialCode
      }
    };
    this.searchService.contentSearch(requestParams, false).pipe(
      mergeMap(apiResponse => {
        if (apiResponse.result.content && apiResponse.result.content.length > 0) {
          const linkedCollectionsIds = [];
          this.linkedContents = [];
          _.forEach(apiResponse.result.content, (data) => {
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
        }
      }))
      .subscribe(data => {
        const constantData = this.configService.appConfig.GetPage.constantData;
        const metaData = this.configService.appConfig.GetPage.metaData;
        const dynamicFields = this.configService.appConfig.GetPage.dynamicFields;
        this.searchResults = this.utilService.getDataForCard(this.linkedContents, constantData, dynamicFields, metaData);
        this.showLoader = false;
      }, error => {
        this.showLoader = false;
        this.toasterService.error(this.resourceService.messages.fmsg.m0049);
      });
  }

  public getAllPlayableContent(collectionIds) {
    const apiArray = [];
    _.forEach(collectionIds, (data) => {
      apiArray.push(this.getCollectionHierarchy(data));
    });
    return forkJoin(apiArray).pipe(map((results) => {
      const model = new TreeModel();
      _.forEach(results, (eachCollection) => {
        if (typeof eachCollection === 'object') {
          const treeModel = model.parse(eachCollection);
          treeModel.walk((node) => {
            if (_.get(node, 'model.mimeType') && node.model.mimeType !== 'application/vnd.ekstep.content-collection') {
              this.linkedContents.push(node.model);
            }
            return true;
          });
        }
      });
    }));
  }

  public getCollectionHierarchy(collectionId) {
    return this.playerService.getCollectionHierarchy(collectionId).pipe(map((res) =>
    _.get(res, 'result.content')), catchError(e => of(undefined)));
  }

  public navigateToSearch() {
    if (this.searchKeyword.length > 0) {
      this.router.navigate(['/get/dial', this.searchKeyword]);
    }
  }

  public getEvent(event) {
    if (event.data.metaData.mimeType === this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.collection) {
      this.router.navigate(['play/collection', event.data.metaData.identifier], { queryParams: { dialCode: this.searchKeyword } });
    } else {
      this.router.navigate(['play/content', event.data.metaData.identifier], { queryParams: { dialCode: this.searchKeyword } });
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
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
