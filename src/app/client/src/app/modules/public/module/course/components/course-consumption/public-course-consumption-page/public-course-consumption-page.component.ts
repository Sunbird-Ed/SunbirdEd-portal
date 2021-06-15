import { combineLatest, Subject, throwError } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { ResourceService, ToasterService, ConfigService, ContentUtilsServiceService, ITelemetryShare,
  LayoutService, UtilService } from '@sunbird/shared';
import { CourseConsumptionService } from '@sunbird/learn';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash-es';
import { IImpressionEventInput, TelemetryService } from '@sunbird/telemetry';
import { NavigationHelperService, ConnectionService, OfflineCardService } from '@sunbird/shared';
import { GeneraliseLabelService } from '@sunbird/core';
import { ContentManagerService } from '../../../../offline/services/content-manager/content-manager.service';

@Component({
  templateUrl: './public-course-consumption-page.component.html',
  styleUrls: ['./public-course-consumption-page.component.scss']
})
export class PublicCourseConsumptionPageComponent implements OnInit, OnDestroy {
  public courseId: string;
  public showLoader = true;
  public showError = false;
  public courseHierarchy: any;
  sharelinkModal: boolean;
  shareLink: string;
  public telemetryCourseImpression: IImpressionEventInput;

  // Desktop App
  isDesktopApp = false;
  isConnected = false;
  contentDownloadStatus = {};
  showUpdate = false;
  showExportLoader = false;
  showModal = false;
  showDownloadLoader = false;
  disableDelete = false;
  isAvailableLocally = false;
  showDeleteModal = false;

  /**
   * telemetryShareData
  */
  telemetryShareData: Array<ITelemetryShare>;

  public unsubscribe = new Subject<void>();
  constructor(public navigationHelperService: NavigationHelperService, private activatedRoute: ActivatedRoute,
    private courseConsumptionService: CourseConsumptionService, public toasterService: ToasterService,
    public resourceService: ResourceService, public router: Router, public contentUtilsServiceService: ContentUtilsServiceService,
    private configService: ConfigService, private telemetryService: TelemetryService,
    public generaliseLabelService: GeneraliseLabelService, public layoutService: LayoutService,
    private utilService: UtilService,
    private connectionService: ConnectionService,
    private contentManagerService: ContentManagerService,
    private offlineCardService: OfflineCardService
    ) {
  }

  showJoinModal(event) {
    this.courseConsumptionService.showJoinCourseModal.emit(event);
  }

  ngOnInit() {
    this.isDesktopApp = this.utilService.isDesktopApp;
    if (this.isDesktopApp) {
      this.connectionService.monitor().pipe(takeUntil(this.unsubscribe)).subscribe(isConnected => {
        this.isConnected = isConnected;
      });
      this.contentManagerService.contentDownloadStatus$.pipe(takeUntil(this.unsubscribe)).subscribe( contentDownloadStatus => {
        this.contentDownloadStatus = contentDownloadStatus;
        this.checkDownloadStatus();
      });
    }
    this.showLoader = true;
    const routeParams: any = {...this.activatedRoute.snapshot.firstChild.params };
    this.courseId = routeParams.courseId;
    if (!this.courseId) {
      return this.redirectToExplore();
    }
    const inputParams = {params: this.configService.appConfig.CourseConsumption.contentApiQueryParams};
    this.courseConsumptionService.getCourseHierarchy(this.courseId, inputParams).pipe(takeUntil(this.unsubscribe))
    .subscribe((courseHierarchy: any) => {
      this.courseHierarchy = courseHierarchy;
      this.layoutService.updateSelectedContentType.emit(this.courseHierarchy.contentType);
      this.showLoader = false;
    }, (error) => {
      if (_.isEqual(_.get(error, 'error.responseCode'), 'RESOURCE_NOT_FOUND')) {
        this.toasterService.error(this.generaliseLabelService.messages.emsg.m0002);
      } else {
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
      }
      this.redirectToExplore();
    });
  }
  onShareLink() {
    this.sharelinkModal = true;
    this.shareLink = this.contentUtilsServiceService.getCoursePublicShareUrl(this.courseHierarchy.identifier);
    this.setTelemetryShareData(this.courseHierarchy);
  }
  setTelemetryShareData(param) {
    this.telemetryShareData = [{
      id: param.identifier,
      type: param.contentType,
      ver: param.pkgVersion ? param.pkgVersion.toString() : '1.0'
    }];
  }

  redirectToExplore() {
    this.navigationHelperService.navigateToResource('explore?selectedTab=course');
  }

  closeSharePopup(id) {
    this.sharelinkModal = false;
    const interactData = {
      context: {
        env: _.get(this.activatedRoute.snapshot.data.telemetry, 'env') || 'explore',
        cdata: []
      },
      edata: {
        id: id,
        type: 'click',
        pageid: _.get(this.activatedRoute.snapshot.data.telemetry, 'pageid') || 'explore-course-toc',
      },
      object: {
        id: _.get(this.courseHierarchy, 'identifier'),
        type: _.get(this.courseHierarchy, 'contentType') || 'Course',
        ver: `${_.get(this.courseHierarchy, 'pkgVersion')}` || `1.0`,
        rollup: { l1: this.courseId }
      }
    };
    this.telemetryService.interact(interactData);
  }

