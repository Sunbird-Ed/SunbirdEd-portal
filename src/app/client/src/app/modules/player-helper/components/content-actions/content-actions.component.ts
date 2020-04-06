import { TelemetryService } from '@sunbird/telemetry';
import { actionButtons } from './actionButtons';
import { Router, ActivatedRoute } from '@angular/router';
import { ResourceService, ToasterService, ContentUtilsServiceService } from '@sunbird/shared';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subject} from 'rxjs';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-content-actions',
  templateUrl: './content-actions.component.html',
  styleUrls: ['./content-actions.component.scss']
})
export class ContentActionsComponent implements OnInit {
  @Input() contentData;
  @Input() showUpdate;
  @Output() contentDownloaded = new EventEmitter();
  actionButtons = actionButtons;
  contentRatingModal = false;
  contentId;
  collectionId;
  showExportLoader = false;
  showModal = false;
  showDeleteModal = false;
  public isConnected;
  public unsubscribe$ = new Subject<void>();
  @Input() objectRollUp: {} = {};
  contentDownloadStatus = {};
  showDownloadLoader = false;
  deleteContentIds = [];
  sharelinkModal= false
  shareLink: string;
  mimeType: string;
  constructor(
    //public contentManagerService: ContentManagerService,
    //private playerService: PublicPlayerService,
    //private connectionService: ConnectionService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public resourceService: ResourceService,
    public toasterService: ToasterService,
    public contentUtilsServiceService: ContentUtilsServiceService,
    private telemetryService: TelemetryService
  ) { }

  ngOnInit() {
    this.collectionId = _.get(this.activatedRoute.snapshot.params, 'collectionId');
    this.mimeType = _.get(this.activatedRoute.snapshot.params, 'mimeType');
  }

  onActionButtonClick(event, content) {
    switch (event.data.name.toUpperCase()) {
      case 'RATE':
        this.contentRatingModal = true;
        this.logTelemetry('rate-content', content);
        break;
      case 'SHARE':
        this.sharelinkModal = true ;
        this.shareLink = this.contentUtilsServiceService.getPublicShareUrl(this.collectionId, this.mimeType);
        this.logTelemetry('share-content', content);
        break;
    }
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

}
