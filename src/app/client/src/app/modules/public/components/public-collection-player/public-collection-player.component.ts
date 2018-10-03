
import {map, catchError, first, mergeMap} from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PublicPlayerService } from './../../services';
import { Observable ,  Subscription } from 'rxjs';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import {
  WindowScrollService, RouterNavigationService, ILoaderMessage, PlayerConfig,
  ICollectionTreeOptions, NavigationHelperService, ResourceService,  ExternalUrlPreviewService, ConfigService
} from '@sunbird/shared';
import { CollectionHierarchyAPI, ContentService } from '@sunbird/core';
import * as _ from 'lodash';
import { IInteractEventObject, IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';

@Component({
  selector: 'app-public-collection-player',
  templateUrl: './public-collection-player.component.html',
  styleUrls: ['./public-collection-player.component.css']
})
export class PublicCollectionPlayerComponent implements OnInit, OnDestroy {
  /**
	 * telemetryImpression
	*/
  telemetryImpression: IImpressionEventInput;
  public queryParams: any;
  public collectionData: object;

  public route: ActivatedRoute;

  public showPlayer: Boolean = false;

  private collectionId: string;

  private contentId: string;
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

  public loader: Boolean = true;
  public treeModel: any;
  public contentDetails = [];
  public nextPlaylistItem: any;
  public prevPlaylistItem: any;
  public showFooter: Boolean = false;
  public badgeData: Array<object>;
  private subsrciption: Subscription;
  public closeCollectionPlayerInteractEdata: IInteractEventEdata;
  public telemetryInteractObject: IInteractEventObject;
  public loaderMessage: ILoaderMessage = {
    headerMessage: 'Please wait...',
    loaderMessage: 'Fetching content details!'
  };

  public collectionTreeOptions: ICollectionTreeOptions = {
    fileIcon: 'fa fa-file-o fa-lg',
    customFileIcon: {
      'video': 'fa fa-file-video-o fa-lg',
      'pdf': 'fa fa-file-pdf-o fa-lg',
      'youtube': 'fa fa-youtube fa-lg',
      'H5P': 'fa fa-html5 fa-lg',
      'audio': 'fa fa-file-audio-o fa-lg',
      'ECML': 'fa fa-file-code-o fa-lg',
      'HTML': 'fa fa-html5-o fa-lg',
      'collection': 'fa fa-file-archive-o fa-lg',
      'epub': 'fa fa-text-o fa-lg',
      'doc': 'fa fa-text-o fa-lg'
    }
  };
  /**
	 * dialCode
	*/
  public dialCode: string;
  constructor(contentService: ContentService, route: ActivatedRoute, playerService: PublicPlayerService,
    windowScrollService: WindowScrollService, router: Router, public navigationHelperService: NavigationHelperService,
    public resourceService: ResourceService, private activatedRoute: ActivatedRoute, private deviceDetectorService: DeviceDetectorService,
    public externalUrlPreviewService: ExternalUrlPreviewService, private configService: ConfigService) {
    this.contentService = contentService;
    this.route = route;
    this.playerService = playerService;
    this.windowScrollService = windowScrollService;
    this.router = router;
    this.router.onSameUrlNavigation = 'ignore';
  }
  ngOnInit() {
    this.getContent();
    this.setInteractEventData();
    this.deviceDetector();
  }
  setTelemetryData() {
    this.telemetryImpression = {
      context: {
        env: this.route.snapshot.data.telemetry.env
      },
      object: {
        id: this.collectionId,
        type: 'collection',
        ver: '1.0'
      },
      edata: {
        type: this.route.snapshot.data.telemetry.type,
        pageid: this.route.snapshot.data.telemetry.pageid,
        uri: this.router.url,
        subtype: this.route.snapshot.data.telemetry.subtype
      }
    };
  }

  ngOnDestroy() {
    if (this.subsrciption) {
      this.subsrciption.unsubscribe();
    }
  }

  private initPlayer(id: string): void {
    this.playerConfig = this.getPlayerConfig(id).pipe(catchError((error) => {
      return error;
    }));
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
      first(),
      mergeMap((params) => {
        this.collectionId = params.collectionId;
        this.setTelemetryData();
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
            if (content) {
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
        // toaster error
      });
  }

  private getCollectionHierarchy(collectionId: string): Observable<{ data: CollectionHierarchyAPI.Content }> {
    return this.playerService.getCollectionHierarchy(collectionId).pipe(
      map((response) => {
        this.collectionData = response.result.content;
        this.collectionTitle = _.get(response, 'result.content.name') || 'Untitled Collection';
        this.badgeData = _.get(response, 'result.content.badgeAssertions');
        return { data: response.result.content };
      }));
  }
  closeCollectionPlayer() {
    this.navigationHelperService.navigateToPreviousUrl('/explore');
  }
  closeContentPlayer() {
    this.showPlayer = false;
    delete this.queryParams.contentId;
    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      queryParams: this.queryParams
    };
    this.router.navigate([], navigationExtras);
  }
  setInteractEventData() {
    this.closeCollectionPlayerInteractEdata = {
      id: 'close-collection',
      type: 'click',
      pageid: 'public'
    };
    this.telemetryInteractObject = {
      id: this.activatedRoute.snapshot.params.collectionId,
      type: 'collection',
      ver: '1.0'
    };
  }
  deviceDetector() {
    const deviceInfo = this.deviceDetectorService.getDeviceInfo();
    if ( deviceInfo.device === 'android' || deviceInfo.os === 'android') {
      this.showFooter = true;
    }
  }
}