  logTelemetry(id, content?: {}) {
    let objectRollUp;
    if (content) {
      objectRollUp = this.courseConsumptionService.getContentRollUp(this.courseHierarchy, _.get(content, 'identifier'));
    }
    const interactData = {
      context: {
        env: _.get(this.activatedRoute.snapshot.data.telemetry, 'env') || 'content',
        cdata: []
      },
      edata: {
        id: id,
        type: 'click',
        pageid: _.get(this.activatedRoute.snapshot.data.telemetry, 'pageid') || 'explore-course',
      },
      object: {
        id: content ? _.get(content, 'identifier') : this.activatedRoute.snapshot.params.courseId,
        type: content ? _.get(content, 'contentType') : 'Course',
        ver: content ? `${_.get(content, 'pkgVersion')}` : `1.0`,
        rollup: objectRollUp ? this.courseConsumptionService.getRollUp(objectRollUp) : {}
      }
    };
    this.telemetryService.interact(interactData);
  }

  checkStatus(status) {
    this.checkDownloadStatus();
    return this.utilService.getPlayerDownloadStatus(status, this.courseHierarchy);
  }

  checkDownloadStatus() {
    if (this.courseHierarchy) {
      const downloadStatus = ['CANCELED', 'CANCEL', 'FAILED', 'DOWNLOAD'];
      const status = this.contentDownloadStatus[this.courseHierarchy.identifier];
      this.courseHierarchy['downloadStatus'] = _.isEqual(downloadStatus, status) ? 'DOWNLOAD' :
      (_.includes(['INPROGRESS', 'RESUME', 'INQUEUE'], status) ? 'DOWNLOADING' : _.isEqual(status, 'COMPLETED') ? 'DOWNLOADED' : status);
    }
  }
  updateCollection(collection) {
    collection['downloadStatus'] = this.resourceService.messages.stmsg.m0140;
    this.logTelemetry('update-collection');
    const request = {
      contentId: collection.identifier
    };
    this.contentManagerService.updateContent(request).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
      collection['downloadStatus'] = this.resourceService.messages.stmsg.m0140;
      this.showUpdate = false;
    }, (err) => {
      this.showUpdate = true;
      const errorMessage = !this.isConnected ? _.replace(this.resourceService.messages.smsg.m0056, '{contentName}', collection.name) :
        this.resourceService.messages.fmsg.m0096;
      this.toasterService.error(errorMessage);
    });
  }

  exportCollection(collection) {
    this.logTelemetry('export-collection');
    this.showExportLoader = true;
    this.contentManagerService.exportContent(collection.identifier)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(data => {
        this.showExportLoader = false;
        this.toasterService.success(this.resourceService.messages.smsg.m0059);
      }, error => {
        this.showExportLoader = false;
        if (_.get(error, 'error.responseCode') !== 'NO_DEST_FOLDER') {
          this.toasterService.error(this.resourceService.messages.fmsg.m0091);
        }
      });
  }

  isYoutubeContentPresent(collection) {
    this.logTelemetry('is-youtube-in-collection');
    this.showModal = this.offlineCardService.isYoutubeContent(collection);
    if (!this.showModal) {
      this.downloadCollection(collection);
    }
  }

  downloadCollection(collection) {
    this.showDownloadLoader = true;
    this.disableDelete = false;
    collection['downloadStatus'] = this.resourceService.messages.stmsg.m0140;
    this.logTelemetry('download-collection');
    this.contentManagerService.downloadContentId = collection.identifier;
    this.contentManagerService.downloadContentData = collection;
    this.contentManagerService.failedContentName = collection.name;
    this.contentManagerService.startDownload({}).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
      this.contentManagerService.downloadContentId = '';
      this.contentManagerService.downloadContentData = {};
      this.showDownloadLoader = false;
      collection['downloadStatus'] = this.resourceService.messages.stmsg.m0140;
    }, error => {
      this.disableDelete = true;
      this.showDownloadLoader = false;
      this.contentManagerService.downloadContentId = '';
      this.contentManagerService.downloadContentData = {};
      this.contentManagerService.failedContentName = '';
      collection['downloadStatus'] = this.resourceService.messages.stmsg.m0138;
      if (!(error.error.params.err === 'LOW_DISK_SPACE')) {
        this.toasterService.error(this.resourceService.messages.fmsg.m0090);
          }
    });
  }

  deleteCollection(collectionData) {
    this.disableDelete = true;
    this.logTelemetry('delete-collection');
    const request = {request: {contents: [collectionData.identifier]}};
    this.contentManagerService.deleteContent(request).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
      this.toasterService.success(this.resourceService.messages.stmsg.desktop.deleteCourseSuccessMessage);
      collectionData['downloadStatus'] = 'DOWNLOAD';
      collectionData['desktopAppMetadata.isAvailable'] = false;
      this.redirectToExplore();
    }, err => {
      this.disableDelete = false;
      this.toasterService.error(this.resourceService.messages.etmsg.desktop.deleteCourseErrorMessage);
    });
  }
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
