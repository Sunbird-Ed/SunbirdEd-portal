import { Injectable } from '@angular/core';
import { ConfigService, ServerResponse, ToasterService, ResourceService } from '@sunbird/shared';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from './../content/content.service';
import { SearchParam } from './../../interfaces/search';

@Injectable()
export class OrgDetailsService {
  orgDetails: any;
  constructor(public configService: ConfigService,
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
          return Observable.of(data.result.response.content[0]);
        } else {
          option.data.request.filters.slug = (<HTMLInputElement>document.getElementById('defaultTenant')).value;
          return this.contentService.post(option).flatMap((responseData: ServerResponse) => {
            if (responseData.result.response.count > 0) {
              this.orgDetails = responseData.result.response.content[0];
              return Observable.of(responseData.result.response.content[0]);
            } else {
              Observable.throw(responseData);
            }
          });
        }
      });
    }
  }
}

