import { LearnerService } from './../learner/learner.service';
import { Injectable } from '@angular/core';
import { UserService  } from './../user/user.service';
import {
  ConfigService, ToasterService, ResourceService, ServerResponse, Framework, FrameworkData,
  BrowserCacheTtlService
} from '@sunbird/shared';
import { Observable, BehaviorSubject } from 'rxjs';
import { skipWhile, mergeMap, map } from 'rxjs/operators';
import { PublicDataService } from './../public-data/public-data.service';
import * as _ from 'lodash-es';
import { FormService } from '../form/form.service';
const frameWorkPrefix = 'framework_';
@Injectable({
  providedIn: 'root'
})
export class FrameworkService {
  _frameworkData: FrameworkData = {};
  private _channelData: any = {};
  _frameworkData$ = new BehaviorSubject<Framework>(undefined);
  private _channelData$ = new BehaviorSubject<any>(undefined);
  private _defaultCourseFrameworkName = '';
  public readonly frameworkData$: Observable<Framework> = this._frameworkData$
    .asObservable().pipe(skipWhile(data => data === undefined || data === null));
  public readonly channelData$: Observable<any> = this._channelData$
    .asObservable().pipe(skipWhile(data => data === undefined || data === null));

  constructor(private browserCacheTtlService: BrowserCacheTtlService,
    private userService: UserService, private configService: ConfigService,
    public toasterService: ToasterService, public resourceService: ResourceService,
    private publicDataService: PublicDataService, public learnerService: LearnerService,
    public formService: FormService
  ) { }

  public initialize(framework?: string, hashTagId?: string) {
    if (framework && !_.get(this._frameworkData, framework)) {
      this.getFrameworkCategories(framework).subscribe((frameworkData: ServerResponse) => {
          const frameWorkName = framework ? framework : 'defaultFramework';
          this._frameworkData[frameWorkName] = frameworkData.result.framework;
          this._frameworkData$.next({ err: null, frameworkdata: this._frameworkData });
        }, err => {
          this._frameworkData$.next({ err: err, frameworkdata: null });
      });
      } else if (_.get(this._frameworkData, framework)) {
        this._frameworkData$.next({ err: null, frameworkdata: this._frameworkData });
      } else {
        if (!_.get(this._frameworkData, 'defaultFramework')) {
          this.getChannel(hashTagId ? hashTagId : this.userService.hashTagId)
            .pipe(mergeMap(data => {
              this._channelData = data.result.channel;
              this._channelData$.next({ err: null, channelData: this._channelData });
             return this.getFrameworkCategories(_.get(data, 'result.channel.defaultFramework'));
            })).subscribe(
              (frameworkData: ServerResponse) => {
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
  public getChannel(hashTagId) {
    const channelOptions = {
      url: this.configService.urlConFig.URLS.CHANNEL.READ + '/' + hashTagId
    };
    return this.publicDataService.get(channelOptions);
  }
  public getFrameworkCategories(frameworkId: string, mode?: string) { // used in workspace, course
    const frameworkOptions = {
      url: this.configService.urlConFig.URLS.FRAMEWORK.READ + '/' + frameworkId + (mode ? "?mode=" + mode : ''),
    };
    return this.publicDataService.get(frameworkOptions);
  }
  public getSelectedFrameworkCategories(frameworkId: string, queryParams?: object) { // used in library/search pages
    const frameworkOptions = {
      url: this.configService.urlConFig.URLS.FRAMEWORK.READ + '/' + frameworkId,
      ...queryParams && { param: queryParams}
    };
    return this.publicDataService.get(frameworkOptions);
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

  /**
   * @param  {string} hashTagId - user channel ID
   * @returns - default course framework (TPD or custom framework of the tenant )
   */
  public getDefaultCourseFramework(hashTagId?: string) {
    // const cachedDefaultCourseFramework = this.cacheService.get('defaultCourseFramework');
    // if (cachedDefaultCourseFramework) {
    //   return of(cachedDefaultCourseFramework);
    // } else {
      const userHashTagId = hashTagId ? hashTagId : this.userService.hashTagId;
      return this.getChannel(userHashTagId).pipe(map (channelData => {
        this._defaultCourseFrameworkName = _.get(channelData, 'result.channel.defaultCourseFramework');
        // this.cacheService.set('defaultCourseFramework', this._defaultCourseFrameworkName,
        //   { maxAge: this.browserCacheTtlService.browserCacheTtl });
        return this._defaultCourseFrameworkName;
      }));
    // }
  }

  getSortedFilters(filters, type) {
    return (type === 'gradeLevel' || _.lowerCase(type) === 'class') ?
   _.sortBy(filters, ['index', 'name']) : _.sortBy(filters, 'name');
 }

 async getSegmentationCommands() {

  const formRequest = {
    formType: 'config',
    contentType: 'segmentation_v2',
    formAction: 'get'
  };
  return (await this.formService.getFormConfig(formRequest).toPromise() as any);
}

/**
 * Retire a framework
 * @param {string} frameworkId - The ID of the framework to retire
 * @returns Observable<ServerResponse>
 */
public retireFramework(frameworkId: string): Observable<ServerResponse> {
  const retireOptions = {
    url: `framework/v3/retire/${frameworkId}`,
    header: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };
  return this.publicDataService.delete(retireOptions);
}

/**
 * Retire a term within a framework
 * @param {object} requestData - The data containing category, code, and framework
 * @returns Observable<ServerResponse>
 */
public retireTerm(requestData: any): Observable<ServerResponse> {
  const { category, code, framework } = requestData;
  
  const retireOptions = {
    url: `framework/v3/term/retire/${code}?framework=${framework}&category=${category}`,
    header: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };
  return this.publicDataService.delete(retireOptions);
}

}
