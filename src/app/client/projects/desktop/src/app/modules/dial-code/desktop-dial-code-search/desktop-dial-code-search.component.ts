import { Component, OnInit, OnDestroy } from '@angular/core';
import { combineLatest, of, Observable } from 'rxjs';
import { ResourceService, ToasterService, ConfigService, UtilService, NavigationHelperService } from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import { SearchService, PlayerService, CoursesService, UserService } from '@sunbird/core';
import { PublicPlayerService } from '@sunbird/public';
import * as _ from 'lodash-es';
import { IInteractEventEdata, IImpressionEventInput, TelemetryService } from '@sunbird/telemetry';
import { takeUntil, mergeMap, tap, retry, catchError, map, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {
  ContentManagerService
} from './../../offline/services/content-manager/content-manager.service';
import { DialCodeService } from '../../../../../../../src/app/modules/dial-code-search';
import { ConnectionService } from '../../offline';

@Component({
  selector: 'app-desktop-dial-code-search',
  templateUrl: './desktop-dial-code-search.component.html',
  styleUrls: ['./desktop-dial-code-search.component.scss']
})
export class DesktopDialCodeSearchComponent implements OnInit, OnDestroy {
  telemetryImpression: IImpressionEventInput;
  dialResultImpression: IImpressionEventInput;
  dialCode;
  showLoader = true;
  loaderMessage: any;
  searchResults: Array<any> = [];
  unsubscribe$ = new Subject<void>();
  telemetryCdata: Array<{}> = [];
  selectChapterTelemetryCdata: Array<{}> = [];
  selectChapterInteractEdata: IInteractEventEdata;
  dialSearchSource: string;
  singleContentRedirect = '';
  instance: string;
  isBrowse = false;
  showSelectChapter = false;
  chapterName: string;
  dialContentId: string;
  visits: any = [];
  offlineContents: any = [];
  offlineSearchResults: any[] = [];
  isConnected = false;

  constructor(
    public resourceService: ResourceService,
    public userService: UserService,
    public coursesService: CoursesService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public searchService: SearchService,
    public toasterService: ToasterService,
    public configService: ConfigService,
    public utilService: UtilService,
    public navigationHelperService: NavigationHelperService,
    public playerService: PlayerService,
    public telemetryService: TelemetryService,
    public contentManagerService: ContentManagerService,
    public publicPlayerService: PublicPlayerService,
    private dialCodeService: DialCodeService,
    private connectionService: ConnectionService
  ) { }

  ngOnInit() {
    this.connectionService.monitor()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(isConnected => {
        this.isConnected = isConnected;
      });

    combineLatest(this.activatedRoute.params, this.activatedRoute.queryParams,
      (params, queryParams) => {
        return { ...params, ...queryParams };
      })
      .pipe(tap(this.initialize))
      .subscribe(params => {
        combineLatest([this.processDialCode(params, false), this.processDialCode(params, true)])
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(([offlineRes, onlineRes]: any) => {

            combineLatest([this.getDialCodeSearchResults(offlineRes, false), this.getDialCodeSearchResults(onlineRes, true)])
              .pipe(takeUntil(this.unsubscribe$))
              .subscribe(([offlineContents, onlineContents]) => {
                this.offlineSearchResults = offlineContents;
                this.searchResults = onlineContents;
                this.showLoader = false;
              }, err => {
                this.showLoader = false;
              });

          }, err => {
            this.showLoader = false;
          });
      });

    this.contentManagerService.downloadListEvent.pipe(takeUntil(this.unsubscribe$)).subscribe((data) => {
      this.updateCardData(data);
    });
  }

  private initialize = (params) => {
    EkTelemetry.config.batchsize = 2;
    this.isBrowse = Boolean(this.router.url.includes('browse'));
    this.dialSearchSource = _.get(params, 'source') || 'search';
    this.searchResults = [];
    this.dialCode = _.get(params, 'dialCode');
    this.showLoader = true;
    this.instance = _.upperCase(_.get(this.resourceService, 'instance'));
    this.setTelemetryData();
  }

  getDialCodeSearchResults(res, isOnline): Observable<any> {
    const linkedContents = _.flatMap(_.values(res));
    const { constantData, metaData, dynamicFields } = this.configService.appConfig.GetPage;
    const results = this.utilService.getDataForCard(linkedContents, constantData, dynamicFields, metaData);

    if (results.length === 1) {
      if (_.get(results[0], 'metaData.mimeType') === 'application/vnd.ekstep.content-collection' ||
        !sessionStorage.getItem('singleContentRedirect')) {
        this.singleContentRedirect = results[0]['name'];
      }
    }

    const telemetryInteractEdata = {
      id: 'content-explode',
      type: 'view',
      subtype: 'post-populate'
    };

    if (_.get(res, 'collection.length') > 1) {
      telemetryInteractEdata.id = 'content-collection';
    }

    if (results.length !== 1) {
      this.logInteractEvent(telemetryInteractEdata);
    }

    if (results && !results.length) {
      return of([]);
    }

    return this.formatContents(results, isOnline);
  }

  private processDialCode(params, isOnline) {

    if (!this.isConnected && isOnline) {
      return of(undefined);
    }

    return of(params).pipe(
      finalize(() => {
        this.logInteractEvent({
          id: 'search-dial-init',
          type: 'view',
          subtype: 'auto',
        });
      }),
      mergeMap(param => this.dialCodeService.searchDialCode(_.get(param, 'dialCode'), isOnline)
        .pipe(
          tap(value => {
            this.logInteractEvent({
              id: 'search-dial-success',
              type: 'view',
              subtype: 'auto',
            });
            this.logTelemetryEvents(true);
          }, err => {
            this.logInteractEvent({
              id: 'search-dial-failed',
              type: 'view',
              subtype: 'auto',
            });
            this.logTelemetryEvents(false);
          }),
          retry(1),
          catchError(error => {
            return of({
              content: [],
              collections: []
            });
          }),
          mergeMap(this.dialCodeService.filterDialSearchResults),
          tap((res) => {
            this.showSelectChapter = false;
          })
        ))
    );
  }

  private processTextBook(params) {
    const textBookUnit = _.get(params, 'textbook');
    const content = _.find(_.get(this.dialCodeService, 'dialCodeResult.content'), contentObj => {
      return (_.get(contentObj, 'identifier') === textBookUnit);
    });

    if (content) {
      if (_.toLower(_.get(content, 'contentType')) === 'textbook') {
        this.chapterName = _.get(content, 'name');
        this.dialContentId = _.get(content, 'identifier');
        this.showSelectChapter = true;
      }

      return this.dialCodeService.getAllPlayableContent([textBookUnit]).pipe(
        map(contents => {
          return { contents };
        })
      );
    }
  }

  setTelemetryData() {
    if (this.dialCode) {
      this.telemetryCdata = [{ 'type': 'DialCode', 'id': this.dialCode }];
    }

    this.selectChapterInteractEdata = {
      id: 'select-chapter-button',
      type: 'click',
      pageid: 'get-dial'
    };

    this.selectChapterTelemetryCdata = [
      { 'type': 'DialCode', 'id': this.dialCode },
      { 'id': 'scan:result:collection:list', 'type': 'Feature' },
      { 'id': 'SB-15628', 'type': 'Task' }];

    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env,
        cdata: [{
          type: 'DialCode',
          id: this.activatedRoute.snapshot.params.dialCode
        }]
      },
      object: {
        id: this.activatedRoute.snapshot.params.dialCode,
        type: 'DialCode',
        ver: '1.0'
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: `${this.activatedRoute.snapshot.data.telemetry.pageid}`,
        uri: this.router.url,
        subtype: _.get(this.activatedRoute, 'snapshot.data.telemetry.subtype'),
        duration: this.navigationHelperService.getPageLoadTime()
      }
    };
  }

  updateCardData(downloadListdata) {
    _.each(this.searchResults, (contents) => {
      this.publicPlayerService.updateDownloadStatus(downloadListdata, contents);
    });
  }

  logTelemetryEvents(status: boolean) {
    let level = 'ERROR';
    let msg = 'Search Dialcode failed';
    if (status) {
      level = 'SUCCESS';
      msg = 'Search Dialcode was success';
    }
    const event = {
      context: {
        env: 'dialcode',
        cdata: this.telemetryCdata
      },
      edata: {
        type: 'search-dialcode',
        level: level,
        message: msg,
        pageid: this.router.url.split('?')[0]
      }
    };
    this.telemetryService.log(event);
  }

  public handleCloseButton() {
    if (_.get(this.activatedRoute, 'snapshot.queryParams.textbook') && _.get(this.dialCodeService, 'dialCodeResult.count') > 1) {
      this.router.navigate(['/get/dial', _.get(this.activatedRoute, 'snapshot.params.dialCode')]);
    } else {
      this.router.navigate(['/get']);
    }
  }

  logInteractEvent({ id, type, subtype }) {
    const telemetry = {
      context: { env: _.get(this.activatedRoute, 'snapshot.data.telemetry.env'), cdata: this.telemetryCdata },
      edata: {
        id,
        type,
        pageid: 'get-dial'
      }
    };
    if (subtype) {
      telemetry.edata['subtype'] = subtype;
    }
    this.telemetryService.interact(telemetry);
  }

  formatContents(contents, isOnline): Observable<any> {
    let offlineLinkedContents: any = [];
    const contentIds: any = [];
    _.each(contents, content => {
      if (_.get(content, 'metaData.childTextbookUnit') || _.toLower(_.get(content, 'contentType') === 'textbook')) {
        const id = _.get(content, 'metaData.childTextbookUnit.identifier') || _.get(content, 'identifier');
        contentIds.push(id);
      } else {
        contentIds.push(_.get(content, 'identifier'));
      }
    });

    return this.getPlayableContents(contentIds, isOnline)
      .pipe(map(playableContents => {
        offlineLinkedContents = playableContents.contents;
        const { constantData, metaData, dynamicFields } = this.configService.appConfig.GetPage;

        let contents = this.utilService.getDataForCard(offlineLinkedContents, constantData, dynamicFields, metaData);
        contents = this.utilService.addHoverData(contents, isOnline);

        return contents;
      }));
  }

  getPlayableContents(contentIds, isOnline) {
    return this.dialCodeService.getAllPlayableContent(contentIds, { params: { online: isOnline } }).pipe(
      map(contents => {
        return { contents };
      }));
  }

  prepareVisits(event) {
    this.visits = [...this.visits, ...event.visits];
    this.telemetryImpression.edata.visits = this.visits;
    this.telemetryImpression.edata.subtype = 'pageexit';
    this.telemetryImpression = Object.assign({}, this.telemetryImpression);
  }

  ngOnDestroy() {
    sessionStorage.removeItem('singleContentRedirect');
    EkTelemetry.config.batchsize = 10;
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
