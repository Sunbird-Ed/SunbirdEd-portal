import { Component, OnInit, OnDestroy } from '@angular/core';
import { ResourceService, ToasterService, ConfigService } from '@sunbird/shared';
import { timer, Subject, combineLatest } from 'rxjs';
import { switchMap, map, filter, takeUntil } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { ContentManagerService, ElectronDialogService } from '../../services';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-content-manager',
  templateUrl: './content-manager.component.html',
  styleUrls: ['./content-manager.component.scss']
})
export class ContentManagerComponent implements OnInit, OnDestroy {

  contentResponse: any = [];
  isOpen = true;
  callContentList = false;
  callContentListTimer = false;
  contentStatusObject = {};
  subscription: any;
  public unsubscribe$ = new Subject<void>();
  localStatusArr = ['inProgress', 'inQueue', 'resume', 'resuming', 'pausing', 'canceling'];
  cancelId: string;
  apiCallTimer = timer(1000, 3000).pipe(filter(data => !data || (this.callContentList)));
  apiCallSubject = new Subject();
  completedCount: number;
  deletedContents: string [] = [];
  localContentData: any = [];
  constructor(public contentManagerService: ContentManagerService,
    public resourceService: ResourceService, public toasterService: ToasterService,
    public electronDialogService: ElectronDialogService,
    public configService: ConfigService,
    public activatedRoute: ActivatedRoute,
    public router: Router) {
    this.getList();
    document.addEventListener('content:import', (event) => {
      this.isOpen = true;
      this.apiCallSubject.next();
    });
  }

