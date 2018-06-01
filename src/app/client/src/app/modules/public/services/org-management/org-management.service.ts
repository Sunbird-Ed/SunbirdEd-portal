import { Injectable } from '@angular/core';
import { ConfigService, ServerResponse, ToasterService, ResourceService } from '@sunbird/shared';
import { Observable } from 'rxjs/Observable';
import { SearchService, SearchParam, ContentService } from '@sunbird/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable()
export class OrgManagementService {

  constructor(public configService: ConfigService, public searchService: SearchService,
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
}
