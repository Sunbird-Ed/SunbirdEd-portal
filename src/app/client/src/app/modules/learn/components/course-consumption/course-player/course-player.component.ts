import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlayerService, CollectionHierarchyAPI, ContentService, UserService } from '@sunbird/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import * as _ from 'lodash';
import { WindowScrollService, RouterNavigationService, ILoaderMessage, PlayerConfig,
  ICollectionTreeOptions, NavigationHelperService, ToasterService, ResourceService } from '@sunbird/shared';
import { Subscription } from 'rxjs/Subscription';
import {CourseConsumptionService } from './../../../services';
@Component({
  selector: 'app-course-player',
  templateUrl: './course-player.component.html',
  styleUrls: ['./course-player.component.css']
})
export class CoursePlayerComponent implements OnInit, OnDestroy {

  private route: ActivatedRoute;

  private courseId: string;

  private batchId: string;

  private enrolledCourse = false;

  private contentId: string;

  private contentService: ContentService;

  public collectionTreeNodes: any;

  public collectionTitle: string;

  public contentTitle: string;

  public playerConfig: Observable<any>;

  private windowScrollService: WindowScrollService;

  private router: Router;

  public loader: Boolean = true;

  showError = false;

  private subscription: Subscription;

  enableContentPlayer = false;

  courseHierarchy: any;

  readMore = false;

  contentIds  = [];

  contentDetails = [];

  treeModel: any;
  nextPlaylistItem: any;
  prevPlaylistItem: any;
  noContentToPlay =  'No content to play';
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

  curriculum = [];

  constructor(contentService: ContentService, route: ActivatedRoute,
    private courseConsumptionService: CourseConsumptionService, windowScrollService: WindowScrollService,
    router: Router, public navigationHelperService: NavigationHelperService, private userService: UserService,
    private toasterService: ToasterService, private resourceService: ResourceService) {
    this.contentService = contentService;
    this.route = route;
    this.windowScrollService = windowScrollService;
    this.router = router;
    this.router.onSameUrlNavigation = 'ignore';
  }
  ngOnInit() {
    this.subscription = this.route.params.first()
      .flatMap((params) => {
        this.courseId = params.courseId;
        this.batchId = params.batchId;
        return this.getCourseHierarchy(params.courseId);
      })
      .do((response) => {
        if (this.batchId) {
          this.enrolledCourse = true;
          this.parseChildContent(response.data);
          this.fetchContentStatus(response.data);
          this.subscribeToQueryParam(response.data);
        } else {
          this.parseChildContent(response.data);
        }
      })
      .subscribe((data) => {
        this.collectionTreeNodes = data;
        this.loader = false;
      }, (error) => {
        this.toasterService.error(this.resourceService.messages.emsg.m0005); // need to change message
    });
  }

  public playContent(data: any): void {
    this.enableContentPlayer = true;
    this.contentTitle = data.title;
    this.playerConfig = this.getPlayerConfig(data.id).catch((error) => {
      console.log(`unable to get player config for content ${data.id}`, error);
      return error;
    });
  }

  private navigateToContent(id: string): void {
    const navigationExtras: NavigationExtras = {
      queryParams: { 'contentId': id },
      relativeTo: this.route
    };
    this.router.navigate([], navigationExtras);
  }

  private getPlayerConfig(contentId: string): Observable<PlayerConfig> {
    return this.courseConsumptionService.getConfigByContent(contentId);
  }

  private findContentById(id: string) {
    return this.treeModel.first((node) => {
      return node.model.identifier === id;
    });
  }

  public OnPlayContent(content: { title: string, id: string }) {
    if (content && content.id && this.enrolledCourse) {
      this.contentId = content.id;
      this.setContentNavigators();
      this.navigateToContent(content.id);
      this.playContent(content);
      setTimeout(() => {
        this.windowScrollService.smoothScroll('app-player-collection-renderer');
      }, 10);
    } else {
    }
  }
  setContentNavigators() {
    const index = _.findIndex(this.contentDetails, ['id', this.contentId]);
    this.prevPlaylistItem = this.contentDetails[index - 1];
    this.nextPlaylistItem = this.contentDetails[index + 1];
  }

  subscribeToQueryParam(data) {
    this.route.queryParams.subscribe((queryParams) => {
      this.contentId = queryParams.contentId;
      if (this.contentId) {
        const content = this.findContentById(this.contentId);
        if (content) {
          this.OnPlayContent({ title: _.get(content, 'model.name'), id: _.get(content, 'model.identifier') });
        } else {
          this.toasterService.error(this.resourceService.messages.emsg.m0005); // need to change message
        }
      } else {
        this.closeContentPlayer();
      }
    });
  }
  parseChildContent(tree) {
    const model = new TreeModel();
    const mimeTypeCount = {};
    this.treeModel = model.parse(tree);
    this.treeModel.walk((node) => {
      if (node.model.mimeType !== 'application/vnd.ekstep.content-collection') {
        if (mimeTypeCount[node.model.mimeType]) {
          mimeTypeCount[node.model.mimeType] = + 1;
        } else {
          mimeTypeCount[node.model.mimeType] = 1;
        }
        this.contentDetails.push({id: node.model.identifier, title: node.model.name});
        this.contentIds.push(node.model.identifier);
      }
    });
    console.log('mimeTypeCount', mimeTypeCount);
    _.forEach(mimeTypeCount, (value, key) => {
      this.curriculum.push({mimeType: key, count: value});
    });
    console.log('this.curriculum', this.curriculum);
  }
  fetchContentStatus(data) {
    const req = {
      userId: this.userService.userid,
      courseId: this.courseId,
      contentIds: this.contentIds,
      batchId: this.batchId
    };
    this.courseConsumptionService.getContentStatus(req).subscribe((res) => {
      console.log('res', res);
    });
  }
  public contentProgressEventnew(event) {
    console.log('event', event.detail.telemetryData.eid);
    const eid = event.detail.telemetryData.eid;
    const req1 = {
      userId: event.detail.telemetryData.actor.id,
      contentId: event.detail.telemetryData.object.id,
      courseId: this.courseId,
      batchId: this.batchId,
      status: 0
    };
    if (eid === 'START') {
      req1.status = 1;
      this.courseConsumptionService.updateContentsState(req1).subscribe((updatedRes) => {
        console.log('res', updatedRes);
      });
    } else if (eid === 'END') {
      req1.status = 2;
      this.courseConsumptionService.updateContentsState(req1).subscribe((updatedRes) => {
        console.log('res', updatedRes);
      });
    }
  }
  private getCourseHierarchy(collectionId: string): Observable<{data: CollectionHierarchyAPI.Content }> {
    return this.courseConsumptionService.getCourseHierarchy(collectionId)
      .map((response) => {
        this.courseHierarchy = response;
        return { data: response};
      });
  }
  closeContentPlayer() {
    if (this.enableContentPlayer === true) {
      const navigationExtras: NavigationExtras = {
        relativeTo: this.route
      };
      this.enableContentPlayer = false;
      this.router.navigate([], navigationExtras);
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
