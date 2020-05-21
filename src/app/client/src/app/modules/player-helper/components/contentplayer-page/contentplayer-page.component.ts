import { Component, OnInit, OnDestroy, OnChanges, Input, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart, NavigationEnd } from '@angular/router';
import {
  ConfigService, NavigationHelperService, PlayerConfig, ContentData, ToasterService, ResourceService,
  UtilService
} from '@sunbird/shared';
import { Subject } from 'rxjs';
import { takeUntil, filter, map } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { IImpressionEventInput, TelemetryService } from '@sunbird/telemetry';

@Component({
  selector: 'app-contentplayer-page',
  templateUrl: './contentplayer-page.component.html',
  styleUrls: ['./contentplayer-page.component.scss']
})
export class ContentPlayerPageComponent implements OnInit, OnDestroy, OnChanges {
  public unsubscribe$ = new Subject<void>();
  @Input() contentDetails;
  @Input() playerConfig;
  telemetryImpression: IImpressionEventInput;
  @Input() tocPage = false;
  public isConnected;
  @Input() dialCode: string;
  contentId: string;
  @Input() isContentPresent = true;
  @Input() objectRollUp;
  @Input() showProgress = false;
  @Input() completedPercentage;
  contentType: string;
  @Output() contentDownloaded = new EventEmitter();
  @Output() deletedContent = new EventEmitter();
  public isContentDeleted: Subject<any> = new Subject();
  playerOption: any;

  constructor(private activatedRoute: ActivatedRoute,
    private configService: ConfigService,
    public router: Router,
    private navigationHelperService: NavigationHelperService,
    public toasterService: ToasterService,
    public resourceService: ResourceService,
    private utilService: UtilService,
    private telemetryService: TelemetryService
  ) { }

  ngOnInit() {
    this.utilService.emitHideHeaderTabsEvent(true);
    this.contentType = this.activatedRoute.snapshot.queryParams.contentType;
    this.getContentIdFromRoute();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart), takeUntil(this.unsubscribe$))
      .subscribe(x => { if (!this.tocPage) { this.setPageExitTelemtry(); } });
    this.playerOption = {
      showContentRating: true
    };
    this.activatedRoute.params.subscribe((params) => {
      if (_.get(this.activatedRoute, 'snapshot.queryParams.l1Parent') && !this.tocPage) {
        this.objectRollUp = {
          l1: _.get(this.activatedRoute, 'snapshot.queryParams.l1Parent')
        };
      }
    });

  }

  ngOnChanges() {
    if (this.contentDetails && this.tocPage) {
      this.contentId = this.contentDetails.identifier;
      this.getContent();
    }
  }

  getContentIdFromRoute() {
    this.activatedRoute.params.pipe(
      takeUntil(this.unsubscribe$))
      .subscribe(params => {
        if (params.contentId) {
          this.contentId = params.contentId;
          this.getContent();
        }
      });
  }

  getContent() {
    const options: any = { dialCode: this.dialCode };
    const params = { params: this.configService.appConfig.PublicPlayer.contentApiQueryParams };
  }

  getContentConfigDetails(contentId, options) {
    const contentDetails = {
      contentId: contentId,
      contentData: this.contentDetails
    };
    this.playerConfig.context.objectRollup = this.objectRollUp;
  }

  checkContentDeleted(event) {
    if (event && this.isConnected && !this.router.url.includes('browse')) {
      this.isContentDeleted.next({ value: true });
      this.deletedContent.emit(this.contentDetails);
    }
  }

  checkContentDownloading(event) {
    this.isContentDeleted.next({ value: false });
    this.contentDownloaded.emit(event);
  }

  goBack() {
    this.logTelemetry('close-content-player');
    this.navigationHelperService.goBack();
  }

  logTelemetry(id) {
    const interactData = {
      context: {
        env: _.get(this.activatedRoute.snapshot.data.telemetry, 'env') || 'content',
        cdata: []
      },
      edata: {
        id: id,
        type: 'click',
        pageid: _.get(this.activatedRoute.snapshot.data.telemetry, 'pageid') || 'play-content',
      }
    };
    this.telemetryService.interact(interactData);
  }

  setTelemetryData() {
    let telemetryCdata;
    if (this.dialCode) {
      telemetryCdata = [{ 'type': 'DialCode', 'id': this.dialCode }];
    }
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env,
        cdata: telemetryCdata || []
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        uri: this.router.url,
      }
    };
    if (!this.tocPage) {
      this.telemetryImpression.edata['subtype'] = this.activatedRoute.snapshot.data.telemetry.subtype;
      this.telemetryImpression.edata['duration'] = this.navigationHelperService.getPageLoadTime();
    }
    if (this.contentDetails) {
      this.telemetryImpression.object = {
        id: this.contentDetails['identifier'],
        type: this.contentType,
        ver: `${this.contentDetails['pkgVersion']}` || '1.0',
        rollup: this.objectRollUp
      };
    }
  }

  setPageExitTelemtry() {
    if (this.contentDetails) {
      this.telemetryImpression.object = {
        id: this.contentDetails['identifier'],
        type: this.contentDetails['contentType'],
        ver: `${this.contentDetails['pkgVersion']}` || '1.0',
      };
    }
    this.telemetryImpression.edata.subtype = 'pageexit';
    this.telemetryImpression = Object.assign({}, this.telemetryImpression);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.utilService.emitHideHeaderTabsEvent(false);
  }
}
