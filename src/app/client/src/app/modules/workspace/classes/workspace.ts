import { WorkSpaceService } from './../services';
import { SearchService, UserService } from '@sunbird/core';
import { ResourceService, ServerResponse } from '@sunbird/shared';
import * as _ from 'lodash';
import { mergeMap, catchError } from 'rxjs/operators';
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
    * Reference of user service.
    */
    public user: UserService;

    /**
    * Constructor to create injected service(s) object
    * Default method of Draft Component class
    * @param {SearchService} SearchService Reference of SearchService
      @param {WorkSpaceService} WorkSpaceService Reference of WorkSpaceService
    */
    constructor( searchService: SearchService, workSpaceService: WorkSpaceService, user: UserService ) {
        this.searchService = searchService;
        this.workSpaceService = workSpaceService;
        this.user = user;
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
        return this.search(searchParams).pipe(mergeMap((data: ServerResponse) => {
            if (data.result.count > 0) {
                const contents = data.result.content;
                const inputParams = {
                    filters: {
                        'resourceId' : _.map(contents, 'identifier')
                    }
                };
                return this.workSpaceService.getContentLockList(inputParams).pipe(mergeMap((responseData: ServerResponse) => {
                    if (responseData.result.count > 0) {
                        const lockDataKeyByContentId = _.keyBy(responseData.result.data, 'resourceId');
                        _.each(contents, (eachcontent, index) => {
                            const lockInfo = lockDataKeyByContentId[eachcontent.identifier];
                            if (lockInfo) {
                                lockInfo.creatorInfo = JSON.parse(lockInfo.creatorInfo);
                                contents[index].lockInfo = lockInfo;
                            }
                        });
                    }
                    data.result.content = contents;
                    return observableOf(data);
                }));
            } else {
                return observableOf(data);
            }
        }), catchError((err) => {
            return observableThrowError(err);
        }));
    }

    /**
    * this call will prepare reuest object and call lock api
    */
    lockContent (content) {
        const input = {
          resourceId : content.identifier,
          resourceType : 'Content',
          resourceInfo : JSON.stringify(content),
          creatorInfo : JSON.stringify({'name': this.user.userProfile.firstName, 'id': this.user.userProfile.identifier}),
          createdBy : this.user.userProfile.identifier
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
}
