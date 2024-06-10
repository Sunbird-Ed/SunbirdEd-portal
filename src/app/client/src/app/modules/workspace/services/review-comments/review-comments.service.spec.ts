
/**
* Description.
* This spec file was created using ng-test-barrel plugin!
*
*/

import { ConfigService } from '@sunbird/shared';
import { ExtPluginService } from '@sunbird/core';
import { ReviewCommentsService } from './review-comments.service';

describe('ReviewCommentsService', () => {
    let component: ReviewCommentsService;

    const configService: Partial<ConfigService> = {
        urlConFig: {
            URLS: {
                REVIEW_COMMENT: {
                    READ: 'review/comment/v1/read/comment',
                    DELETE: 'review/comment/v1/delete/comment',
                    CREATE: 'review/comment/v1/create/comment'
                }
            }
        }
    };
    const extPluginService: Partial<ExtPluginService> = {
        post: jest.fn(),
        delete: jest.fn(),

    };

    beforeAll(() => {
        component = new ReviewCommentsService(
            configService as ConfigService,
            extPluginService as ExtPluginService
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it('should call getComments', () => {
        component.getComments({});
        expect(extPluginService.post).toHaveBeenCalled();
    });

    it('should call createComment', () => {
        component.createComment({});
        expect(extPluginService.post).toHaveBeenCalled();
    });

    it('should call deleteComment', () => {
        component.deleteComment({});
        expect(extPluginService.delete).toHaveBeenCalled();
    });

    it('should set and get contextDetails correctly', () => {
        const contextDetails = { example: 'details' };
        component.contextDetails = contextDetails;
        const retrievedContextDetails = component.contextDetails;
        expect(retrievedContextDetails).toEqual(contextDetails);
    });
});