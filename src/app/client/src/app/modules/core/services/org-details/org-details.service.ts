import { LearnerService } from './../learner/learner.service';
import { throwError as observableThrowError, of as observableOf, Observable, BehaviorSubject } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ConfigService, ServerResponse, ToasterService, ResourceService } from '@sunbird/shared';
import { Router } from '@angular/router';
import { ContentService } from './../content/content.service';
import { PublicDataService } from './../public-data/public-data.service';

@Injectable()
export class OrgDetailsService {

  orgDetails: any;

  private _orgDetails$ = new BehaviorSubject<any>(undefined);

  public readonly orgDetails$: Observable<any> = this._orgDetails$.asObservable();

  constructor(public configService: ConfigService,
    public contentService: ContentService, public router: Router, public toasterService: ToasterService,
    public resourceService: ResourceService, public learnerService: LearnerService, public publicDataService: PublicDataService) {
  }

  getOrgDetails(slug?: string): Observable<ServerResponse> {
    const option = {
      url: this.configService.urlConFig.URLS.ADMIN.ORG_SEARCH,
      data: {
        request: {
          filters: { slug: slug || (<HTMLInputElement>document.getElementById('defaultTenant')).value }
        }
      }
    };
    if (this.orgDetails) {
      return observableOf(this.orgDetails);
    } else {
      return this.publicDataService.post(option).pipe(mergeMap((data: ServerResponse) => {
        if (data.result.response.count > 0) {
          this.orgDetails = data.result.response.content[0];
          this.setOrgDetailsToRequestHeaders();
          this._orgDetails$.next({ err: null, orgDetails: this.orgDetails });
          return observableOf(data.result.response.content[0]);
        } else {
          option.data.request.filters.slug = (<HTMLInputElement>document.getElementById('defaultTenant')).value;
          return this.publicDataService.post(option).pipe(mergeMap((responseData: ServerResponse) => {
            if (responseData.result.response.count > 0) {
              this.orgDetails = responseData.result.response.content[0];
              this.setOrgDetailsToRequestHeaders();
              this._orgDetails$.next({ err: null, orgDetails: this.orgDetails });
              return observableOf(responseData.result.response.content[0]);
            } else {
              this._orgDetails$.next({ err: responseData, orgDetails: this.orgDetails });
              observableThrowError(responseData);
            }
          }), catchError((err) => {
            this._orgDetails$.next({ err: err, orgDetails: this.orgDetails });
            return observableThrowError(err);
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
}

