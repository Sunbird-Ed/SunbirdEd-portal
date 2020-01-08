import { ContentManagerService, ConnectionService } from '@sunbird/offline';
import * as TreeModel from 'tree-model';
import { map, mergeMap, catchError, takeUntil } from 'rxjs/operators';
import { Component, OnInit, OnDestroy, Output } from '@angular/core';
import { PublicPlayerService } from '@sunbird/public';
import { Observable, Subscription, Subject } from 'rxjs';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import {
  WindowScrollService, ToasterService, ILoaderMessage, PlayerConfig,
  ICollectionTreeOptions, NavigationHelperService, ResourceService,  ExternalUrlPreviewService, ConfigService,
  ContentUtilsServiceService, UtilService
} from '@sunbird/shared';
import { CollectionHierarchyAPI } from '@sunbird/core';
import * as _ from 'lodash-es';
@Component({
  selector: 'app-toc-page',
  templateUrl: './toc-page.component.html',
  styleUrls: ['./toc-page.component.scss']
})
export class TocPageComponent implements OnInit, OnDestroy {
  mimeTypeFilters = ['all', 'video', 'interaction', 'docs'];
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
  constructor(public playerService: PublicPlayerService, private configService: ConfigService, public activatedRoute: ActivatedRoute,
    public router: Router, public resourceService: ResourceService, private contentUtilsService: ContentUtilsServiceService,
    public externalUrlPreviewService: ExternalUrlPreviewService,
    public contentManagerService: ContentManagerService,
    public toasterService: ToasterService) { }

  ngOnInit() {
    this.contentType = _.get(this.activatedRoute, 'snapshot.queryParams.contentType');
    this.dialCode = _.get(this.activatedRoute, 'snapshot.queryParams.dialCode');
    this.getContent();
    this.contentManagerService.downloadListEvent.pipe(takeUntil(this.unsubscribe$)).subscribe((data) => {
      this.checkDownloadStatus(data);
    });
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
    console.log('tocCardClickHandler', event);
    if (event.data.identifier !== _.get(this.activeContent, 'identifier')) {
      this.isContentPresent = true;
      this.activeContent = event.data;
      this.OnPlayContent(this.activeContent, true);
    }

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
    this.activeMimeTypeFilter = event.data.value;
  }
  deleteContent(event) {
    this.contentDeleted = event;
  }
  showNoContent(event) {
    console.log('eveveev', event);
    if (event.message === 'No Content Available') {
      this.isContentPresent = false;
    }
  }
  ngOnDestroy() {
    if (this.subsrciption) {
      this.subsrciption.unsubscribe();
    }
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
