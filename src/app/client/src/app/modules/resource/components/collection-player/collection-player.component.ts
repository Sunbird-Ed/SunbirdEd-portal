
import { mergeMap, first, map, catchError } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlayerService, CollectionHierarchyAPI, PermissionService, CopyContentService } from '@sunbird/core';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import * as _ from 'lodash';
import {
  WindowScrollService, ILoaderMessage, PlayerConfig, ICollectionTreeOptions, NavigationHelperService,
  ToasterService, ResourceService, ContentData, ContentUtilsServiceService, ITelemetryShare
} from '@sunbird/shared';
import { IInteractEventObject, IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';

@Component({
  selector: 'app-collection-player',
  templateUrl: './collection-player.component.html',
  styleUrls: ['./collection-player.component.css']
})
export class CollectionPlayerComponent implements OnInit, OnDestroy {
  /**
	 * telemetryImpression
	*/
  telemetryImpression: IImpressionEventInput;

  telemetryContentImpression: IImpressionEventInput;

  private route: ActivatedRoute;

  public showPlayer: Boolean = false;

  private collectionId: string;

  public collectionStatus: string;

  private contentId: string;

  public collectionTreeNodes: any;

  public collectionTitle: string;

  public contentTitle: string;

  public playerConfig: Observable<any>;

  private playerService: PlayerService;

  private windowScrollService: WindowScrollService;

  private router: Router;

  public loader: Boolean = true;

  public triggerContentImpression = false;

  public showCopyLoader: Boolean = false;
  /**
	 * telemetryShareData
	*/
  telemetryShareData: Array<ITelemetryShare>;

  objectInteract: IInteractEventObject;

  objectContentInteract: IInteractEventObject;

  collectionInteractObject: IInteractEventObject;

  closeIntractEdata: IInteractEventEdata;

  closeContentIntractEdata: IInteractEventEdata;

  private subscription: Subscription;

  public contentType: string;

  public mimeType: string;

  public sharelinkModal: boolean;

  public badgeData: Array<object>;

  public loaderMessage: ILoaderMessage = {
    headerMessage: 'Please wait...',
    loaderMessage: 'Fetching content details!'
  };

  public collectionData: any;

  public collectionTreeOptions: ICollectionTreeOptions = {
    fileIcon: 'fa fa-file-o fa-lg',
    customFileIcon: {
      'video': 'fa fa-file-video-o fa-lg',
      'pdf': 'fa fa-file-pdf-o fa-lg',
      'youtube': 'fa fa-youtube fa-lg fancy_tree_red',
      'H5P': 'fa fa-html5 fa-lg',
      'audio': 'fa fa-file-audio-o fa-lg',
      'ECML': 'fa fa-file-code-o fa-lg',
      'HTML': 'fa fa-html5 fa-lg',
      'collection': 'fa fa-file-archive-o fa-lg',
      'epub': 'fa fa-file-text fa-lg',
      'doc': 'fa fa-file-text fa-lg'
    }
  };
  /**
   * contains link that can be shared
   */
  shareLink: string;
  public treeModel: any;
  public contentDetails = [];
  public nextPlaylistItem: any;
  public prevPlaylistItem: any;

  constructor(route: ActivatedRoute, playerService: PlayerService,
    windowScrollService: WindowScrollService, router: Router, public navigationHelperService: NavigationHelperService,
    private toasterService: ToasterService, private resourceService: ResourceService,
    public permissionService: PermissionService, public copyContentService: CopyContentService,
    public contentUtilsServiceService: ContentUtilsServiceService) {
    this.route = route;
    this.playerService = playerService;
    this.windowScrollService = windowScrollService;
    this.router = router;
    this.router.onSameUrlNavigation = 'ignore';
  }
  ngOnInit() {
    this.getContent();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private initPlayer(id: string): void {
    this.playerConfig = this.getPlayerConfig(id).pipe(map((content) => {
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
          id: content.metadata.identifier,
          type: content.metadata.contentType || content.metadata.resourceType || content,
          ver: content.metadata.pkgVersion ? content.metadata.pkgVersion.toString() : '1.0',
        }
      };
      this.closeContentIntractEdata = {
        id: 'content-close',
        type: 'click',
        pageid: 'collection-player'
      };
      this.objectContentInteract = {
        id: content.metadata.identifier,
        type: content.metadata.contentType || content.metadata.resourceType || 'content',
        ver: content.metadata.pkgVersion ? content.metadata.pkgVersion.toString() : '1.0',
        rollup: { l1: this.collectionId }
        // rollup: this.collectionInteractObject
      };
      this.triggerContentImpression = true;
      return content;
    }), catchError((error) => {
      console.log(`unable to get player config for content ${id}`, error);
      return error;
    }), );
  }

  public playContent(data: any): void {
    this.showPlayer = true;
    this.windowScrollService.smoothScroll('app-player-collection-renderer', 500);
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
      navigationExtras.queryParams = { 'contentId': id };
    } else if (content) {
      navigationExtras.queryParams = { 'contentId': content.id };
    }
    this.router.navigate([], navigationExtras);
  }

  private getPlayerConfig(contentId: string): Observable<PlayerConfig> {
    return this.playerService.getConfigByContent(contentId);
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

  private setContentNavigators() {
    const index = _.findIndex(this.contentDetails, ['id', this.contentId]);
    this.prevPlaylistItem = this.contentDetails[index - 1];
    this.nextPlaylistItem = this.contentDetails[index + 1];
  }

  public OnPlayContent(content: { title: string, id: string }) {
    if (content && content.id) {
      this.navigateToContent(null, content.id);
      this.setContentNavigators();
      this.playContent(content);
    } else {
      throw new Error(`unable to play collection content for ${this.collectionId}`);
    }
  }

  private getContent(): void {
    this.subscription = this.route.params.pipe(
      first(),
      mergeMap((params) => {
        this.collectionId = params.collectionId;
        this.collectionStatus = params.collectionStatus;
        return this.getCollectionHierarchy(params.collectionId);
      }), )
      .subscribe((data) => {
        this.collectionTreeNodes = data;
        this.setTelemetryData();
        this.loader = false;
        this.route.queryParams.subscribe((queryParams) => {
          this.contentId = queryParams.contentId;
          if (this.contentId) {
            const content = this.findContentById(data, this.contentId);
            if (content) {
              this.OnPlayContent({ title: _.get(content, 'model.name'), id: _.get(content, 'model.identifier') });
            } else {
              this.toasterService.error(this.resourceService.messages.emsg.m0005); // need to change message
            }
          } else {
            this.closeContentPlayer();
          }
        });
        this.parseChildContent(this.collectionTreeNodes);
      }, (error) => {
        this.toasterService.error(this.resourceService.messages.emsg.m0005); // need to change message
      });
  }
  setTelemetryData() {
    this.telemetryImpression = {
      context: {
        env: this.route.snapshot.data.telemetry.env
      },
      object: {
        id: this.collectionId,
        type: this.collectionData.contentType,
        ver: this.collectionData.pkgVersion ? this.collectionData.pkgVersion.toString() : '1.0'
      },
      edata: {
        type: this.route.snapshot.data.telemetry.type,
        pageid: this.route.snapshot.data.telemetry.pageid,
        uri: this.router.url,
        subtype: this.route.snapshot.data.telemetry.subtype
      }
    };
    this.closeIntractEdata = {
      id: 'collection-close',
      type: 'click',
      pageid: 'collection-player'
    };
    this.collectionInteractObject = {
      id: this.collectionId,
      type: this.collectionData.contentType,
      ver: this.collectionData.pkgVersion ? this.collectionData.pkgVersion.toString() : '1.0'
    };
  }

  private getCollectionHierarchy(collectionId: string): Observable<{ data: CollectionHierarchyAPI.Content }> {
    const option: any = {};
    if (this.collectionStatus && this.collectionStatus === 'Unlisted') {
      option.params = { mode: 'edit' };
    }
    return this.playerService.getCollectionHierarchy(collectionId, option).pipe(
      map((response) => {
        this.collectionData = response.result.content;
        this.contentType = _.get(response, 'result.content.contentType');
        this.mimeType = _.get(response, 'result.content.mimeType');
        this.collectionTitle = _.get(response, 'result.content.name') || 'Untitled Collection';
        this.badgeData = _.get(response, 'result.content.badgeAssertions');
        return { data: response.result.content };
      }));
  }
  closeCollectionPlayer() {
    this.navigationHelperService.navigateToResource('/resources');
  }
  closeContentPlayer() {
    this.showPlayer = false;
    this.triggerContentImpression = false;
    const navigationExtras: NavigationExtras = {
      relativeTo: this.route
    };
    this.router.navigate([], navigationExtras);
  }

  /**
   * This method calls the copy API service
   * @param {contentData} ContentData Content data which will be copied
   */
  copyContent(contentData: ContentData) {
    this.showCopyLoader = true;
    this.copyContentService.copyContent(contentData).subscribe(
      (response) => {
        this.toasterService.success(this.resourceService.messages.smsg.m0042);
        this.showCopyLoader = false;
      },
      (err) => {
        this.showCopyLoader = false;
        this.toasterService.error(this.resourceService.messages.emsg.m0008);
      });
  }
  onShareLink() {
    this.shareLink = this.contentUtilsServiceService.getPublicShareUrl(this.collectionId, this.mimeType);
    this.setTelemetryShareData(this.collectionData);
  }
  setTelemetryShareData(param) {
    this.telemetryShareData = [{
      id: param.identifier,
      type: param.contentType,
      ver: param.pkgVersion ? param.pkgVersion.toString() : '1.0'
    }];
  }
}
