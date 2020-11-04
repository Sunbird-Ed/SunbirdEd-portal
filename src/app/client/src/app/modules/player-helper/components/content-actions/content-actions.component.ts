import { TelemetryService } from '@sunbird/telemetry';
import { actionButtons } from './actionButtons';
import { Router, ActivatedRoute } from '@angular/router';
import { ResourceService, ToasterService, ContentUtilsServiceService, ITelemetryShare, NavigationHelperService } from '@sunbird/shared';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import * as _ from 'lodash-es';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-content-actions',
  templateUrl: './content-actions.component.html',
  styleUrls: ['./content-actions.component.scss']
})
export class ContentActionsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() contentData;
  actionButtons = actionButtons;
  contentRatingModal = false;
  contentId;
  collectionId;
  showExportLoader = false;
  showModal = false;
  showDeleteModal = false;
  public isConnected;
  public unsubscribe$ = new Subject<void>();
  telemetryShareData: Array<ITelemetryShare>;
  @Input() objectRollUp: {} = {};
  contentDownloadStatus = {};
  showDownloadLoader = false;
  deleteContentIds = [];
  sharelinkModal = false;
  shareLink: string;
  mimeType: string;
  subscription;
  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public resourceService: ResourceService,
    public toasterService: ToasterService,
    public contentUtilsServiceService: ContentUtilsServiceService,
    private telemetryService: TelemetryService,
    private navigationHelperService: NavigationHelperService,
    private deviceDetectorService: DeviceDetectorService
  ) { }

  ngOnInit() {
    // Replacing cbse/ncert value with cbse
    if (_.toLower(_.get(this.contentData, 'board')) === 'cbse') {
      this.contentData.board = 'CBSE/NCERT';
    }
    this.activatedRoute.params.subscribe((params) => {
      this.collectionId = params.collectionId;
    });
    this.actionButtons = _.cloneDeep(actionButtons);
    _.find(this.actionButtons, (button) => {
      button.disabled = (button.label === 'Fullscreen') ? (this.deviceDetectorService.isMobile() ||
        this.deviceDetectorService.isTablet()) : button.disabled;
    });
    this.collectionId = _.get(this.activatedRoute, 'snapshot.params.collectionId');
    this.mimeType = _.get(this.contentData, 'mimeType');
    this.contentPrintable();
    this.subscription = this.contentUtilsServiceService.contentShareEvent.subscribe((data) => {
      if (data === 'open') {
        this.shareContent(this.contentData);
      }
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    // console.log(changes.contentData);
    this.contentPrintable();
  }
  onActionButtonClick(event, content) {
      switch (event.data.name.toUpperCase()) {
        case 'RATE':
          this.contentRatingModal = true;
          this.logTelemetry('rate-content', content);
          break;
        case 'SHARE':
          this.shareContent(content);
          break;
        case 'PRINT':
          this.printPdf(content);
          this.logTelemetry('print-content', content);
          break;
        case 'FULLSCREEN':
          this.navigationHelperService.emitFullScreenEvent(true);
          this.logTelemetry('fullscreen-content', content);
          break;
      }
  }

  shareContent(content) {
    this.sharelinkModal = true;
          const param = {
            identifier: _.get(content, 'identifier'),
            type: _.get(content, 'contentType'),
          };
          this.setTelemetryShareData(param);
          this.shareLink = this.collectionId && _.get(content, 'identifier') ?
            this.contentUtilsServiceService.getPublicShareUrl(_.get(content, 'identifier'), _.get(content, 'mimeType'), this.collectionId) :
            this.contentUtilsServiceService.getPublicShareUrl(_.get(content, 'identifier'), _.get(content, 'mimeType'));
          this.logTelemetry('share-content', content);
  }

  printPdf(content: any) {
    const pdfUrl = _.get(content, 'itemSetPreviewUrl');
    window.open(pdfUrl, '_blank');
  }
    setTelemetryShareData(param) {
      this.telemetryShareData = [{
        id: param.identifier,
        type: param.contentType,
        ver: param.pkgVersion ? param.pkgVersion.toString() : '1.0'
      }];
    }

    logTelemetry(id, content) {
      const interactData = {
        context: {
          env: _.get(this.activatedRoute.snapshot.data.telemetry, 'env') || 'content',
          cdata: []
        },
        edata: {
          id: id,
          type: 'click',
          pageid: _.get(this.activatedRoute.snapshot.data.telemetry, 'pageid') || 'play-content',
        },
        object: {
          id: content['identifier'],
          type: content['contentType'],
          ver: `${content['pkgVersion']}`,
          rollup: this.objectRollUp,
        }
      };
      this.telemetryService.interact(interactData);
    }
  contentPrintable() {
    // selectedContent?.model?.itemSetPreviewUrl
   // console.log('------>', this.contentData);
    _.forEach(this.actionButtons, data => {
      if (data.name === 'print') {
        if (this.contentData.itemSetPreviewUrl) {
          data.disabled = false;
        } else {
          data.disable = true;
        }
      }
    });
  }

    ngOnDestroy() {
      if (this.subscription.unsubscribe) {
        this.subscription.unsubscribe();
      }
    }
  }