  ngOnInit() {
    this.contentManagerService.deletedContent.pipe(takeUntil(this.unsubscribe$)).subscribe((data: any) => {
      if (_.get(data, 'identifier')) {
        this.deletedContents.push(data.identifier);
        this.removeDeletedContentInList();
      }
    });
    // Call download list initially
    this.apiCallSubject.next();

    // Call content list when clicked on add to library
    this.contentManagerService.downloadEvent
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        this.isOpen = true;
        this.apiCallSubject.next();
      });
  }

  removeDeletedContentInList() {
    this.contentResponse = _.filter(this.contentResponse, (o) => {
      return !_.includes(this.deletedContents, o.contentId);
    });
  }

  removeDeleteId() {
    _.filter(this.contentResponse, (o) => {
      if (_.includes(this.deletedContents, o.contentId) && o.status !== 'completed') {
        _.remove(this.deletedContents, (n) => {
          return n === o.contentId;
        });
      }
    });
    this.removeDeletedContentInList();
  }

  getList() {
    combineLatest(this.apiCallTimer, this.apiCallSubject, (data1, data2) => true)
      .pipe(filter(() => this.isOpen), switchMap(() => this.contentManagerService.getContentList()),
        map((resp: any) => {
          this.callContentList = false;
          let completedCount = 0;
          _.forEach(_.get(resp, 'result.response.contents'), (value) => {
            const data = this.contentStatusObject[value.id];
            if (data) { value.status = data.currentStatus; }
            if (_.includes(this.localStatusArr, value.status)) {
              this.callContentList = true;
            }
            if (value.status === 'completed') {
              completedCount += 1;
            }
          });
          if ((completedCount > this.completedCount) && this.completedCount !== undefined) {
            this.contentManagerService.completeEvent.emit();
          }
          this.completedCount = completedCount;
          return _.get(resp, 'result.response.contents');
        })).subscribe((apiResponse: any) => {

          if (apiResponse.length >= this.localContentData.length) {
            this.localContentData = apiResponse;
          } else if (this.localContentData.length > apiResponse.length) {
            this.callContentList = true;
          }
          this.contentResponse = _.filter(this.localContentData, (o) => {
            return o.status !== 'canceled';
          });
          this.contentManagerService.emitDownloadListEvent(this.localContentData);
        this.removeDeleteId();
        });
  }

  contentManagerActions(type: string, action: string, id: string) {
    // Unique download/import Id
    switch (`${action.toUpperCase()}_${type.toUpperCase()}`) {
      case 'PAUSE_IMPORT':
        this.pauseImportContent(id);
        break;
      case 'RESUME_IMPORT':
        this.resumeImportContent(id);
        break;
      case 'CANCEL_IMPORT':
        this.cancelImportContent(id);
        break;
      case 'RETRY_IMPORT':
        this.retryImportContent(id);
        break;
      case 'PAUSE_DOWNLOAD':
        this.pauseDownloadContent(id);
        break;
      case 'RESUME_DOWNLOAD':
        this.resumeDownloadContent(id);
        break;
      case 'CANCEL_DOWNLOAD':
        this.cancelDownloadContent(id);
        break;
      case 'RETRY_DOWNLOAD':
        this.retryDownloadContent(id);
        break;
    }
  }

  updateLocalStatus(contentData, currentStatus) {
    this.contentStatusObject[contentData.id] = {
      currentStatus: currentStatus,
      previousState: contentData.status
    };
    const data = _.find(this.contentResponse, { id: contentData.id });
    data.status = currentStatus;
  }

  private getSubscription(id) {
    const _this = this;
    return ({
      next(apiResponse: any) {
        _this.deleteLocalContentStatus(id);
        _this.apiCallSubject.next();
      },
      error(err) {
        _this.deleteLocalContentStatus(id);
        _this.toasterService.error(_this.resourceService.messages.fmsg.m0097);
        _this.apiCallSubject.next();
      }
    });
  }

  pauseDownloadContent(id) {
    this.contentManagerService.pauseDownloadContent(id).pipe(takeUntil(this.unsubscribe$)).subscribe(this.getSubscription(id));
  }

  resumeDownloadContent(id) {
    this.contentManagerService.resumeDownloadContent(id).pipe(takeUntil(this.unsubscribe$)).subscribe(this.getSubscription(id));
  }

  cancelDownloadContent(id) {
    this.contentManagerService.cancelDownloadContent(id).pipe(takeUntil(this.unsubscribe$)).subscribe(this.getSubscription(id));
  }

  retryDownloadContent(id) {
    this.contentManagerService.retryDownloadContent(id).pipe(takeUntil(this.unsubscribe$)).subscribe(this.getSubscription(id));
  }

  pauseImportContent(id) {
    this.contentManagerService.pauseImportContent(id).pipe(takeUntil(this.unsubscribe$)).subscribe(this.getSubscription(id));
  }

  resumeImportContent(id) {
    this.contentManagerService.resumeImportContent(id).pipe(takeUntil(this.unsubscribe$)).subscribe(this.getSubscription(id));
  }

  cancelImportContent(id) {
    this.contentManagerService.cancelImportContent(id).pipe(takeUntil(this.unsubscribe$)).subscribe(this.getSubscription(id));
  }

  retryImportContent(id) {
    this.contentManagerService.retryImportContent(id).pipe(takeUntil(this.unsubscribe$)).subscribe(this.getSubscription(id));
  }

  deleteLocalContentStatus(id) {
    delete this.contentStatusObject[id];
  }

  getContentPercentage(progressSize, totalSize) {
    return (progressSize / totalSize) * 100;
  }

  openContent(contentId, mimeType, status) {
    if (status === 'completed') {
      if (mimeType === this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.collection) {
        this.router.navigate(['play/collection', contentId]);
      } else {
        this.router.navigate(['play/content', contentId]);
      }
    }
  }

  getTelemetryInteractData() {
    const pageId = _.get(this.activatedRoute, 'snapshot.root.firstChild.data.telemetry.env') ||
      _.get(this.activatedRoute, 'snapshot.data.telemetry.env') ||
      _.get(this.activatedRoute.snapshot.firstChild, 'children[0].data.telemetry.env');
    return {
      id: this.isOpen ? 'content-manager-close' : 'content-manager-open',
      type: 'click',
      pageid: pageId
    };
  }

  getButtonsInteractData(id, percentage) {
    const pageId = _.get(this.activatedRoute, 'snapshot.root.firstChild.data.telemetry.env') ||
      _.get(this.activatedRoute, 'snapshot.data.telemetry.env') ||
      _.get(this.activatedRoute.snapshot.firstChild, 'children[0].data.telemetry.env');
    const interactData = {
      id: id,
      type: 'click',
      pageid: pageId
    };

    if (percentage) {
      interactData['extra'] = {
        percentage: percentage
      };
    }
    return interactData;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
