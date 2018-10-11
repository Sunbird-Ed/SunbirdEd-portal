import { Component, OnInit, OnDestroy } from '@angular/core';
import { ResourceService, ServerResponse, ToasterService, ConfigService, UtilService } from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import { SearchService, SearchParam } from '@sunbird/core';
import * as _ from 'lodash';
import { IInteractEventObject, IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-dial-code',
  templateUrl: './dial-code.component.html',
  styleUrls: ['./dial-code.component.css']
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
  searchResults: Array<any>;
  /**
   * to unsubscribe
  */
  public unsubscribe$ = new Subject<void>();


  constructor(resourceService: ResourceService, router: Router, activatedRoute: ActivatedRoute,
    searchService: SearchService, toasterService: ToasterService, public configService: ConfigService,
    public utilService: UtilService) {
    this.resourceService = resourceService;
    this.router = router;
    this.activatedRoute = activatedRoute;
    this.searchService = searchService;
    this.toasterService = toasterService;
  }

  ngOnInit() {
    this.instanceName = this.resourceService.instance;
    this.activatedRoute.params.subscribe(params => {
      this.searchResults = [];
      this.searchKeyword = this.dialCode = params.dialCode;
      this.searchDialCode();
      this.setTelemetryData();
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
  }
  public searchDialCode() {
    this.showLoader = true;
    const requestParams = {
      filters: {
        'dialcodes': this.dialCode
      }
    };
    this.searchService.contentSearch(requestParams, false).pipe(
    takeUntil(this.unsubscribe$))
    .subscribe(
      (apiResponse: ServerResponse) => {
        this.showLoader = false;
        if (apiResponse.result.content && apiResponse.result.content.length > 0) {
          const constantData = this.configService.appConfig.GetPage.constantData;
          const metaData = this.configService.appConfig.GetPage.metaData;
          const dynamicFields = this.configService.appConfig.GetPage.dynamicFields;
          this.searchResults = this.utilService.getDataForCard(apiResponse.result.content, constantData, dynamicFields, metaData);
        }
      },
      err => {
        this.showLoader = false;
        this.toasterService.error(this.resourceService.messages.fmsg.m0049);
      }
    );
  }

  public navigateToSearch() {
    if (this.searchKeyword.length > 0) {
      this.router.navigate(['/get/dial', this.searchKeyword]);
    }
  }

  public getEvent(event) {
    if (event.data.metaData.mimeType === this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.collection) {
      this.router.navigate(['play/collection', event.data.metaData.identifier], { queryParams: { dialCode: this.searchKeyword} });
    } else {
      this.router.navigate(['play/content', event.data.metaData.identifier], { queryParams:  { dialCode: this.searchKeyword} });
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
