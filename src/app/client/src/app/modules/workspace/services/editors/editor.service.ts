import { ContentService, PublicDataService } from '@sunbird/core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService, ServerResponse } from '@sunbird/shared';
import { map } from 'rxjs/operators';

/**
 * Service to provides CRUD methods to make content api request by extending DataService.
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
    public configService: ConfigService;
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
     */
    constructor(configService: ConfigService, contentService: ContentService, publicDataService: PublicDataService) {
        this.configService = configService;
        this.contentService = contentService;
        this.baseUrl = this.configService.urlConFig.URLS.CONTENT_PREFIX;
        this.publicDataService = publicDataService;
    }

    /**
     * Create content Id for the editor
     * @param req OBJECT
     */
    create(req): Observable<ServerResponse> {
        const option = {
            url: this.configService.urlConFig.URLS.CONTENT.CREATE,
            data: {
                'request': req
            }
        };
        return this.contentService.post(option);
    }
    /**
     * get content details by id and query param
     */
    getContent(contentId: string, option: any = { params: {} }): Observable<ServerResponse> {
        const param = { fields: this.configService.editorConfig.DEFAULT_PARAMS_FIELDS };
        const req = {
            url: `${this.configService.urlConFig.URLS.CONTENT.GET}/${contentId}`,
            param: { ...param, ...option.params }
        };
        return this.publicDataService.get(req).pipe(map((response: ServerResponse) => {
            return response;
        }));
    }
}


