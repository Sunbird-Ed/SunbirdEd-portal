import { Component, OnInit, OnDestroy } from '@angular/core';
import { ResourceService, ToasterService, ConfigService, NavigationHelperService } from '@sunbird/shared';
import { timer, Subject, combineLatest } from 'rxjs';
import { switchMap, map, filter, takeUntil } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { ContentManagerService, ElectronDialogService } from '../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { ILogEventInput, TelemetryService } from '@sunbird/telemetry';
import { UserService } from '../../../../../core/services/user/user.service';

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
  handledFailedList = [];
  unHandledFailedList = [];
  deletedContents: string [] = [];
  isWindows = false;
  suggestedDrive: string;
  drives: [];
  visibility = true;

  constructor(public contentManagerService: ContentManagerService,
    public resourceService: ResourceService, public toasterService: ToasterService,
    public electronDialogService: ElectronDialogService,
    public configService: ConfigService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private telemetryService: TelemetryService, 
    public navigationHelperService: NavigationHelperService,
    public userService: UserService
    ) {
    this.getList();
    document.addEventListener('content:import', (event) => {
      this.isOpen = true;
      this.apiCallSubject.next();
    });
  }

  ngOnInit() {
      // Subscribing to delete event to remove it from content manager list
      this.contentManagerService.deletedContent.pipe(takeUntil(this.unsubscribe$)).subscribe((deletedIds: string[]) => {
        this.isOpen = true;
        this.apiCallSubject.next();
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

      this.contentManagerService.downloadFailEvent
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(popupInfo => {
        this.unHandledFailedList.push({name: popupInfo.failedContentName});
        this.isWindows = popupInfo.isWindows;

        /* istanbul ignore else */
        if (popupInfo.isWindows && popupInfo.drives) {
          this.drives = popupInfo.drives;
        }
      });

    this.navigationHelperService.handleCMvisibility.
      pipe(takeUntil(this.unsubscribe$)).subscribe(hideCM => {
        this.visibility = !hideCM;
      });
  }

  getList() {
    // tslint:disable-next-line: deprecation
    combineLatest(this.apiCallTimer, this.apiCallSubject, (data1, data2) => true)
      .pipe(takeUntil(this.unsubscribe$), filter(() => this.isOpen), switchMap(() => this.contentManagerService.getContentList()),
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
          this.handleInsufficientMemoryError(apiResponse);
          this.contentResponse = _.filter(apiResponse, (o) => {
            if (o.status !== 'canceled' && o.addedUsing === 'download') {
              const statusMsg = this.getContentStatus(o.contentDownloadList);
              o.status = statusMsg ? statusMsg : o.status;
            }
            return o.status !== 'canceled';
          });
        });
  }

  getContentStatus(content) {
    const notCompleted = _.find(content, c => {
      return (!_.includes(['COMPLETE', 'EXTRACT'], c.step));
    });
    if (!notCompleted) {
      const extracting = _.find(content, c => {
        return c.step === 'EXTRACT';
      });
      if (extracting) { return 'extract'; }
    }
  }

  async handleInsufficientMemoryError(allContentList) {
    const noSpaceContentList = _.filter(allContentList, (content) =>
      content.failedCode === 'LOW_DISK_SPACE' && content.status === 'failed');

    if (noSpaceContentList.length) {
      const failedContent = _.differenceBy(noSpaceContentList, this.handledFailedList, 'id');

      if (failedContent[0]) {
        this.logTelemetry(failedContent[0]);
      }

      const popupInfo: any = {
        failedContentName: failedContent,
      };

      try {
        const response: any = await this.contentManagerService.getSuggestedDrive(popupInfo);
        this.unHandledFailedList = response.failedContentName;
        this.isWindows = response.isWindows;

        if (response.isWindows && response.drives) {
          this.drives = response.drives;
        }
      } catch (error) {
        this.unHandledFailedList = popupInfo.failedContentName;
      }
    }
  }

  removeFromHandledFailedList(id) {
    this.handledFailedList = _.filter(this.handledFailedList, (content) => content.id !== id);
  }

  closeModal(event: any) {
    this.handledFailedList.push(...this.unHandledFailedList);
    this.unHandledFailedList = [];
    this.isWindows = false;

    /* istanbul ignore else */
    if (event.selectedDrive) {
      const req = {
        request: {
          path: event.selectedDrive.name
        }
      };

      this.contentManagerService.changeContentLocation(req).subscribe(response => {
        this.toasterService.success(this.resourceService.messages.stmsg.contentLocationChanged);
      }, error => {
        this.toasterService.error(this.resourceService.messages.fmsg.m0097);
      });
    }
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
        _this.removeFromHandledFailedList(id);
      },
      error(err) {
        _this.deleteLocalContentStatus(id);
        _this.toasterService.error(_this.resourceService.messages.fmsg.m0097);
        _this.apiCallSubject.next();
        _this.removeFromHandledFailedList(id);
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

  openContent(data) {
    const { contentId, mimeType, status } = data;
    if (status === 'completed') {
      let path;
      if (mimeType === this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.collection) {
        if (typeof _.get(data, 'trackable') === 'string') {
          try {
            data.trackable = JSON.parse(data.trackable);
          } catch (error) {
            console.error('Error while json parse', error);
          }
        }

        if (_.toUpper(_.get(data, 'contentType')) === 'COURSE' || _.toUpper(_.get(data, 'trackable.enabled')) === 'YES') {
          path = this.userService.loggedIn ? 'learn/course' : 'explore-course/course';
        } else {
          path = 'play/collection';
        }
      } else {
        path = 'play/content';
      }

      this.router.navigate([path, contentId]);
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

  getContentList() {
    if (this.isOpen) {
      this.apiCallSubject.next();
    }
  }

  logTelemetry(response: any) {
    const input: ILogEventInput = {
      context: {
        env: _.get(this.activatedRoute, 'snapshot.root.firstChild.data.telemetry.env') ||
        _.get(this.activatedRoute, 'snapshot.data.telemetry.env') ||
        _.get(this.activatedRoute.snapshot.firstChild, 'children[0].data.telemetry.env')
      },
      object: {
        id: response.id,
        type: response.contentType || 'content',
        ver: `${response.pkgVersion || ''}`
      },
      edata: {
        type: 'api_call',
        level: 'WARN',
        message: response.failedReason
      }
    };

    this.telemetryService.log(input);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
