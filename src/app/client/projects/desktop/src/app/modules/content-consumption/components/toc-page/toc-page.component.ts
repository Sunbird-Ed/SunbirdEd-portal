import { DeviceDetectorService } from 'ngx-device-detector';
import { IImpressionEventInput, TelemetryService } from '@sunbird/telemetry';
import { ContentManagerService, ConnectionService } from '@sunbird/offline';
import { map, mergeMap, takeUntil, filter } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PublicPlayerService } from '@sunbird/public';
import { Observable, Subscription, Subject } from 'rxjs';
import { ActivatedRoute, Router, NavigationExtras, NavigationStart } from '@angular/router';
import {
  WindowScrollService, ToasterService, ILoaderMessage, PlayerConfig,
  ICollectionTreeOptions, NavigationHelperService, ResourceService,  ExternalUrlPreviewService, ConfigService,
  ContentUtilsServiceService, UtilService, OfflineCardService
} from '@sunbird/shared';
import { CollectionHierarchyAPI } from '@sunbird/core';
import * as _ from 'lodash-es';
@Component({
  selector: 'app-toc-page',
  templateUrl: './toc-page.component.html',
  styleUrls: ['./toc-page.component.scss']
})
export class TocPageComponent implements OnInit, OnDestroy {
  mimeTypeFilters = ['all', 'video', 'interactive', 'docs'];
  activeMimeTypeFilter = ['all'];
  activeContent;
  /**
	 * telemetryImpression
	*/
  public queryParams: any;
  public collectionData: object;

  public showPlayer: Boolean = false;

  private collectionId: string;
  private contentType: string ;

  public collectionTreeNodes: any;
  public contentTitle: string;

  public playerConfig: Observable<any>;

  private windowScrollService: WindowScrollService;

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
  /**
   * Page Load Time, used this data in impression telemetry
   */
  public pageLoadDuration: Number;


  collectionTreeOptions: ICollectionTreeOptions;
  public contentHeaderData: any;
  /**
	 * dialCode
	*/
  public dialCode: string;
  playerOption: any;
  public playerContent;
  public unsubscribe$ = new Subject<void>();
  isConnected;
  showUpdate;
  contentDeleted;
  isContentPresent = true;
  telemetryImpression: IImpressionEventInput;
  constructor(public playerService: PublicPlayerService, private configService: ConfigService, public activatedRoute: ActivatedRoute,
    public router: Router, public resourceService: ResourceService, private contentUtilsService: ContentUtilsServiceService,
    public externalUrlPreviewService: ExternalUrlPreviewService,
    public contentManagerService: ContentManagerService,
    private utilService: UtilService,
    public toasterService: ToasterService,
    private navigationHelperService: NavigationHelperService,
    private deviceDetectorService: DeviceDetectorService,
    private connectionService: ConnectionService,
    private offlineCardService: OfflineCardService,
    private telemetryService: TelemetryService) { }

  ngOnInit() {
    this.utilService.emitHideHeaderTabsEvent(true);
    this.contentType = _.get(this.activatedRoute, 'snapshot.queryParams.contentType');
    this.dialCode = _.get(this.activatedRoute, 'snapshot.queryParams.dialCode');
    this.getContent();
    this.contentManagerService.downloadListEvent.pipe(takeUntil(this.unsubscribe$)).subscribe((data) => {
      this.checkDownloadStatus(data);
    });
    this.router.events
    .pipe(filter((event) => event instanceof NavigationStart), takeUntil(this.unsubscribe$))
    .subscribe(x => {this.setPageExitTelemtry(); });
  }

  checkDownloadStatus(downloadListdata) {
    this.collectionData = this.playerService.updateDownloadStatus(downloadListdata, this.collectionData);
  }

  private getContent(): void {
    this.activatedRoute.params.pipe(
      mergeMap((params) => {
        this.collectionId = params.collectionId;
        return this.getCollectionHierarchy(params.collectionId);
      }))
      .subscribe((data) => {
        this.setTelemetryData();
        this.activatedRoute.queryParams.subscribe((queryParams) => {
          this.queryParams = { ...queryParams};
        });
      }, (error) => {
        this.router.navigate(['/']);
      });
  }

