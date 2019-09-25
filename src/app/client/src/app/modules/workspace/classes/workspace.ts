import { WorkSpaceService } from './../services';
import { SearchService, UserService } from '@sunbird/core';
import { ResourceService, ServerResponse } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { mergeMap, catchError, map } from 'rxjs/operators';
import { throwError as observableThrowError, of as observableOf, Observable } from 'rxjs';
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
    * @param {WorkSpaceService} WorkSpaceService Reference of WorkSpaceService
    */
    constructor(searchService: SearchService, workSpaceService: WorkSpaceService, public userService: UserService) {
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
    * Search Api call and returns contents with lock status of each one
    */
    searchContentWithLockStatus(searchParams) {
        return this.search(searchParams).pipe(mergeMap((contentList: ServerResponse) => {
            if (contentList.result.count) {
                const inputParams = {
                    filters: {
                        resourceId: _.map(contentList.result.content, 'identifier')
                    }
                };
                return this.workSpaceService.getContentLockList(inputParams)
                    .pipe(map((lockList: ServerResponse) => ({contentList, lockList})));
            } else {
                return observableOf({contentList, lockList: undefined});
            }
        }), map(({contentList, lockList}) => {
            const contents = contentList.result.content;
            if (_.get(lockList, 'result.count')) {
                const lockDataKeyByContentId = _.keyBy(lockList.result.data, 'resourceId');
                _.each(contents, (eachContent, index) => {
                    const lockInfo = { ...lockDataKeyByContentId[eachContent.identifier]};
                    if (!_.isEmpty(lockInfo) && eachContent.status !== 'Live') {
                        lockInfo.creatorInfo = JSON.parse(lockInfo.creatorInfo);
                        contents[index].lockInfo = lockInfo;
                    }
                });
            }
            contentList.result.content = contents;
            return contentList;
        }));
    }

    /**
    * this call will prepare reuest object and call lock api
    */
    lockContent(content) {
        const input = {
            resourceId: content.identifier,
            resourceType: 'Content',
            resourceInfo: JSON.stringify(content),
            creatorInfo: JSON.stringify({ 'name': this.userService.userProfile.firstName, 'id': this.userService.userProfile.identifier }),
            createdBy: this.userService.userProfile.identifier
        };
        return this.workSpaceService.lockContent(input);
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

    /**
    * handle content lock api error
    */
    handleContentLockError(errObj) {
        let errorMessage = '';
        const customErrors = ['RESOURCE_SELF_LOCKED', 'RESOURCE_LOCKED'];
        if (errObj.error.params.err) {
            if (customErrors.indexOf(errObj.error.params.err) !== -1) {
                // api error message has resource in error text, need to replace it with content
                errorMessage = _.replace(errObj.error.params.errmsg, 'resource', 'content');
            }
        }
        return errorMessage;
    }

}
