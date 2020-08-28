
import { map, catchError, first, mergeMap, takeUntil, filter } from 'rxjs/operators';
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { PublicPlayerService } from './../../../../services';
import { Observable, Subscription, Subject, of, throwError } from 'rxjs';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import {
  WindowScrollService, ToasterService, ILoaderMessage, PlayerConfig,
  ICollectionTreeOptions, NavigationHelperService, ResourceService,  ExternalUrlPreviewService, ConfigService,
  ContentUtilsServiceService, UtilService, ITelemetryShare, LayoutService
} from '@sunbird/shared';
import { CollectionHierarchyAPI, ContentService, UserService } from '@sunbird/core';
import * as _ from 'lodash-es';
import { IInteractEventObject, IInteractEventEdata, IImpressionEventInput, IEndEventInput, IStartEventInput,
  TelemetryService } from '@sunbird/telemetry';
import * as TreeModel from 'tree-model';
import { PopupControlService } from '../../../../../../service/popup-control.service';
@Component({
  selector: 'app-public-collection-player',
  templateUrl: './public-collection-player.component.html',
  styleUrls: ['./public-collection-player.component.scss']
})
export class PublicCollectionPlayerComponent implements OnInit, OnDestroy, AfterViewInit {
  /**
	 * telemetryImpression
  */
  mimeTypeFilters;
  activeMimeTypeFilter;
  telemetryImpression: IImpressionEventInput;
  telemetryContentImpression: IImpressionEventInput;
  telemetryShareData: Array<ITelemetryShare>;
  objectInteract: IInteractEventObject;
  printPdfInteractEdata: IInteractEventEdata;
  tocTelemetryInteractEdata: IInteractEventEdata;
  shareLink: string;
  public sharelinkModal: boolean;
  public mimeType: string;
  public queryParams: any;
  public collectionData: any;

  public showPlayer: Boolean = false;

  private collectionId: string;

  private contentId: string;
  private contentType: string ;
  /**
   * Refrence of Content service
   * @private
   * @type {ContentService}
   */
  private contentService: ContentService;

  public collectionTreeNodes: any;

  public collectionTitle: string;

  public contentTitle: string;

  public playerConfig: Observable<any>;

  private playerService: PublicPlayerService;

  private windowScrollService: WindowScrollService;

  private router: Router;

  private objectRollUp: any;

  telemetryCdata: Array<{}>;

  public loader: Boolean = true;
  public treeModel: any;
  public contentDetails = [];
  public tocList = [];
  public nextPlaylistItem: any;
  public prevPlaylistItem: any;
  public showFooter: Boolean = false;
  public badgeData: Array<object>;
  private subsrciption: Subscription;
  public closeCollectionPlayerInteractEdata: IInteractEventEdata;
  public closePlayerInteractEdata: IInteractEventEdata;
  public telemetryInteractObject: IInteractEventObject;
  public playerTelemetryInteractObject: IInteractEventObject;
  public telemetryCourseEndEvent: IEndEventInput;
  public telemetryCourseStart: IStartEventInput;
  contentData: any;
  activeContent: any;
  isContentPresent: Boolean = false;
  isSelectChapter: Boolean = false;
  showLoader = true;
  isMobile = false;

  /**
   * Page Load Time, used this data in impression telemetry
   */
  public pageLoadDuration: Number;

  public loaderMessage: ILoaderMessage = {
    headerMessage: 'Please wait...',
    loaderMessage: 'Fetching content details!'
  };

  collectionTreeOptions: ICollectionTreeOptions;
  /**
	 * dialCode
	*/
  public dialCode: string;
  playerOption: any;
  public playerContent;
  public unsubscribe$ = new Subject<void>();
  selectedContent: {};
  pageId: string;
  layoutConfiguration;

