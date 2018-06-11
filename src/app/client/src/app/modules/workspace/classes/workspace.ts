import { WorkSpaceService } from './../services';
import { SearchService } from '@sunbird/core';
import { ResourceService, ServerResponse } from '@sunbird/shared';
import * as _ from 'lodash';
/**
 * Base class for workspace module
*/
export class WorkSpace {
    /**
     * Reference for search service
    */
    public searchService: SearchService;
    /**
     * Reference for WorkSpaceService
    */
    public workSpaceService: WorkSpaceService;

    /**
    * Constructor to create injected service(s) object
    * Default method of Draft Component class
    * @param {SearchService} SearchService Reference of SearchService
      @param {WorkSpaceService} WorkSpaceService Reference of WorkSpaceService
    */
    constructor(searchService: SearchService, workSpaceService: WorkSpaceService ) {
        this.searchService = searchService;
        this.workSpaceService = workSpaceService;
    }
    /**
    * Search Api call
    */
    search(searchParams) {
        return this.searchService.compositeSearch(searchParams);
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
        return contentList.filter((content) => {
            return requestData.indexOf(content.metaData.identifier) === -1;
        });
    }
    /**
    * Batchlist  Api call
    */
    getBatches(searchParams) {
        return this.searchService.batchSearch(searchParams);
    }

    /**
    * userList  Api call
    */
    UserList(searchParams) {
        return this.searchService.getUserList(searchParams);
    }
}
