import { LearnerService } from './../learner/learner.service';
import { Injectable } from '@angular/core';
import { UserService  } from './../user/user.service';
import {
  ConfigService, ToasterService, ResourceService, ServerResponse, Framework, FrameworkData,
  BrowserCacheTtlService
} from '@sunbird/shared';
import { Observable, BehaviorSubject } from 'rxjs';
import { skipWhile, mergeMap } from 'rxjs/operators';
import { PublicDataService } from './../public-data/public-data.service';
import * as _ from 'lodash-es';
import { CacheService } from 'ng2-cache-service';
@Injectable({
  providedIn: 'root'
})
export class FrameworkService {
  private _frameworkData: FrameworkData = {};
  private _channelData: any = {};
  private _frameworkData$ = new BehaviorSubject<Framework>(undefined);
  private _channelData$ = new BehaviorSubject<any>(undefined);
  public readonly frameworkData$: Observable<Framework> = this._frameworkData$
    .asObservable().pipe(skipWhile(data => data === undefined || data === null));
  public readonly channelData$: Observable<any> = this._channelData$
    .asObservable().pipe(skipWhile(data => data === undefined || data === null));

  constructor(private cacheService: CacheService, private browserCacheTtlService: BrowserCacheTtlService,
    private userService: UserService, private configService: ConfigService,
    public toasterService: ToasterService, public resourceService: ResourceService,
    private publicDataService: PublicDataService, public learnerService: LearnerService
  ) { }

  public initialize(framework?: string, hashTagId?: string) {
    const channelKey =  hashTagId ? hashTagId : this.userService.hashTagId;
    const  channelData = this.cacheService.get(channelKey);
    const frameWorkKey = framework ? framework : _.get(channelData, 'defaultFramework');
    if ( frameWorkKey && this.cacheService.get(frameWorkKey)) {
      const data = this.cacheService.get(frameWorkKey);
      const frameWorkName = framework ? framework : 'defaultFramework';
      this._frameworkData[frameWorkName] = data;
      this._frameworkData$.next({ err: null, frameworkdata: this._frameworkData });
      this._channelData$.next({ err: null, channelData: channelData });
      this._channelData = channelData;
    } else {
      if (framework && !_.get(this._frameworkData, framework)) {

        this.getFrameworkCategories(framework).subscribe(
          (frameworkData: ServerResponse) => {
            this.setFrameWorkData(frameworkData);
            const frameWorkName = framework ? framework : 'defaultFramework';
            this._frameworkData[frameWorkName] = frameworkData.result.framework;
            this._frameworkData$.next({ err: null, frameworkdata: this._frameworkData });
          },
          err => {
            this._frameworkData$.next({ err: err, frameworkdata: null });
          });
      } else {
        if (!_.get(this._frameworkData, 'defaultFramework')) {
          this.getDefaultFrameWork(hashTagId ? hashTagId : this.userService.hashTagId)
            .pipe(mergeMap(data => {
              this.setChannelData(hashTagId ? hashTagId : this.userService.hashTagId, data);
              this._channelData = data.result.channel;
              this._channelData$.next({ err: null, channelData: this._channelData });
             return this.getFrameworkCategories(_.get(data, 'result.channel.defaultFramework'));
            })).subscribe(
              (frameworkData: ServerResponse) => {
               this.setFrameWorkData(frameworkData);
               const frameWorkName = framework ? framework : 'defaultFramework';
                this._frameworkData[frameWorkName] = frameworkData.result.framework;
                this._frameworkData$.next({ err: null, frameworkdata: this._frameworkData });
              },
              err => {
                this._frameworkData$.next({ err: err, frameworkdata: null });
              });
        }
      }
    }
  }
  private getDefaultFrameWork(hashTagId) {
    const channelOptions = {
      url: this.configService.urlConFig.URLS.CHANNEL.READ + '/' + hashTagId
    };
    return this.publicDataService.get(channelOptions);
  }
  public getFrameworkCategories(framework: string) {
    const frameworkOptions = {
      url: this.configService.urlConFig.URLS.FRAMEWORK.READ + '/' + framework
    };
    return this.publicDataService.get(frameworkOptions);
  }

  private setFrameWorkData(framework?: any) {
    this.cacheService.set(framework.result.framework.code  , framework.result.framework,
      { maxAge: this.browserCacheTtlService.browserCacheTtl });
  }

  private setChannelData(hashTagId, channelData) {
    this.cacheService.set(hashTagId ? hashTagId : this.userService.hashTagId , channelData.result.channel,
      { maxAge: this.browserCacheTtlService.browserCacheTtl });
  }
  public getCourseFramework() {
    const systemSetting = {
      url: this.configService.urlConFig.URLS.COURSE_FRAMEWORK.COURSE_FRAMEWORKID,
    };
    return this.learnerService.get(systemSetting);
  }

  public getDefaultLicense() {
    return _.get(this._channelData, 'defaultLicense');
  }

}
