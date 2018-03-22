import { WorkSpaceService } from './../services/work-space.service';
import { SearchService } from '@sunbird/core';
import { ResourceService, ServerResponse } from '@sunbird/shared';

/**
 * Base class for workspace module
 */
export class Workspaceclass {
    /**
* Constructor to create injected service(s) object
*
* Default method of Draft Component class
* @param {SearchService} SearchService Reference of SearchService
 @param {WorkSpaceService} WorkSpaceService Reference of WorkSpaceService
*/
    constructor(public searchService: SearchService, public workSpaceService: WorkSpaceService ) {
    }

    search(pageNumber, pageLimit) {
        /**
        * Search Api call
         */
        const searchParams = {
            status: ['Draft'],
            contentType: ['Collection', 'TextBook', 'Course', 'LessonPlan', 'Resource'],
            mimeType: ['application/vnd.ekstep.ecml-archive', 'application/vnd.ekstep.content-collection'],
            pageNumber: pageNumber,
            limit: pageLimit,
            params: { lastUpdatedOn: 'desc' }
        };
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
