import { ContentService } from '@sunbird/core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ConfigService, ServerResponse } from '@sunbird/shared';

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
     * reference of lerner service.
     */
    public contentService: ContentService;


    /**
     * constructor
     * @param {ConfigService} config ConfigService reference
     * @param {HttpClient} http HttpClient reference
     */
    constructor(config: ConfigService, contentService: ContentService) {
        this.config = config;
        this.contentService = contentService;
        this.baseUrl = this.config.urlConFig.URLS.CONTENT_PREFIX;
    }

    /**
     * Create content Id for the editor
     * @param req
     */
    create(req) {
        const option = {
            url: this.config.urlConFig.URLS.CONTENT.CREATE,
            data: {
                'request': req
            }
        };

        return this.contentService.post(option);
    }

}


