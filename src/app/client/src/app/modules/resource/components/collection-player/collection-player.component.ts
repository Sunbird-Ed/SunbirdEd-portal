import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlayerService, CollectionHierarchyAPI, ContentService, PermissionService, CopyContentService } from '@sunbird/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import * as _ from 'lodash';
import {
  WindowScrollService, RouterNavigationService, ILoaderMessage, PlayerConfig,
  ICollectionTreeOptions, NavigationHelperService, ToasterService, ResourceService, ContentData,
  ContentUtilsServiceService
} from '@sunbird/shared';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-collection-player',
  templateUrl: './collection-player.component.html',
  styleUrls: ['./collection-player.component.css']
})
export class CollectionPlayerComponent implements OnInit, OnDestroy {

  private route: ActivatedRoute;

  public showPlayer: Boolean = false;

  private collectionId: string;

  public collectionStatus: string;

  private contentId: string;

  private contentService: ContentService;

  public collectionTreeNodes: any;

  public collectionTitle: string;

  public contentTitle: string;

  public playerConfig: Observable<any>;

  private playerService: PlayerService;

  private windowScrollService: WindowScrollService;

  private router: Router;

  public loader: Boolean = true;

  public showCopyLoader: Boolean = false;

  private subscription: Subscription;

  private subsrciption: Subscription;
  public contentType: string;
  public mimeType: string;
  public sharelinkModal: boolean;
  public badgeData: Array<object>;
  private closeUrl: any;
  public loaderMessage: ILoaderMessage = {
    headerMessage: 'Please wait...',
    loaderMessage: 'Fetching content details!'
  };
  public collectionData: object;

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

  constructor(contentService: ContentService, route: ActivatedRoute, playerService: PlayerService,
    windowScrollService: WindowScrollService, router: Router, public navigationHelperService: NavigationHelperService,
    private toasterService: ToasterService, private resourceService: ResourceService,
    public permissionService: PermissionService, public copyContentService: CopyContentService,
    public contentUtilsServiceService: ContentUtilsServiceService) {
    this.contentService = contentService;
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
    this.playerConfig = this.getPlayerConfig(id).catch((error) => {
      console.log(`unable to get player config for content ${id}`, error);
      return error;
    });
  }

  public playContent(data: any): void {
    this.showPlayer = true;
    this.contentTitle = data.title;
    this.initPlayer(data.id);
  }

  private navigateToContent(id: string): void {
    const navigationExtras: NavigationExtras = {
      queryParams: { 'contentId': id },
      relativeTo: this.route
    };
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

  public OnPlayContent(content: { title: string, id: string }) {
    if (content && content.id) {
      this.navigateToContent(content.id);
      this.playContent(content);
      this.windowScrollService.smoothScroll('app-player-collection-renderer', 500);
    } else {
      throw new Error(`unbale to play collection content for ${this.collectionId}`);
    }
  }

  private getContent(): void {
    this.subscription = this.route.params
      .first()
      .flatMap((params) => {
        this.collectionId = params.collectionId;
        this.collectionStatus = params.collectionStatus;
        return this.getCollectionHierarchy(params.collectionId);
      })
      .subscribe((data) => {
        this.collectionTreeNodes = data;
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
      }, (error) => {
        this.toasterService.error(this.resourceService.messages.emsg.m0005); // need to change message
      });
  }

  private getCollectionHierarchy(collectionId: string): Observable<{ data: CollectionHierarchyAPI.Content }> {
    const option: any = {};
    if (this.collectionStatus && this.collectionStatus === 'Unlisted') {
      option.params = { mode: 'edit' };
    }
    return this.playerService.getCollectionHierarchy(collectionId, option)
      .map((response) => {
        this.collectionData = response.result.content;
        this.contentType = _.get(response, 'result.content.contentType');
        this.mimeType = _.get(response, 'result.content.mimeType');
        this.collectionTitle = _.get(response, 'result.content.name') || 'Untitled Collection';
        this.badgeData = _.get(response, 'result.content.badgeAssertions');
        return { data: response.result.content };
      });
  }
  closeCollectionPlayer() {
    this.navigationHelperService.navigateToResource();
  }
  closeContentPlayer() {
    this.showPlayer = false;
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
  }
}
