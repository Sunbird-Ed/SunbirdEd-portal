
import { map, catchError, first, mergeMap, takeUntil } from 'rxjs/operators';
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { PublicPlayerService } from './../../../../services';
import { Observable, Subscription, Subject } from 'rxjs';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import {
  WindowScrollService, ToasterService, ILoaderMessage, PlayerConfig,
  ICollectionTreeOptions, NavigationHelperService, ResourceService,  ExternalUrlPreviewService, ConfigService,
  ContentUtilsServiceService, UtilService
} from '@sunbird/shared';
import { CollectionHierarchyAPI, ContentService } from '@sunbird/core';
import * as _ from 'lodash-es';
import { IInteractEventObject, IInteractEventEdata, IImpressionEventInput, IEndEventInput, IStartEventInput } from '@sunbird/telemetry';
import * as TreeModel from 'tree-model';
import { ContentManagerService } from '@sunbird/offline';
import { environment } from '@sunbird/environment';
@Component({
  selector: 'app-public-collection-player',
  templateUrl: './public-collection-player.component.html'
})
export class PublicCollectionPlayerComponent implements OnInit, OnDestroy, AfterViewInit {
  /**
	 * telemetryImpression
	*/
  telemetryImpression: IImpressionEventInput;
  telemetryContentImpression: IImpressionEventInput;
  public queryParams: any;
  public collectionData: object;

  public route: ActivatedRoute;

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
  isOffline: boolean = environment.isOffline;
  public unsubscribe$ = new Subject<void>();

  constructor(contentService: ContentService, route: ActivatedRoute, playerService: PublicPlayerService,
    windowScrollService: WindowScrollService, router: Router, public navigationHelperService: NavigationHelperService,
    public resourceService: ResourceService, private activatedRoute: ActivatedRoute, private deviceDetectorService: DeviceDetectorService,
    public externalUrlPreviewService: ExternalUrlPreviewService, private configService: ConfigService,
    public toasterService: ToasterService, private contentUtilsService: ContentUtilsServiceService,
    public contentManagerService: ContentManagerService,
    public utilService: UtilService) {
    this.contentService = contentService;
    this.route = route;
    this.playerService = playerService;
    this.windowScrollService = windowScrollService;
    this.router = router;
    this.router.onSameUrlNavigation = 'ignore';
    this.collectionTreeOptions = this.configService.appConfig.collectionTreeOptions;
    this.playerOption = {
      showContentRating: true
    };
  }
  ngOnInit() {
    this.contentType = _.get(this.activatedRoute, 'snapshot.queryParams.contentType');
    this.dialCode = _.get(this.activatedRoute, 'snapshot.queryParams.dialCode');
    this.getContent();
    this.deviceDetector();
    this.setTelemetryData();

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
    this.telemetryInteractObject = {
      id: this.activatedRoute.snapshot.params.collectionId,
      type: this.contentType,
      ver: '1.0'
    };
    this.playerTelemetryInteractObject = { ...this.telemetryInteractObject };

  }

  ngAfterViewInit () {
    this.pageLoadDuration = this.navigationHelperService.getPageLoadTime();
    setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: this.route.snapshot.data.telemetry.env,
          cdata: [{id: this.activatedRoute.snapshot.params.collectionId, type: this.contentType}]
        },
        object: {
          id: this.activatedRoute.snapshot.params.collectionId,
          type: this.contentType,
          ver: '1.0'
        },
        edata: {
          type: this.route.snapshot.data.telemetry.type,
          pageid: this.route.snapshot.data.telemetry.pageid,
          uri: this.router.url,
          subtype: this.route.snapshot.data.telemetry.subtype,
          duration: this.pageLoadDuration
        }
      };
    });
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

  setTelemetryContentImpression (data) {
    this.telemetryContentImpression = {
      context: {
        env: this.route.snapshot.data.telemetry.env
      },
      edata: {
        type: this.route.snapshot.data.telemetry.env,
        pageid: this.route.snapshot.data.telemetry.env,
        uri: this.router.url
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
      mergeMap((params) => {
        this.collectionId = params.collectionId;
        this.telemetryCdata = [{id: this.collectionId, type: this.contentType}];
        this.setTelemetryData();
        this.setTelemetryStartEndData();
        return this.getCollectionHierarchy(params.collectionId);
      }), )
      .subscribe((data) => {
        this.collectionTreeNodes = data;
        this.loader = false;
        this.route.queryParams.subscribe((queryParams) => {
          this.queryParams = { ...queryParams};
          this.contentId = queryParams.contentId;
          this.dialCode = queryParams.dialCode;
          if (this.contentId) {
            const content = this.findContentById(data, this.contentId);
            this.playerContent = _.get(content, 'model');
            if (this.isOffline && _.isEqual(_.get(this.collectionData, 'downloadStatus'), 'DOWNLOADED')) {
              this.playerContent['downloadStatus'] = this.resourceService.messages.stmsg.m0139;
            }
            if (content) {
              this.objectRollUp = this.contentUtilsService.getContentRollup(content);
              this.OnPlayContent({ title: _.get(content, 'model.name'), id: _.get(content, 'model.identifier') }, true);
            } else {
              // show toaster error
            }
          } else {
            this.closeContentPlayer();
          }
        });
        this.parseChildContent(this.collectionTreeNodes);
      }, (error) => {
        this.toasterService.error(this.resourceService.messages.fmsg.m0004); // need to change message
        this.router.navigate(['/explore']);
      });
  }
  private getCollectionHierarchy(collectionId: string): Observable<{ data: CollectionHierarchyAPI.Content }> {
    const inputParams = {params: this.configService.appConfig.CourseConsumption.contentApiQueryParams};
    return this.playerService.getCollectionHierarchy(collectionId, inputParams).pipe(
      map((response) => {
        this.collectionData = response.result.content;
        this.collectionTitle = _.get(response, 'result.content.name') || 'Untitled Collection';
        this.badgeData = _.get(response, 'result.content.badgeAssertions');
        return { data: response.result.content };
      }));
  }
  closeCollectionPlayer() {
    if (this.dialCode) {
      sessionStorage.setItem('singleContentRedirect', 'singleContentRedirect');
      this.router.navigate(['/get/dial/', this.dialCode]);
    } else {
      if (this.isOffline) {
       const  previousUrl =  this.navigationHelperService.getPreviousUrl();
       if (Boolean(_.includes(previousUrl.url, '/play/collection/'))) {
        return this.router.navigate(['/']);
       }
       // tslint:disable-next-line: max-line-length
       previousUrl.queryParams ? this.router.navigate([previousUrl.url], {queryParams: previousUrl.queryParams}) : this.router.navigate([previousUrl.url]);
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

  private setTelemetryStartEndData() {
    const deviceInfo = this.deviceDetectorService.getDeviceInfo();
    setTimeout(() => {
      this.telemetryCourseStart = {
        context: {
          env: this.route.snapshot.data.telemetry.env,
          cdata: this.telemetryCdata
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
        cdata: this.telemetryCdata
      },
      edata: {
        type: this.route.snapshot.data.telemetry.type,
        pageid: this.route.snapshot.data.telemetry.pageid,
        mode: 'play'
      }
    };
  }

}
