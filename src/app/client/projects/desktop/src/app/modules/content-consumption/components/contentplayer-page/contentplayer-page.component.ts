import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { PublicPlayerService } from '@sunbird/public';
import {
  ConfigService, NavigationHelperService, PlayerConfig, ContentData, ToasterService, ResourceService
} from '@sunbird/shared';
import { Subject } from 'rxjs';
import { takeUntil, filter} from 'rxjs/operators';
import * as _ from 'lodash-es';
import { IImpressionEventInput } from '@sunbird/telemetry';

@Component({
  selector: 'app-contentplayer-page',
  templateUrl: './contentplayer-page.component.html',
  styleUrls: ['./contentplayer-page.component.scss']
})
export class ContentPlayerPageComponent implements OnInit, OnDestroy {
  public unsubscribe$ = new Subject<void>();
  contentDetails: ContentData;
  playerConfig: PlayerConfig;
  telemetryImpression: IImpressionEventInput;
  constructor(private activatedRoute: ActivatedRoute,
    private playerService: PublicPlayerService,
    private configService: ConfigService,
    public router: Router,
    private navigationHelperService: NavigationHelperService,
    public toasterService: ToasterService,
    private resourceService: ResourceService,
  ) { }

  ngOnInit() {
    this.getContentIdFromRoute();
    this.setTelemetryData();
    this.router.events
    .pipe(filter((event) => event instanceof NavigationStart), takeUntil(this.unsubscribe$))
    .subscribe(x => { this.prepareVisits(); });
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
    const params = { params: this.configService.appConfig.PublicPlayer.contentApiQueryParams };
    this.playerService.getContent(contentId, params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(response => {
        this.contentDetails = _.get(response, 'result.content');
        this.getContentConfigDetails(contentId);
      }, error => {
        this.toasterService.error(this.resourceService.messages.emsg.m0024);
      });
  }
  getContentConfigDetails(contentId) {
    const contentDetails = {
      contentId: contentId,
      contentData: this.contentDetails
    };
    this.playerConfig = this.playerService.getConfig(contentDetails);
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
  }
  prepareVisits() {
    const  visits = [];
    visits.push({
      objid: this.contentDetails.identifier,
      objtype: this.contentDetails.contentType,
      index: 0
    });
    this.telemetryImpression.edata.visits = visits;
    this.telemetryImpression.edata.subtype = 'pageexit';
    this.telemetryImpression = Object.assign({}, this.telemetryImpression);
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
