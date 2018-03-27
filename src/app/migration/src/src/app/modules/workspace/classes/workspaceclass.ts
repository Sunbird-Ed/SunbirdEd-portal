import { WorkSpaceService } from './../services/work-space.service';
import { SearchService } from '@sunbird/core';
import { ResourceService, ServerResponse } from '@sunbird/shared';
import * as _ from 'lodash';
/**
 * Base class for workspace module
*/
export class Workspaceclass {
    /**
     * Refernce for search service
    */
    public searchService: SearchService;
    /**
     * Refernce for search service
    */
     public workSpaceService: WorkSpaceService;

    /**
    * Constructor to create injected service(s) object
    * Default method of Draft Component class
    * @param {SearchService} SearchService Reference of SearchService
      @param {WorkSpaceService} WorkSpaceService Reference of WorkSpaceService
    */
    constructor(searchService: SearchService, workSpaceService: workSpaceService ) {
        this.searchService = searchService;
        this.workSpaceService = workSpaceService;
    }
    /**
    * Search Api call
    */
    search(searchParams) {
        return this.searchService.searchContentByUserId(searchParams);
    }
    /**
    * Delete  Api call .
    */
    delete(contentIds) {
        const DeleteParam = {
            contentIds: [contentIds]
        };
        return this.workSpaceService.deleteContent(DeleteParam);
    }
    /**
    * Method to remove content localcaly
    */
    removeContent(contentList, requestData) {
        return contentList.filter(function(content) {
            return requestData.indexOf(content.identifier) === -1;
        });
    }
}
