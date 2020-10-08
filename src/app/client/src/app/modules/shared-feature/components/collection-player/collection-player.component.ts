
import { mergeMap, filter, map, catchError, takeUntil } from 'rxjs/operators';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { PlayerService, CollectionHierarchyAPI, PermissionService, CopyContentService, UserService, GeneraliseLabelService } from '@sunbird/core';
import { Observable, Subscription, Subject } from 'rxjs';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import * as _ from 'lodash-es';
import {
  WindowScrollService, ILoaderMessage, PlayerConfig, ICollectionTreeOptions, NavigationHelperService,
  ToasterService, ResourceService, ContentData, ContentUtilsServiceService, ITelemetryShare, ConfigService,
  ExternalUrlPreviewService, LayoutService
} from '@sunbird/shared';
import { IInteractEventObject, IInteractEventEdata, IImpressionEventInput, IEndEventInput, IStartEventInput } from '@sunbird/telemetry';
import * as TreeModel from 'tree-model';
import { DeviceDetectorService } from 'ngx-device-detector';
import { PopupControlService } from '../../../../service/popup-control.service';
import { PublicPlayerService } from '@sunbird/public';

@Component({
  selector: 'app-collection-player',
  templateUrl: './collection-player.component.html',
  styleUrls: ['./collection-player.component.scss']
})
export class CollectionPlayerComponent implements OnInit, OnDestroy, AfterViewInit {
  telemetryImpression: IImpressionEventInput;
  telemetryContentImpression: IImpressionEventInput;
  telemetryCourseEndEvent: IEndEventInput;
  telemetryCourseStart: IStartEventInput;
  telemetryShareData: Array<ITelemetryShare>;
  objectInteract: IInteractEventObject;
  objectContentInteract: IInteractEventObject;
  copyContentInteractEdata: IInteractEventEdata;
  collectionInteractObject: IInteractEventObject;
  closeIntractEdata: IInteractEventEdata;
  printPdfInteractEdata: IInteractEventEdata;
  closeContentIntractEdata: IInteractEventEdata;
  copyAsCourseInteractEdata: IInteractEventEdata;
  cancelInteractEdata: IInteractEventEdata;
  createCourseInteractEdata: IInteractEventEdata;
  tocTelemetryInteractEdata: IInteractEventEdata;
  showPlayer: Boolean = false;
  collectionId: string;
  collectionStatus: string;
  contentId: string;
  collectionTreeNodes: any;
  collectionTitle: string;
  contentTitle: string;
  playerConfig: Observable<any>;
  objectRollUp: any;
  triggerContentImpression = false;
  showCopyLoader: Boolean = false;
  subscription: Subscription;
  contentType: string;
  mimeType: string;
  sharelinkModal: boolean;
  badgeData: Array<object>;
  contentData: any;
  dialCode: string;
  collectionData: any;
  collectionTreeOptions: ICollectionTreeOptions;
  shareLink: string;
  playerOption: any;
  treeModel: any;
  contentDetails = [];
  nextPlaylistItem: any;
  prevPlaylistItem: any;
  telemetryCdata: Array<{}>;
  selectedContent: {};
  unsubscribe$ = new Subject<void>();
  mimeTypeFilters: any;
  activeMimeTypeFilter: any;
  isContentPresent: Boolean = false;
  queryParams: any;
  tocList = [];
  playerContent: any;
  activeContent: any;
  isSelectChapter: Boolean = false;
  showLoader = true;
  isCopyAsCourseClicked: Boolean = false;
  selectAll: Boolean = false;
  selectedItems = [];
  layoutConfiguration: any;
  loaderMessage: ILoaderMessage = {
    headerMessage: 'Please wait...',
    loaderMessage: 'Fetching content details!'
  };
  playerServiceReference: any;

  constructor(public route: ActivatedRoute, public playerService: PlayerService,
    private windowScrollService: WindowScrollService, public router: Router, public navigationHelperService: NavigationHelperService,
    private toasterService: ToasterService, private deviceDetectorService: DeviceDetectorService, private resourceService: ResourceService,
    public permissionService: PermissionService, public copyContentService: CopyContentService,
    public contentUtilsServiceService: ContentUtilsServiceService, public configService: ConfigService,
    public popupControlService: PopupControlService, public navigationhelperService: NavigationHelperService,
    public externalUrlPreviewService: ExternalUrlPreviewService, public userService: UserService,
    public layoutService: LayoutService, public generaliseLabelService: GeneraliseLabelService,
    public publicPlayerService: PublicPlayerService) {
    this.router.onSameUrlNavigation = 'ignore';
    this.collectionTreeOptions = this.configService.appConfig.collectionTreeOptions;
    this.playerOption = { showContentRating: true };
    this.mimeTypeFilters = [
      { text: this.resourceService.frmelmnts.btn.all, value: 'all' },
      { text: this.resourceService.frmelmnts.btn.video, value: 'video' },
      { text: this.resourceService.frmelmnts.btn.interactive, value: 'interactive' },
      { text: this.resourceService.frmelmnts.btn.docs, value: 'docs' }
    ];
    this.activeMimeTypeFilter = ['all'];
  }

