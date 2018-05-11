import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlayerService, CollectionHierarchyAPI, ContentService } from '@sunbird/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import * as _ from 'lodash';
import { WindowScrollService, RouterNavigationService, ILoaderMessage, PlayerConfig,
  ICollectionTreeOptions } from '@sunbird/shared';
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

  public serviceUnavailable: Boolean = false;

  private subsrciption: Subscription;

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

  constructor(contentService: ContentService, route: ActivatedRoute, playerService: PlayerService,
    windowScrollService: WindowScrollService, router: Router) {
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
    if (this.subsrciption) {
      this.subsrciption.unsubscribe();
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
      setTimeout(() => {
        this.windowScrollService.smoothScroll('app-player-collection-renderer');
      }, 10);
    } else {
      throw new Error(`unbale to play collection content for ${this.collectionId}`);
    }
  }

  private navigateToErrorPage(): void {
    this.router.navigate(['/error']);
  }

  private getContent(): void {
    this.subsrciption = Observable.combineLatest(this.route.params, this.route.queryParams,
      (params, qparams) => {
        this.collectionId = params.collectionId;
        this.contentId = qparams.contentId;
        return this.collectionId;
      })
      .first()
      .flatMap((collectionId) => this.getCollectionHierarchy(collectionId))
      .do((collection) => {
        if (this.contentId) {
          const content = this.findContentById(collection, this.contentId);
          if (content) {
            this.OnPlayContent({ title: _.get(content, 'model.name'), id: _.get(content, 'model.identifier') });
          } else {
            this.navigateToErrorPage();
          }
        }
      })
      .subscribe((data) => {
        this.collectionTreeNodes = data;
        this.loader = false;
      }, (error) => {
        const responseCode = _.get(error, 'error.responseCode');
        if (responseCode === 'RESOURCE_NOT_FOUND') {
          this.navigateToErrorPage();
        } else if (responseCode === 'SERVER_ERROR') {
          this.loader = false;
          this.serviceUnavailable = true;
        }
        console.log('error when fetching collection content', (<Error>error).stack);
        return error;
      });
  }

  private getCollectionHierarchy(contentId: string): Observable<{data: CollectionHierarchyAPI.Content }> {
    return this.playerService.getCollectionHierarchy(contentId)
      .map((response) => {
        this.collectionTitle = _.get(response, 'result.content.name') || 'Untitled Collection';
        return { data: response.result.content };
      });
  }
}
