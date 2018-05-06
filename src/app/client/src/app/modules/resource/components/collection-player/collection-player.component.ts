import { Component, OnInit } from '@angular/core';
import { CoursesService, PlayerService } from '@sunbird/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import * as _ from 'lodash';
import { WindowScrollService, RouterNavigationService, ILoaderMessage } from '../../../shared';

@Component({
  selector: 'app-collection-player',
  templateUrl: './collection-player.component.html',
  styleUrls: ['./collection-player.component.css']
})
export class CollectionPlayerComponent implements OnInit {

  private route: ActivatedRoute;

  public showPlayer: Boolean = false;

  private collectionId: string;

  private contentId: string;

  private courseService: CoursesService;

  public collectionTreeNodes: any;

  public collectionTitle: string;

  public contentTitle: string;

  public playerConfig: Observable<any>;

  private playerService: PlayerService;

  private windowScrollService: WindowScrollService;

  private router: Router;

  public loader: Boolean = true;

  public serviceUnavailable: Boolean = false;

  public loaderMessage: ILoaderMessage = {
    headerMessage: 'Please wait...',
    loaderMessage: 'Fetching content details!'
  };

  public collectionTreeOptions: any = {
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

  constructor(courseService: CoursesService, route: ActivatedRoute, playerService: PlayerService,
    windowScrollService: WindowScrollService, router: Router) {
    this.courseService = courseService;
    this.route = route;
    this.playerService = playerService;
    this.windowScrollService = windowScrollService;
    this.router = router;
    this.router.onSameUrlNavigation = 'ignore';
  }

  ngOnInit() {
    this.getContent();
  }

  private initPlayer(id: string) {
    this.playerConfig = this.getPlayerConfig(id);
  }

  public playContent(data: any) {
    this.showPlayer = true;
    this.contentTitle = data.title;
    this.initPlayer(data.id);
  }

  private navigateToContent(id: string) {
    const navigationExtras: NavigationExtras = {
      queryParams: { 'contentId': id },
      relativeTo: this.route
    };
    this.router.navigate([], navigationExtras);
  }

  private getPlayerConfig(contentId: string): Observable<any> {
    return this.playerService.getPlayerConfig(contentId);
  }

  private findContentById(collection: any, id: string) {
    const model = new TreeModel();
    return model.parse(collection.data).first((node) => {
      return node.model.identifier === id;
    });
  }

  private OnPlayContent(content: { title: string, id: string }) {
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

  private navigateToErrorPage() {
    this.router.navigate(['/error']);
  }

  private getContent() {
    const subscription = Observable.combineLatest(this.route.params, this.route.queryParams,
      (params, qparams) => {
        this.collectionId = params.id;
        this.contentId = qparams.contentId;
        return this.collectionId;
      })
      .flatMap((collectionId) => this.getCollectionHierarchy(collectionId))
      .do((collection) => {
        if (this.contentId) {
          const content = this.findContentById(collection, this.contentId);
          if (content) {
            this.OnPlayContent({ title: content.model.name, id: content.model.identifier });
          } else {
            this.navigateToErrorPage();
          }
        }
      })
      .subscribe((data) => {
        this.collectionTreeNodes = data;
        this.loader = false;
        subscription.unsubscribe();
      }, (error) => {
        const responseCode = _.get(error, 'error.responseCode');
        if (responseCode === 'RESOURCE_NOT_FOUND') {
          this.navigateToErrorPage();
        } else if (responseCode === 'SERVER_ERROR') {
          this.loader = false;
          this.serviceUnavailable = true;
        }
        console.log('error when fetching collection content', error);
        return error;
      });
  }

  private getCollectionHierarchy(contentId: string): Observable<any> {
    return this.courseService.getCollectionHierarchy(contentId)
      .map((response) => {
        this.collectionTitle = _.get(response, 'result.content.name') || 'Untitled Collection';
        return { data: response.result.content };
      });
  }
}