  constructor(contentService: ContentService, public route: ActivatedRoute, playerService: PublicPlayerService,
    windowScrollService: WindowScrollService, router: Router, public navigationHelperService: NavigationHelperService,
    public resourceService: ResourceService, private activatedRoute: ActivatedRoute, private deviceDetectorService: DeviceDetectorService,
    public externalUrlPreviewService: ExternalUrlPreviewService, private configService: ConfigService,
    public toasterService: ToasterService, private contentUtilsService: ContentUtilsServiceService,
    public popupControlService: PopupControlService,
    public utilService: UtilService, public userService: UserService,
    public telemetryService: TelemetryService,
    public layoutService: LayoutService) {
    this.contentService = contentService;
    this.playerService = playerService;
    this.windowScrollService = windowScrollService;
    this.router = router;
    this.router.onSameUrlNavigation = 'ignore';
    this.collectionTreeOptions = this.configService.appConfig.collectionTreeOptions;
    this.playerOption = {
      showContentRating: true
    };
    this.mimeTypeFilters = [
      {text: this.resourceService.frmelmnts.btn.all, value: 'all'},
      {text: this.resourceService.frmelmnts.btn.video, value: 'video'},
      {text: this.resourceService.frmelmnts.btn.interactive, value: 'interactive'},
      {text: this.resourceService.frmelmnts.btn.docs, value: 'docs'}
    ];
    this.activeMimeTypeFilter = [ 'all' ];
  }
  ngOnInit() {
    this.initLayout();
    this.pageId = this.route.snapshot.data.telemetry.pageid;
    this.contentType = _.get(this.activatedRoute, 'snapshot.queryParams.contentType');
    this.dialCode = _.get(this.activatedRoute, 'snapshot.queryParams.dialCode');
    this.contentData = this.getContent();
    this.deviceDetector();
    this.setTelemetryData();
  }
  initLayout() {
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.layoutService.scrollTop();
    this.layoutService.switchableLayout().
        pipe(takeUntil(this.unsubscribe$)).subscribe(layoutConfig => {
        if (layoutConfig != null) {
          this.layoutConfiguration = layoutConfig.layout;
        }
      });
  }
  setTelemetryData() {
    if (this.dialCode) {
      this.telemetryCdata = [{ 'type': 'DialCode', 'id': this.dialCode }];
    }
    this.closeCollectionPlayerInteractEdata = {
      id: 'close-collection',
      type: 'click',
      pageid: this.route.snapshot.data.telemetry.pageid
    };
    this.closePlayerInteractEdata = {
      id: 'close-player',
      type: 'click',
      pageid: this.route.snapshot.data.telemetry.pageid
    };
    this.printPdfInteractEdata = {
      id: 'public-print-pdf-button',
      type: 'click',
      pageid: this.route.snapshot.data.telemetry.pageid
    };
    this.telemetryInteractObject = {
      id: this.activatedRoute.snapshot.params.collectionId,
      type: this.contentType,
      ver: '1.0'
    };
    this.printPdfInteractEdata = {
      id: 'public-print-pdf-button',
      type: 'click',
      pageid: this.route.snapshot.data.telemetry.pageid
    };
    this.playerTelemetryInteractObject = { ...this.telemetryInteractObject };

  }

  onShareLink() {
    this.shareLink = this.contentUtilsService.getPublicShareUrl(this.collectionId,
      _.get(this.collectionTreeNodes, 'data.mimeType'));
    this.setTelemetryShareData(this.collectionData);
  }

  setTelemetryShareData(param) {
    this.telemetryShareData = [{
      id: 'public-' + param.identifier,
      type: param.contentType,
      ver: param.pkgVersion ? param.pkgVersion.toString() : '1.0'
    }];
  }

  printPdf(pdfUrl: string) {
    window.open(pdfUrl, '_blank');
  }

