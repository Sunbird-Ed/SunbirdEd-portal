import {throwError, of, Observable, BehaviorSubject} from 'rxjs';
import { mergeMap, map, catchError, skipWhile } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ConfigService, ServerResponse, ToasterService, ResourceService, BrowserCacheTtlService } from '@sunbird/shared';
import { Router } from '@angular/router';
import { ContentService } from './../content/content.service';
import { PublicDataService } from './../public-data/public-data.service';
import { CacheService } from 'ng2-cache-service';
import { LearnerService } from './../learner/learner.service';
import * as _ from 'lodash-es';

@Injectable({
  providedIn: 'root'
})
export class OrgDetailsService {

  orgDetails: any;
  orgInfo: any;
  timeDiff: any;
  custodianOrgDetails: any;

  private _orgDetails$ = new BehaviorSubject<any>(undefined);
  /**
   * Contains root org id
   */
  public _rootOrgId: string;

  public readonly orgDetails$: Observable<any> = this._orgDetails$.asObservable()
  .pipe(skipWhile(data => data === undefined || data === null));

  constructor(public configService: ConfigService, private cacheService: CacheService,
    private browserCacheTtlService: BrowserCacheTtlService,
    public contentService: ContentService, public router: Router, public toasterService: ToasterService,
    public resourceService: ResourceService, public learnerService: LearnerService, public publicDataService: PublicDataService) {
  }

  getOrgDetails(slug?: string): Observable<ServerResponse> {
    const option = {
      url: this.configService.urlConFig.URLS.ADMIN.ORG_SEARCH,
      data: {
        request: {
          filters: {
            slug: slug || (<HTMLInputElement>document.getElementById('defaultTenant')).value,
            isRootOrg: true
          }
        }
      }
    };
    if (this.orgDetails) {
      return of(this.orgDetails);
    } else {
      return this.publicDataService.postWithHeaders(option).pipe(mergeMap((data: ServerResponse) => {
        if (data.ts) {
          // data.ts is taken from header and not from api response ts, and format in IST
          this.timeDiff = data.ts;
        }
        if (data.result.response.count > 0) {
          this.orgDetails = data.result.response.content[0];
          this._rootOrgId = this.orgDetails.rootOrgId;
          this.setOrgDetailsToRequestHeaders();
          this._orgDetails$.next({ err: null, orgDetails: this.orgDetails });
          return of(data.result.response.content[0]);
        } else {
          option.data.request.filters.slug = (<HTMLInputElement>document.getElementById('defaultTenant')).value;
          return this.publicDataService.post(option).pipe(mergeMap((responseData: ServerResponse) => {
            if (responseData.result.response.count > 0) {
              this.orgDetails = responseData.result.response.content[0];
              this._rootOrgId = this.orgDetails.rootOrgId;
              this.setOrgDetailsToRequestHeaders();
              this._orgDetails$.next({ err: null, orgDetails: this.orgDetails });
              return of(responseData.result.response.content[0]);
            } else {
              this._orgDetails$.next({ err: responseData, orgDetails: this.orgDetails });
              throwError(responseData);
            }
          }), catchError((err) => {
            this._orgDetails$.next({ err: err, orgDetails: this.orgDetails });
            return throwError(err);
          }));
        }
      }));
    }
  }
  setOrgDetailsToRequestHeaders() {
    this.learnerService.rootOrgId = this.orgDetails.rootOrgId;
    this.learnerService.channelId = this.orgDetails.channel;
    this.contentService.rootOrgId = this.orgDetails.rootOrgId;
    this.contentService.channelId = this.orgDetails.channel;
    this.publicDataService.rootOrgId = this.orgDetails.rootOrgId;
    this.publicDataService.channelId = this.orgDetails.channel;
  }

  searchOrg() {
    const option = {
      url: this.configService.urlConFig.URLS.ADMIN.ORG_SEARCH,
      data: {
        request: {
          filters: {
            isRootOrg: true
          }
        }
      }
    };
    const orgDetails: any = this.cacheService.get('orgDetails');
    if (orgDetails) {
      return of(orgDetails);
    } else {
      return this.publicDataService.post(option).pipe(mergeMap((data: ServerResponse) => {
        if (data.result.response.count > 0) {
          this.setOrgDetails(data.result.response);
          return of(data.result.response);
        }
      }));
    }
  }

  setOrgDetails(data) {
    this.cacheService.set('orgDetails', data, {
      maxAge: this.browserCacheTtlService.browserCacheTtl
    });
  }
  public setOrg(orgdata) {
    this.orgInfo = orgdata;
  }

  public getOrg(): void {
    return this.orgInfo;
  }

  public getCustodianOrgDetails() {
    if (this.custodianOrgDetails) {
      return of(this.custodianOrgDetails);
    }
    return this.getCustodianOrg().pipe(map(custodianOrgDetails => {
      this.custodianOrgDetails = custodianOrgDetails;
      return custodianOrgDetails;
    }));
  }

  getCustodianOrg() {
    const systemSetting = {
      url: this.configService.urlConFig.URLS.SYSTEM_SETTING.CUSTODIAN_ORG,
    };
    return this.learnerService.get(systemSetting);
  }

  /**
   * orgids should be ordered by preference based on comming soon obj will be returned
   */
  getCommingSoonMessage(orgids) {
    if (!orgids) {
      return of({});
    }
    const contentComingSoon: any = this.cacheService.get('contentComingSoon');
    if (contentComingSoon) {
      return of(this.getCommingSoonMessageObj(contentComingSoon, orgids));
    } else {
      const systemSetting = {
        url: this.configService.urlConFig.URLS.SYSTEM_SETTING.COMMING_SOON_MESSAGE,
      };
      return this.learnerService.get(systemSetting).pipe(map((data: ServerResponse) => {
        if (_.has(data, 'result.response')) {
          let commingSoonData = {};
          try {
            commingSoonData = JSON.parse(data.result.response.value);
          } catch (e) {}
          this.cacheService.set('contentComingSoon', commingSoonData, {
            maxAge: this.browserCacheTtlService.browserCacheTtl
          });
          return this.getCommingSoonMessageObj(commingSoonData, orgids);
        } else {
          return {};
        }
      }), catchError((err) => {
        return of({});
      }));
    }
  }

  getCommingSoonMessageObj (data, orgids) {
    let commingSoonMessageObj = {};
    if (data && data.length) {
      _.forEach(orgids, (eachrootorg) => {
        commingSoonMessageObj = _.find(data, {rootOrgId: eachrootorg});
        if (commingSoonMessageObj) {
          return false;
        }
      });
    }
    return commingSoonMessageObj;
  }

  get getServerTimeDiff() {
    return this.timeDiff;
  }

  get getRootOrgId() {
    return this._rootOrgId;
  }

  fetchOrgs(filters) {
    const option = {
      url: this.configService.urlConFig.URLS.ADMIN.ORG_SEARCH,
      data: {
        request: filters
      }
    };

    return this.publicDataService.post(option);
  }
}


