import { Injectable } from '@angular/core';
import { UserService } from './../user/user.service';
import {
  ConfigService, ToasterService, ResourceService, ServerResponse, Framework, FrameworkData,
  BrowserCacheTtlService
} from '@sunbird/shared';
import { Observable, BehaviorSubject } from 'rxjs';
import { skipWhile, mergeMap } from 'rxjs/operators';
import { PublicDataService } from './../public-data/public-data.service';
import * as _ from 'lodash';
import { CacheService } from 'ng2-cache-service';
@Injectable()
export class FrameworkService {
  private _frameworkData: FrameworkData = {};

  private _frameworkData$ = new BehaviorSubject<Framework>(undefined);

  public readonly frameworkData$: Observable<Framework> = this._frameworkData$
    .asObservable().pipe(skipWhile(data => data === undefined || data === null));

  constructor(private cacheService: CacheService, private browserCacheTtlService: BrowserCacheTtlService,
     private userService: UserService, private configService: ConfigService,
    public toasterService: ToasterService, public resourceService: ResourceService,
    private publicDataService: PublicDataService
  ) {}

  public initialize(framework?: string, hashTagId?: string) {

    if (framework && !_.get(this._frameworkData, framework)) {

      this.getFrameworkCategories(framework).subscribe(
        (frameworkData: ServerResponse) => {
          this.setFrameWorkData(frameworkData);
          const frameWorkName = framework ? framework : 'defaultFramework';
          this._frameworkData[frameWorkName] = frameworkData.result.framework;
          this._frameworkData$.next({ err: null, frameworkdata: this._frameworkData});
        },
        err => {
          this._frameworkData$.next({ err: err, frameworkdata: null });
      });
    } else {
      if (!_.get(this._frameworkData, 'defaultFramework')) {

        this.getDefaultFrameWork(hashTagId ? hashTagId : this.userService.hashTagId)
          .pipe(mergeMap(data => {
              this.cacheService.set(hashTagId ? hashTagId : this.userService.hashTagId , data.result.channel,
                { maxAge: this.browserCacheTtlService.browserCacheTtl });
              return this.getFrameworkCategories(_.get(data, 'result.channel.defaultFramework'));
          })).subscribe(
            (frameworkData: ServerResponse) => {
              this.setFrameWorkData(frameworkData);
              const frameWorkName = framework ? framework : 'defaultFramework';
              this._frameworkData[frameWorkName] = frameworkData.result.framework;
              this._frameworkData$.next({ err: null, frameworkdata: this._frameworkData});
            },
            err => {
              this._frameworkData$.next({ err: err, frameworkdata: null });
          });
      }
    }
  }
  private getDefaultFrameWork(hashTagId) {
    const channelOptions = {
      url: this.configService.urlConFig.URLS.CHANNEL.READ + '/' + hashTagId
    };
    return this.publicDataService.get(channelOptions);
  }
  private getFrameworkCategories(framework: string) {
    const frameworkOptions = {
      url: this.configService.urlConFig.URLS.FRAMEWORK.READ + '/' + framework
    };
    return this.publicDataService.get(frameworkOptions);
  }

  private setFrameWorkData(frameWork) {
    this.cacheService.set(frameWork.result.framework.code , frameWork.result.framework,
      { maxAge: this.browserCacheTtlService.browserCacheTtl });
  }
}