  ngOnInit() {
    this.playerServiceReference = this.userService.loggedIn ? this.playerService : this.publicPlayerService;
    this.initLayout();
    this.dialCode = _.get(this.route, 'snapshot.queryParams.dialCode');
    this.contentType = _.get(this.route, 'snapshot.queryParams.contentType');
    this.contentData = this.getContent();
  }

  initLayout() {
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.layoutService.scrollTop();
    this.layoutService.switchableLayout().
      pipe(takeUntil(this.unsubscribe$)).subscribe(layoutConfig => {
        if (layoutConfig != null) {
          this.layoutConfiguration = layoutConfig.layout;
        }
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

  printPdf(pdfUrl: string) {
    window.open(pdfUrl, '_blank');
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: this.route.snapshot.data.telemetry.env,
          cdata: this.dialCode ? [{ id: this.route.snapshot.params.collectionId, type: this.contentType },
          { id: this.dialCode, type: 'dialCode' }] : [{ id: this.route.snapshot.params.collectionId, type: this.contentType }]
        },
        object: {
          id: this.collectionId,
          type: this.contentType,
          ver: '1.0'
        },
        edata: {
          type: this.route.snapshot.data.telemetry.type,
          pageid: this.route.snapshot.data.telemetry.pageid,
          uri: this.router.url,
          subtype: this.route.snapshot.data.telemetry.subtype,
          duration: this.navigationhelperService.getPageLoadTime()
        }
      };
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private initPlayer(id: string): void {
    this.playerConfig = this.getPlayerConfig(id).pipe(map((content) => {
      content.context.objectRollup = this.objectRollUp;
      this.telemetryContentImpression = {
        context: {
          env: this.route.snapshot.data.telemetry.env,
          cdata: this.dialCode ? [{ id: this.dialCode, type: 'dialCode' }] : []
        },
        edata: {
          type: this.route.snapshot.data.telemetry.env,
          pageid: this.route.snapshot.data.telemetry.env,
          uri: this.router.url
        },
        object: {
          id: content.metadata.identifier,
          type: this.contentType || content.metadata.resourceType || content,
          ver: content.metadata.pkgVersion ? content.metadata.pkgVersion.toString() : '1.0',
          rollup: this.objectRollUp
        }
      };
      this.closeContentIntractEdata = {
        id: 'content-close',
        type: 'click',
        pageid: this.route.snapshot.data.telemetry.pageid
      };
      this.objectContentInteract = {
        id: content.metadata.identifier,
        type: this.contentType || content.metadata.resourceType || 'content',
        ver: content.metadata.pkgVersion ? content.metadata.pkgVersion.toString() : '1.0',
        rollup: this.objectRollUp
      };
      this.triggerContentImpression = true;
      return content;
    }), catchError((error) => {
      console.log(`unable to get player config for content ${id}`, error);
      return error;
    }));
  }

  selectedFilter(event) {
    this.activeMimeTypeFilter = event.data.value;
  }

  showNoContent(event) {
    if (event.message === 'No Content Available') {
      this.isContentPresent = false;
    }
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
      return this.playerServiceReference.getConfigByContent(contentId, { dialCode: this.dialCode });
    } else {
      return this.playerServiceReference.getConfigByContent(contentId);
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
          this.tocList.push({ id: node.model.identifier, title: node.model.name, mimeType: node.model.mimeType });
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

  public OnPlayContent(content: { title: string, id: string }, isClicked?: boolean) {
    if (content && content.id) {
      this.navigateToContent(null, content.id);
      this.setContentNavigators();
      this.playContent(content);
      if (!isClicked) {
        const playContentDetails = this.findContentById(this.collectionTreeNodes, content.id);
        if (playContentDetails.model.mimeType === this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.xUrl) {
          this.externalUrlPreviewService.generateRedirectUrl(playContentDetails.model);
        }
      }
      this.windowScrollService.smoothScroll('app-player-collection-renderer', 10);
    } else {
      throw new Error(`Unable to play collection content for ${this.collectionId}`);
    }
  }

  getGeneraliseResourceBundle(data) {
    this.resourceService.languageSelected$.pipe(takeUntil(this.unsubscribe$)).subscribe(item => {
      this.generaliseLabelService.initialize(data, item.value);
    });
  }

  private getContent(): void {
    this.subscription = this.route.params.pipe(
      filter(params => params.collectionId !== this.collectionId),
      mergeMap((params) => {
        this.showLoader = true;
        this.collectionId = params.collectionId;
        this.telemetryCdata = [{ id: this.collectionId, type: this.contentType }];
        if (this.dialCode) {
          this.telemetryCdata.push({ id: this.dialCode, type: 'dialCode' });
        }
        this.collectionStatus = params.collectionStatus;
        return this.getCollectionHierarchy(params.collectionId);
      }))
      .subscribe((data) => {
        this.collectionTreeNodes = data;
        this.showLoader = false;
        this.layoutService.updateSelectedContentType.emit(_.get(data, 'data.contentType'));
        this.getGeneraliseResourceBundle(data.data);
        this.setTelemetryData();
        this.setTelemetryStartEndData();
        this.route.queryParams.subscribe((queryParams) => {
          this.contentId = queryParams.contentId;
          if (this.contentId) {
            const content = this.findContentById(data, this.contentId);
            this.selectedContent = content;
            if (content) {
              this.objectRollUp = this.contentUtilsServiceService.getContentRollup(content);
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
    this.closeIntractEdata = {
      id: 'collection-close',
      type: 'click',
      pageid: 'collection-player'
    };
    this.printPdfInteractEdata = {
      id: 'print-pdf-button',
      type: 'click',
      pageid: 'collection-player'
    };
    this.copyContentInteractEdata = {
      id: 'copy-content-button',
      type: 'click',
      pageid: 'collection-player'
    };
    this.copyAsCourseInteractEdata = {
      id: 'copy-as-course-button',
      type: 'click',
      pageid: 'collection-player'
    };
    this.cancelInteractEdata = {
      id: 'cancel-button',
      type: 'click',
      pageid: 'collection-player'
    };
    this.createCourseInteractEdata = {
      id: 'create-course-button',
      type: 'click',
      pageid: 'collection-player'
    };
    this.collectionInteractObject = {
      id: this.collectionId,
      type: this.contentType,
      ver: this.collectionData.pkgVersion ? this.collectionData.pkgVersion.toString() : '1.0'
    };
  }

  private getCollectionHierarchy(collectionId: string): Observable<{ data: CollectionHierarchyAPI.Content }> {
    const option: any = { params: {} };
    option.params = this.configService.appConfig.PublicPlayer.contentApiQueryParams;
    if (this.collectionStatus && this.collectionStatus === 'Unlisted') {
      option.params['mode'] = 'edit';
    }
    return this.playerServiceReference.getCollectionHierarchy(collectionId, option).pipe(
      map((response) => {
        this.collectionData = _.get(response, 'result.content');
        this.contentType = _.get(response, 'result.content.contentType');
        this.mimeType = _.get(response, 'result.content.mimeType');
        this.collectionTitle = _.get(response, 'result.content.name') || 'Untitled Collection';
        this.badgeData = _.get(response, 'result.content.badgeAssertions');
        return { data: _.get(response, 'result.content') };
      }));
  }

  closeCollectionPlayer() {
    if (this.dialCode) {
      this.router.navigate(['/get/dial/', this.dialCode]);
    } else {
      const url = this.userService.loggedIn ? '/resources' : '/explore';
      this.navigationHelperService.navigateToPreviousUrl(url);
    }
  }

  closeContentPlayer() {
    this.selectedContent = {};
    this.showPlayer = false;
    this.triggerContentImpression = false;
    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      queryParams: { contentType: this.contentType }
    };
    if (this.dialCode) {
      navigationExtras.queryParams['dialCode'] = _.get(this.route, 'snapshot.queryParams.dialCode');
    }
    this.router.navigate([], navigationExtras);
  }

  callinitPlayer(event) {
    if (event.data.identifier !== _.get(this.activeContent, 'identifier')) {
      this.isContentPresent = true;
      this.activeContent = event.data;
      this.objectRollUp = this.getContentRollUp(event.rollup);
      this.initPlayer(_.get(this.activeContent, 'identifier'));
    }
  }

  setTelemetryInteractData() {
    this.tocTelemetryInteractEdata = {
      id: 'library-toc',
      type: 'click',
      pageid: this.route.snapshot.data.telemetry.pageid
    };
  }

  tocCardClickHandler(event) {
    this.setTelemetryInteractData();
    this.callinitPlayer(event);
  }

  tocChapterClickHandler(event) {
    if (this.isSelectChapter) {
      this.isSelectChapter = false;
    }
    this.callinitPlayer(event);
  }

  getContentRollUp(rollup: string[]) {
    const objectRollUp = {};
    if (rollup) {
      for (let i = 0; i < rollup.length; i++) {
        objectRollUp[`l${i + 1}`] = rollup[i];
      }
    }
    return objectRollUp;
  }

  showChapter() {
    this.isSelectChapter = this.isSelectChapter ? false : true;
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

  /**
   * @since - #SH-362
   * @description - It will show/hide create course and cancel button also will hide the other action buttons.
   */
  copyAsCourse() {
    this.isCopyAsCourseClicked = !this.isCopyAsCourseClicked;
  }

  /**
   * @since #SH-362
   * @description - This method clears all the intended action and takes the book toc to the default state
   */
  clearSelection() {
    this.isCopyAsCourseClicked = !this.isCopyAsCourseClicked;
    this.selectAll = false;
    this.selectedItems = [];
    this.collectionData['children'].forEach(item => {
      item.selected = false;
    });
  }

  /**
   * @since - SH-362
   * @description - This methods selects/deselects all the textbook units
   */
  selectAllItem() {
    this.selectAll = !this.selectAll;
  }

  private setTelemetryStartEndData() {
    const deviceInfo = this.deviceDetectorService.getDeviceInfo();
    setTimeout(() => {
      this.telemetryCourseStart = {
        context: {
          env: this.route.snapshot.data.telemetry.env,
          cdata: this.telemetryCdata
        },
        object: {
          id: this.collectionId,
          type: this.contentType,
          ver: '1.0',
        },
        edata: {
          type: this.route.snapshot.data.telemetry.type,
          pageid: this.route.snapshot.data.telemetry.pageid,
          mode: 'play',
          duration: this.navigationhelperService.getPageLoadTime(),
          uaspec: {
            agent: deviceInfo.browser,
            ver: deviceInfo.browser_version,
            system: deviceInfo.os_version,
            platform: deviceInfo.os,
            raw: deviceInfo.userAgent
          }
        }
      };
    }, 100);
    this.telemetryCourseEndEvent = {
      object: {
        id: this.collectionId,
        type: this.contentType,
        ver: '1.0',
      },
      context: {
        env: this.route.snapshot.data.telemetry.env,
        cdata: this.telemetryCdata
      },
      edata: {
        type: this.route.snapshot.data.telemetry.type,
        pageid: this.route.snapshot.data.telemetry.pageid,
        mode: 'play'
      }
    };
  }

  /**
   * @since #SH-362
   * @description - This method handles the creation of course from a textbook (entire or selected units)
   */
  createCourse() {
    this.userService.userOrgDetails$.subscribe(() => {
      this.showCopyLoader = true;
      this.copyContentService.copyAsCourse(this.collectionData).subscribe((response) => {
        this.toasterService.success(this.resourceService.messages.smsg.m0042);
        this.showCopyLoader = false;
      }, (err) => {
        this.showCopyLoader = false;
        this.clearSelection();
        this.toasterService.error(this.resourceService.messages.emsg.m0008);
      });
    });
  }

  /**
   * @since #SH-362
   * @param  {} event
   * @description - this method will handle the enable/disable of create course button.
   */
  handleSelectedItem(event) {
    if ('selectAll' in event) {
      this.handleSelectAll(event);
    } else {
      if (_.get(event, 'data.selected') === true) {
        this.selectedItems.push(event.data);
      } else {
        _.remove(this.selectedItems, (item) => {
          return (item === event.data);
        });
      }
    }
  }

  /**
   * @since #SH-362
   * @param  {} event
   * @description - To handle select/deselect all checkbox event particularly
   */
  handleSelectAll(event) {
    if (_.get(event, 'selectAll') === true) {
      event.data.forEach(element => {
        if (this.selectedItems.indexOf(element) === -1) {
          this.selectedItems.push(element);
        }
      });
    } else if (_.get(event, 'selectAll') === false) {
      this.selectedItems = [];
    }
  }
}