  private getCollectionHierarchy(collectionId: string): Observable<{ data: CollectionHierarchyAPI.Content }> {
    const inputParams = {params: this.configService.appConfig.CourseConsumption.contentApiQueryParams};
    return this.playerService.getCollectionHierarchy(collectionId, inputParams).pipe(
      map((response) => {
        this.collectionData = _.get(response, 'result.content');
        this.showUpdate = _.get(this.collectionData, 'desktopAppMetadata.updateAvailable');
        return { data: _.get(response, 'result.content') };
      }));
  }

  tocCardClickHandler(event) {
    if (event.data.identifier !== _.get(this.activeContent, 'identifier')) {
      this.isContentPresent = true;
      this.activeContent = event.data;
      this.objectRollUp = this.getContentRollUp(event.rollup);
      this.OnPlayContent(this.activeContent, true);
      this.logTelemetry('content-inside-collection', this.objectRollUp, this.activeContent);
    }
  }

  logTelemetry(id, rollup?, content?) {
      const interactData = {
        context: {
          env: _.get(this.activatedRoute.snapshot.data.telemetry, 'env') || 'content',
          cdata: []
        },
        edata: {
          id: id,
          type: 'click',
          pageid: _.get(this.activatedRoute.snapshot.data.telemetry, 'pageid') || 'play-collection',
        },
        object: {
          id: content ? _.get(content, 'identifier') : this.collectionId,
          type: content ? _.get(content, 'contentType') :  this.contentType,
          ver: content ? `${_.get(content, 'pkgVersion')}` : `${this.collectionData['pkgVersion']}`,
          rollup: rollup
        }
      };
      this.telemetryService.interact(interactData);
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

  public OnPlayContent(content, isClicked?: boolean) {
    if (content && content.identifier) {
      this.navigateToContent(content);
    } else {
      throw new Error(`unable to play collection content for ${this.collectionId}`);
    }
  }

  private navigateToContent(content): void {
    const id = content.identifier;
    let navigationExtras: NavigationExtras;
    navigationExtras = {
      queryParams: {},
      relativeTo: this.activatedRoute
    };
    this.queryParams['contentId'] = id;
    navigationExtras.queryParams = this.queryParams;
    this.router.navigate([], navigationExtras);
  }

  selectedFilter(event) {
    this.logTelemetry(`filter-${event.data.text}`);
    this.activeMimeTypeFilter = event.data.value;
  }

  showNoContent(event) {
    if (event.message === 'No Content Available') {
      this.isContentPresent = false;
    }
  }

  setTelemetryData() {
    let telemetryCdata;
    if (this.dialCode) {
      telemetryCdata = [{ 'type': 'DialCode', 'id': this.dialCode }];
    }
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env,
        cdata: telemetryCdata || []
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        uri: this.router.url,
        subtype: this.activatedRoute.snapshot.data.telemetry.subtype,
        duration: this.navigationHelperService.getPageLoadTime()
      },
    };
    if (this.collectionData) {
      this.telemetryImpression.object = {
        id: this.collectionData['identifier'],
        type: this.collectionData['contentType'],
        ver: `${this.collectionData['pkgVersion']}` || '1.0',
      };
    }
  }

  setPageExitTelemtry() {
    if (this.collectionData) {
      this.telemetryImpression.object = {
        id: this.collectionData['identifier'],
        type: this.collectionData['contentType'],
        ver: `${this.collectionData['pkgVersion']}` || '1.0',
      };
    }
    this.telemetryImpression.edata.subtype = 'pageexit';
    this.telemetryImpression = Object.assign({}, this.telemetryImpression);
  }

  ngOnDestroy() {
    this.utilService.emitHideHeaderTabsEvent(false);
    if (this.subsrciption) {
      this.subsrciption.unsubscribe();
    }
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
