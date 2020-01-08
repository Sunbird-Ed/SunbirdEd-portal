import { ConnectionService } from '@sunbird/offline';
import { Component, OnInit, OnDestroy, OnChanges, Input } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { PublicPlayerService } from '@sunbird/public';
import {
  ConfigService, NavigationHelperService, PlayerConfig, ContentData, ToasterService, ResourceService
} from '@sunbird/shared';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { IImpressionEventInput } from '@sunbird/telemetry';

@Component({
  selector: 'app-contentplayer-page',
  templateUrl: './contentplayer-page.component.html',
  styleUrls: ['./contentplayer-page.component.scss']
})
export class ContentPlayerPageComponent implements OnInit, OnDestroy, OnChanges {
  public unsubscribe$ = new Subject<void>();
  @Input() contentDetails: ContentData;
  playerConfig;
  telemetryImpression: IImpressionEventInput;
  @Input() tocPage = false;
  public isConnected;
  @Input() dialCode: string;

  constructor(private activatedRoute: ActivatedRoute,
    private playerService: PublicPlayerService,
    private configService: ConfigService,
    public router: Router,
    private navigationHelperService: NavigationHelperService,
    public toasterService: ToasterService,
    private resourceService: ResourceService,
    private connectionService: ConnectionService,
  ) { }

  ngOnInit() {
    this.getContentIdFromRoute();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart), takeUntil(this.unsubscribe$))
      .subscribe(x => { if (!this.tocPage) {this.setPageExitTelemtry(); }});
    this.checkOnlineStatus();
  }

  checkOnlineStatus() {
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
    });
  }

  ngOnChanges() {
    if (this.contentDetails && this.tocPage) {
      this.playerConfig = {};
      this.getContent(this.contentDetails.identifier);
    }
  }

  getContentIdFromRoute() {
    this.activatedRoute.params.pipe(
      takeUntil(this.unsubscribe$))
      .subscribe(params => {
        if (params.contentId) {
          this.getContent(params.contentId);
        }
      });
  }

  getContent(contentId) {
    const options: any = { dialCode: this.dialCode };
    const params = { params: this.configService.appConfig.PublicPlayer.contentApiQueryParams };
    this.playerService.getContent(contentId, params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(response => {
        this.contentDetails = _.get(response, 'result.content');
        this.getContentConfigDetails(contentId, options);
        this.setTelemetryData();
      }, error => {
        this.toasterService.error(this.resourceService.messages.emsg.m0024);
        this.setTelemetryData();
      });
  }

  getContentConfigDetails(contentId, options) {
    const contentDetails = {
      contentId: contentId,
      contentData: this.contentDetails
    };
    this.playerConfig = this.playerService.getConfig(contentDetails, options);
  }

  setTelemetryData() {
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        uri: this.router.url,
        subtype: this.activatedRoute.snapshot.data.telemetry.subtype,
        duration: this.navigationHelperService.getPageLoadTime()
      }
    };
    if (this.contentDetails) {
      this.telemetryImpression.object = {
        id: this.contentDetails['identifier'],
        type: this.contentDetails['contentType'],
        ver: this.contentDetails['pkgVersion'].toString() || '1.0',
      };
    }
  }
  setPageExitTelemtry() {
    if (this.contentDetails) {
      this.telemetryImpression.object = {
        id: this.contentDetails['identifier'],
        type: this.contentDetails['contentType'],
        ver: this.contentDetails['pkgVersion'].toString() || '1.0',
      };
    }
    this.telemetryImpression.edata.subtype = 'pageexit';
    this.telemetryImpression = Object.assign({}, this.telemetryImpression);
  }

  deleteContent(event) {
    if (this.isConnected && !this.router.url.includes('browse')) {
      this.playerConfig = {};
    }
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
