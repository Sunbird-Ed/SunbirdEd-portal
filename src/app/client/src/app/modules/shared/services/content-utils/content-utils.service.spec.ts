import { EventEmitter,Injectable } from '@angular/core';
import { ISharelink } from './../../interfaces';
import { ConfigService } from './../config/config.service';
import { environment } from '@sunbird/environment';
import { _ } from 'lodash-es';
import { ContentUtilsServiceService } from './content-utils.service';

describe('ContentUtilsServiceService', () => {
    let service: ContentUtilsServiceService;

    const mockConfigService: Partial<ConfigService> = {
        appConfig: {
            PLAYER_CONFIG: {
                MIME_TYPE: {
                    questionset: 'questionset',
                    collection: 'collection',
                }
            }
        }
    };

    const contentShare = {
        mimeType: 'application/vnd.ekstep.content-collection',
        contentType: 'Course',
        identifier: '12345'
    };

    beforeAll(() => {
        service = new ContentUtilsServiceService(
            mockConfigService as ConfigService
        );
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it('should create an instance of ContentUtilsServiceService', () => {
        expect(service).toBeTruthy();
    });

    it('should get a base64 URL', () => {
        const base64Url = service.getBase64Url('type', 'identifier');
        expect(base64Url).toBe('dHlwZS9pZGVudGlmaWVy');
    });
    
    it('should get an unlisted share URL for a course', () => {
        const url = service.getUnlistedShareUrl(contentShare);
        expect(url).toBe(`${service.baseUrl}learn/course/${contentShare.identifier}/Unlisted`);
    });
    
    it('should get an unlisted share URL for a content collection', () => {
        contentShare.contentType = 'SomeOtherType';
        const url = service.getUnlistedShareUrl(contentShare);
        expect(url).toBe(`${service.baseUrl}resources/play/collection/${contentShare.identifier}/Unlisted`);
    });

    it('should get a public share URL for a collection with a collection ID', () => {
        const collectionId = 'collection123';
        const contentId = 'content456';
        const url = service.getPublicShareUrl(contentId, 'collection', collectionId);
        expect(url).toBe(`${service.baseUrl}play/collection/${collectionId}?contentId=${contentId}`);
    });
    
    it('should get a public share URL for a content', () => {
        const contentId = 'content123';
        const url = service.getPublicShareUrl(contentId, 'content');
        expect(url).toBe(`${service.baseUrl}play/content/${contentId}`);
    });

    it('should return the course public share URL', () => {
        const courseId = 'course123';
        const expectedUrl = `${service.baseUrl}explore-course/course/${courseId}`;
        const actualUrl = service.getCoursePublicShareUrl(courseId);
        expect(actualUrl).toBe(expectedUrl);
    });
    
    it('should return the course module public share URL', () => {
        const courseId = 'course123';
        const moduleId = 'module456';
        const expectedUrl = `${service.baseUrl}explore-course/course/${courseId}?moduleId=${moduleId}`;
        const actualUrl = service.getCourseModulePublicShareUrl(courseId, moduleId);
        expect(actualUrl).toBe(expectedUrl);
    });

    it('should generate the content rollup object', () => {
        const mockContent = {
            getPath: () => [
                { model: { identifier: 'id1' } },
                { model: { identifier: 'id2' } },
                { model: { identifier: 'id3' } },
                { model: { identifier: 'id4' } }
            ]
        };
        const expectedRollup = {
            l1: 'id1',
            l2: 'id2',
            l3: 'id3',
        };
        const actualRollup = service.getContentRollup(mockContent);
        expect(actualRollup).toEqual(expectedRollup);
    });
    
    
});