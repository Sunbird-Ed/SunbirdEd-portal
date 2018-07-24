import { ContentService, PublicDataService } from '@sunbird/core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
     * reference of content service.
     */
    public contentService: ContentService;

    /**
     * reference of lerner service.
     */
    public publicDataService: PublicDataService;


    /**
     * constructor
     * @param {ConfigService} config ConfigService reference
     * @param {HttpClient} http HttpClient reference
     */
    constructor(config: ConfigService, contentService: ContentService,
        publicDataService: PublicDataService) {
        this.config = config;
        this.contentService = contentService;
        this.baseUrl = this.config.urlConFig.URLS.CONTENT_PREFIX;
        this.publicDataService = publicDataService;
    }

    /**
     * Create content Id for the editor
     * @param req
     */
    create(req): Observable<ServerResponse> {
        const option = {
            url: this.config.urlConFig.URLS.CONTENT.CREATE,
            data: {
                'request': req
            }
        };
        return this.contentService.post(option);
    }
/**
 *Create Editor and assign parameters
 */
    getById(req, qs): Observable<ServerResponse> {
        const option = {
            url : this.config.urlConFig.URLS.CONTENT.GET + '/' + req.contentId + '?fields=' + qs.fields + '&mode=' + qs.mode
        };
        return this.publicDataService.get(option);
      }
}


