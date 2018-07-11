import { LearnerService } from './../learner/learner.service';
import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
import {map, mergeMap} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ConfigService, ServerResponse, ToasterService, ResourceService } from '@sunbird/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from './../content/content.service';
import { SearchParam } from './../../interfaces/search';

@Injectable()
export class OrgDetailsService {
  orgDetails: any;
  constructor(public configService: ConfigService,
    public contentService: ContentService, public router: Router, public toasterService: ToasterService,
    public resourceService: ResourceService, public learnerService: LearnerService) {
  }

  getChannel(slug?: string): Observable<ServerResponse> {
    const option = {
      url: this.configService.urlConFig.URLS.ADMIN.ORG_SEARCH,
      data: {
        request: {
          filters: { slug: slug || (<HTMLInputElement>document.getElementById('defaultTenant')).value }
        }
      }
    };

    return this.contentService.post(option).pipe(
      mergeMap((data: ServerResponse) => {
        if (data.result.response.count > 0) {
          return observableOf(data.result.response.content[0].hashTagId);
        } else {
          option.data.request.filters.slug = (<HTMLInputElement>document.getElementById('defaultTenant')).value;
          return this.contentService.post(option).pipe(
            map((responseData: ServerResponse) => {
              try {
                return responseData.result.response.content[0].hashTagId;
              } catch (error) {
                this.toasterService.error(this.resourceService.messages.emsg.m0005);
                this.router.navigate(['']);
              }
            }));
        }
      }));
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
      return this.contentService.post(option).pipe(mergeMap((data: ServerResponse) => {
        if (data.result.response.count > 0) {
          this.orgDetails = data.result.response.content[0];
          this.setOrgDetailsToRequestHeaders();
          return observableOf(data.result.response.content[0]);
        } else {
          option.data.request.filters.slug = (<HTMLInputElement>document.getElementById('defaultTenant')).value;
          return this.contentService.post(option).pipe(mergeMap((responseData: ServerResponse) => {
            if (responseData.result.response.count > 0) {
              this.orgDetails = responseData.result.response.content[0];
              this.setOrgDetailsToRequestHeaders();
              return observableOf(responseData.result.response.content[0]);
            } else {
              observableThrowError(responseData);
            }
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
  }
}

