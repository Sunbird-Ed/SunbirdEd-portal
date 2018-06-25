import { Injectable } from '@angular/core';
import { ConfigService, ServerResponse, ToasterService, ResourceService } from '@sunbird/shared';
import { Observable } from 'rxjs/Observable';
import { SearchService, SearchParam, ContentService, LearnerService } from '@sunbird/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable()
export class OrgManagementService {
  orgDetails: any;
  constructor(public configService: ConfigService, public searchService: SearchService, public learnerService: LearnerService,
    public contentService: ContentService, public router: Router, public toasterService: ToasterService,
    public resourceService: ResourceService) {
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

    return this.contentService.post(option)
      .flatMap((data: ServerResponse) => {
        if (data.result.response.count > 0) {
          return Observable.of(data.result.response.content[0].hashTagId);
        } else {
          option.data.request.filters.slug = (<HTMLInputElement>document.getElementById('defaultTenant')).value;
          return this.contentService.post(option)
            .map((responseData: ServerResponse) => {
              try {
                return responseData.result.response.content[0].hashTagId;
              } catch (error) {
                this.toasterService.error(this.resourceService.messages.emsg.m0005);
                this.router.navigate(['']);
              }
            });
        }
      });
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
      return Observable.of(this.orgDetails);
    } else {
      return this.contentService.post(option).flatMap((data: ServerResponse) => {
        if (data.result.response.count > 0) {
          this.orgDetails = data.result.response.content[0];
          this.setOrgDetailsToRequestHeaders();
          return Observable.of(data.result.response.content[0]);
        } else {
          option.data.request.filters.slug = (<HTMLInputElement>document.getElementById('defaultTenant')).value;
          return this.contentService.post(option).flatMap((responseData: ServerResponse) => {
            if (responseData.result.response.count > 0) {
              this.orgDetails = responseData.result.response.content[0];
              this.setOrgDetailsToRequestHeaders();
              return Observable.of(responseData.result.response.content[0]);
            } else {
              Observable.throw(responseData);
            }
          });
        }
      });
    }
  }
  setOrgDetailsToRequestHeaders() {
    this.learnerService.rootOrgId = this.orgDetails.rootOrgId;
    this.learnerService.channelId = this.orgDetails.channel;
    this.contentService.rootOrgId = this.orgDetails.rootOrgId;
    this.contentService.channelId = this.orgDetails.channel;
  }
}
