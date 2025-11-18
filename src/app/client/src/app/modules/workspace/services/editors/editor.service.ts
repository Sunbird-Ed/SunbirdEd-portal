import { ContentService, PublicDataService, UserService } from '@sunbird/core';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ConfigService, ServerResponse } from '@sunbird/shared';
import { map, catchError } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { WorkSpaceService } from './../work-space/workspace.service';
import { CslFrameworkService } from '../../../public/services/csl-framework/csl-framework.service';

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
    constructor(configService: ConfigService, contentService: ContentService, publicDataService: PublicDataService,
        public workspaceService: WorkSpaceService, public userService: UserService, public cslFrameworkService: CslFrameworkService) {
        this.configService = configService;
        this.contentService = contentService;
        this.baseUrl = this.configService.urlConFig.URLS.CONTENT_PREFIX;
        this.publicDataService = publicDataService;
        this.cslFrameworkService = cslFrameworkService;
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

    getOwnershipType() {
        const formServiceInputParams = {
            formType: 'content',
            subType: 'all',
            formAction: 'ownership',
            rootOrgId: this.userService.userProfile.rootOrgId
        };
        return this.workspaceService.getFormData(formServiceInputParams).pipe(
            map(data => {
                return _.get(data, 'result.form.data.fields[0].ownershipType') ?
                data.result.form.data.fields[0].ownershipType : ['createdBy'];
            }), catchError(error => {
                return of(['createdBy']);
            })
        );
    }
}
