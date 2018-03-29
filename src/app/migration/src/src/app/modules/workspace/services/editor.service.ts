import { ContentService, UserService } from '@sunbird/core';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ConfigService, ServerResponse, UserProfile } from '@sunbird/shared';


/**
 * Service to provides CRUD methods to make content api request by extending DataService.
 *
 */
@Injectable()
export class EditorService {
    /**
     * base Url for content api
     */
    baseUrl: string;
    /**
     * reference of config service.
     */
    public config: ConfigService;
    /**
   reference of userService
   */
    public user: UserService;
    /**
     * reference of lerner service.
     */
    public contentService: ContentService;

    public http: HttpClient;
    public creator: string;
    public createdBy: string;
    public createdFor: string;
    public organization: string;

    /**
     * constructor
     * @param {ConfigService} config ConfigService reference
     * @param {HttpClient} http HttpClient reference
     */
    constructor(config: ConfigService, http: HttpClient, user: UserService, contentService: ContentService) {
        this.config = config;
        this.contentService = contentService;
        this.baseUrl = this.config.urlConFig.URLS.CONTENT_PREFIX;
        this.user = user;
    }


    userDetails() {
        this.user.userData$.subscribe((data) => {
            // console.log("editor service", data);
            return data;
        }),
        // tslint:disable-next-line:no-unused-expression
        err => {
            console.log(err, 'Error in user details fetching');
        };
    }

    create(req) {
            const option = {
            url: this.config.urlConFig.URLS.CONTENT.CREATE,
            data: {
                'request': req
            }

        };

        // console.log("option: ", option);
        return this.contentService.post(option);
    }

    getById(req, qs) {
        const option = {
            url : this.config.urlConFig.URLS.CONTENT.GET + '/' + req.contentId,
            data: {
                req : req,
                qs: qs
            }
        };

        return this.contentService.get(option);
      }

}