  ngAfterViewInit () {
    this.pageLoadDuration = this.navigationHelperService.getPageLoadTime();
    let cData = [];
    if (this.contentType) {
      cData = [{id: this.activatedRoute.snapshot.params.collectionId, type: this.contentType}];
    }
    setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: this.route.snapshot.data.telemetry.env,
          cdata: cData
        },
        object: {
          id: this.activatedRoute.snapshot.params.collectionId,
          type: this.contentType,
          ver: '1.0'
        },
        edata: {
          type: this.route.snapshot.data.telemetry.type,
          pageid: this.route.snapshot.data.telemetry.pageid,
          uri: this.userService.slug ? '/' + this.userService.slug + this.router.url : this.router.url,
          subtype: this.route.snapshot.data.telemetry.subtype,
          duration: this.pageLoadDuration
        }
      };
    });
    if (!this.contentType) {
      this.triggerTelemetryErrorEvent(404, 'contentType field unavailable');
    }
  }

  ngOnDestroy() {
    if (this.subsrciption) {
      this.subsrciption.unsubscribe();
    }
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private initPlayer(id: string) {
    this.playerConfig = this.getPlayerConfig(id).pipe(map((data) => {
      data.context.objectRollup = this.objectRollUp;
      this.playerTelemetryInteractObject.rollup = this.objectRollUp;
      this.setTelemetryContentImpression(data);
      return data;
    }), catchError((err) => {
      return err;
    }), );
  }
  selectedFilter(event) {
    // this.logTelemetry(`filter-${event.data.text}`);
    this.activeMimeTypeFilter = event.data.value;
  }

  showNoContent(event) {
    if (event.message === 'No Content Available') {
      this.isContentPresent = false;
    }
  }
  setTelemetryContentImpression(data) {
    this.telemetryContentImpression = {
      context: {
        env: this.route.snapshot.data.telemetry.env
      },
      edata: {
        type: this.route.snapshot.data.telemetry.env,
        pageid: this.route.snapshot.data.telemetry.env,
        uri: this.userService.slug ? '/' + this.userService.slug + this.router.url : this.router.url,
      },
      object: {
        id: data.metadata.identifier,
        type: this.contentType || data.metadata.dataType || data.metadata.resourceType,
        ver: data.metadata.pkgVersion ? data.metadata.pkgVersion.toString() : '1.0',
        rollup: this.objectRollUp
      }
    };
  }

  public playContent(data: any): void {
    this.showPlayer = true;
    this.contentTitle = data.title;
    this.initPlayer(data.id);
  }

  private navigateToContent(content?: { title: string, id: string }, id?: string): void {
    let navigationExtras: NavigationExtras;
    navigationExtras = {
      queryParams: {},
      relativeTo: this.route
    };
    if (id) {
      this.queryParams.contentId = id;
      navigationExtras.queryParams = this.queryParams;
    } else
      if (content) {
        navigationExtras.queryParams = { 'contentId': content.id };
      }
    this.router.navigate([], navigationExtras);
  }

  private getPlayerConfig(contentId: string): Observable<PlayerConfig> {
    if (this.dialCode) {
      return this.playerService.getConfigByContent(contentId, { dialCode: this.dialCode });
    } else {
      return this.playerService.getConfigByContent(contentId);
    }
  }

  private findContentById(collection: any, id: string) {
    const model = new TreeModel();
    return model.parse(collection.data).first((node) => {
      return node.model.identifier === id;
    });
  }
  private parseChildContent(collection: any) {
    const model = new TreeModel();
    if (collection.data) {
      this.treeModel = model.parse(collection.data);
      this.treeModel.walk((node) => {
        if (node.model.mimeType !== 'application/vnd.ekstep.content-collection') {
          this.contentDetails.push({ id: node.model.identifier, title: node.model.name });
          this.tocList.push({id: node.model.identifier, title: node.model.name, mimeType: node.model.mimeType});
        }
        this.setContentNavigators();
      });
    }
  }
  public setContentNavigators() {
    const index = _.findIndex(this.contentDetails, ['id', this.contentId]);
    this.prevPlaylistItem = this.contentDetails[index - 1];
    this.nextPlaylistItem = this.contentDetails[index + 1];
  }
  public OnPlayContent(content: { title: string, id: string }, isClicked?: boolean) {
    if (content && content.id) {
      this.navigateToContent(null, content.id);
      this.setContentNavigators();
      this.playContent(content);
      if (!isClicked) {
        const playContentDetails = this.findContentById( this.collectionTreeNodes, content.id);
        if (playContentDetails.model.mimeType === this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.xUrl) {
          this.externalUrlPreviewService.generateRedirectUrl(playContentDetails.model);
        }
      }
        this.windowScrollService.smoothScroll('app-player-collection-renderer', 10);
    } else {
      throw new Error(`unbale to play collection content for ${this.collectionId}`);
    }
  }

  private getContent(): void {
    this.subsrciption = this.route.params.pipe(
      filter(params => params.collectionId !== this.collectionId),
      mergeMap((params) => {
        this.showLoader = true; // show loader every time the param changes, used in route reuse strategy
        this.collectionId = params.collectionId;
        this.telemetryCdata = [{id: this.collectionId, type: this.contentType}];
        this.setTelemetryData();
        this.setTelemetryStartEndData();
        return this.getCollectionHierarchy(params.collectionId);
      }))
      .subscribe((data) => {
        this.collectionTreeNodes = data;
        this.showLoader = false;
        this.route.queryParams.subscribe((queryParams) => {
          this.queryParams = { ...queryParams};
          this.contentId = queryParams.contentId;
          this.dialCode = queryParams.dialCode;
        });
        this.parseChildContent(this.collectionTreeNodes);
      }, (error) => {
        this.toasterService.error(this.resourceService.messages.fmsg.m0004); // need to change message
        this.router.navigate(['/explore']);
      });
  }
  private getCollectionHierarchy(collectionId: string): Observable<{ data: CollectionHierarchyAPI.Content } | any> {
    const inputParams = {params: this.configService.appConfig.CourseConsumption.contentApiQueryParams};
    return this.playerService.getCollectionHierarchy(collectionId, inputParams).pipe(
      mergeMap((response) => {
        if (_.get(response, 'result.content.status') === 'Unlisted') {
          return throwError({
            code: 'UNLISTED_CONTENT'
          });
        }
        this.collectionData = response.result.content;
        this.collectionTitle = _.get(response, 'result.content.name') || 'Untitled Collection';
        this.badgeData = _.get(response, 'result.content.badgeAssertions');
        return of({ data: response.result.content });
      }));
  }
  closeCollectionPlayer() {
    if (this.isMobile) {
      this.isMobile = false;
      this.activeContent = null;
    } else {
      if (this.dialCode) {
        sessionStorage.setItem('singleContentRedirect', 'singleContentRedirect');
        this.router.navigate(['/get/dial/', this.dialCode]);
      } else {
        this.navigationHelperService.navigateToPreviousUrl('/explore');
      }
    }
  }
  closeContentPlayer() {
    try {
      window.frames['contentPlayer'].contentDocument.body.onunload({});
    } catch {

    } finally {
      setTimeout(() => {
        this.showPlayer = false;
        delete this.queryParams.contentId;
        const navigationExtras: NavigationExtras = {
          relativeTo: this.route,
          queryParams: this.queryParams
        };
        this.router.navigate([], navigationExtras);
      }, 100);
    }
  }
  deviceDetector() {
    const deviceInfo = this.deviceDetectorService.getDeviceInfo();
    if ( deviceInfo.device === 'android' || deviceInfo.os === 'android') {
      this.showFooter = true;
    }
  }

  callinitPlayer (event) {
    if ((event.data.identifier !== _.get(this.activeContent, 'identifier')) || this.isMobile ) {
      this.isContentPresent = true;
      if (this.contentId) {
        const data = this.setActiveContent(this.contentId);
        if (data) {
          event.data = data;
          const queryParams = _.get(this.collectionData, 'contentType') === 'TextBook' ? { contentType: this.contentType } :
            { contentType: this.contentType, contentId: this.contentId };
          const navigationExtras: NavigationExtras = {
            relativeTo: this.route,
            queryParams: queryParams
          };
          this.router.navigate([], navigationExtras);
        }
      }
      this.activeContent = event.data;
      this.objectRollUp = this.getContentRollUp(event.rollup);
      this.initPlayer(_.get(this.activeContent, 'identifier'));
    }
  }

  private setTelemetryStartEndData() {
    const deviceInfo = this.deviceDetectorService.getDeviceInfo();
    let cData = [];
    if (this.contentType) {
      cData = this.telemetryCdata;
    }
    setTimeout(() => {
      this.telemetryCourseStart = {
        context: {
          env: this.route.snapshot.data.telemetry.env,
          cdata: cData
        },
        object: {
          id: this.collectionId,
          type: this.contentType,
          ver: '1.0',
        },
        edata: {
          type: this.route.snapshot.data.telemetry.type,
          pageid: this.route.snapshot.data.telemetry.pageid,
          mode: 'play',
          uaspec: {
            agent: deviceInfo.browser,
            ver: deviceInfo.browser_version,
            system: deviceInfo.os_version ,
            platform: deviceInfo.os,
            raw: deviceInfo.userAgent
          }
        }
      };
    }, 50);
    this.telemetryCourseEndEvent = {
      object: {
        id: this.collectionId,
        type: this.contentType,
        ver: '1.0',
      },
      context: {
        env: this.route.snapshot.data.telemetry.env,
        cdata: cData
      },
      edata: {
        type: this.route.snapshot.data.telemetry.type,
        pageid: this.route.snapshot.data.telemetry.pageid,
        mode: 'play'
      }
    };
    if (!this.contentType) {
      this.triggerTelemetryErrorEvent(404, 'contentType field unavailable');
    }
  }

  /**
  * @param  {String} id - Accepts content id
  * @returns object
  * @description Function to get the content object
  * @since release-3.1.0
  */
  setActiveContent(id: string) {
    if (this.collectionData && this.collectionData.children) {
      const flattenDeepContents = this.flattenDeep(this.collectionData.children);
      return this.findContent(flattenDeepContents, id);
    }
  }

  /**
  * @param  {array} contents - Accepts contents hierarchy
  * @returns object
  * @description Function to get all childrens
  * @since release-3.1.0
  */
  private flattenDeep(contents) {
    if (contents) {
      return contents.reduce((acc, val) => {
        if (val.children) {
          acc.push(val);
          return acc.concat(this.flattenDeep(val.children));
        } else {
          return acc.concat(val);
        }
      }, []);
    }
  }

  /**
  * @param  {object} contents - Accepts contents flatten object
  * @param  {String} id - Accepts content id
  * @returns object
  * @description Function to get the contents object which matches the content id
  * @since release-3.1.0
  */
  private findContent(contents, id: string) {
    return contents.find((content) => content.mimeType !== 'application/vnd.ekstep.content-collection' && content.identifier === id);
  }
  setTelemetryInteractData() {
    this.tocTelemetryInteractEdata = {
      id: 'library-toc',
      type: 'click',
      pageid: this.pageId
    };
  }
  tocCardClickHandler(event) {
    this.setTelemetryInteractData();
    if (!this.isMobile && this.activeContent) {
      this.isMobile = true;
    }
    this.callinitPlayer(event);
  }
  tocChapterClickHandler(event) {
    if (this.isSelectChapter) {
      this.isSelectChapter =  false;
    }
    this.callinitPlayer(event);
  }

  triggerTelemetryErrorEvent (status, message) {
    const stacktrace = {
      message: message,
      type: this.route.snapshot.data.telemetry.type,
      pageid: this.route.snapshot.data.telemetry.pageid,
      collectionId: this.collectionId,
      subtype: this.route.snapshot.data.telemetry.subtype,
      url: this.userService.slug ? '/' + this.userService.slug + this.router.url : this.router.url
    };
    const telemetryErrorData = this.getTelemetryErrorData(stacktrace);
    this.telemetryService.error(telemetryErrorData);
  }

  getTelemetryErrorData(stacktrace) {
    return {
      context: { env: this.route.snapshot.data.telemetry.env },
      object: {
        id: this.collectionId,
        type: this.contentType || '',
        ver: '1.0',
      },
      edata: {
        err: status.toString(),
        errtype: 'SYSTEM',
        stacktrace: JSON.stringify(stacktrace)
      }
    };
  }

  getContentRollUp(rollup: string[]) {
    const objectRollUp = {};
    if (rollup) {
      for (let i = 0; i < rollup.length; i++ ) {
        objectRollUp[`l${i + 1}`] = rollup[i];
    }
    }
    return objectRollUp;
  }

  showChapter() {
    this.isSelectChapter = this.isSelectChapter ? false : true;
  }
}
