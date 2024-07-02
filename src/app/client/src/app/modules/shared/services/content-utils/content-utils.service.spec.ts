import { EventEmitter,Injectable } from '@angular/core';
import { ISharelink } from './../../interfaces';
import { ConfigService } from './../config/config.service';
import { environment } from '@sunbird/environment';
import { _ } from 'lodash-es';
import { ContentUtilsServiceService } from './content-utils.service';

describe('ContentUtilsServiceService', () => {
    let contentUtilsService: ContentUtilsServiceService;

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
        contentUtilsService = new ContentUtilsServiceService(
            mockConfigService as ConfigService
        );
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        environment.isDesktopApp = true;
        document.body.innerHTML = `
        <div id="baseUrl">http://localhost</div>
        `;
    });

    afterEach(() => {
        document.body.innerHTML = '';
    })

    it('should create an instance of ContentUtilsServiceService', () => {
        expect(contentUtilsService).toBeTruthy();
    });

    it('should get a base64 URL', () => {
        const base64Url = contentUtilsService.getBase64Url('type', 'identifier');
        expect(base64Url).toBe('dHlwZS9pZGVudGlmaWVy');
    });

    it('should set baseUrl to document.location.origin if baseUrl input element is not present', () => {
        document.getElementById('baseUrl').remove();
        const result = contentUtilsService.baseUrl;
        expect(result).toBe(document.location.origin + '/');
    });
    
    it('should set origin value if baseUrl input element is present', () => {
        document.body.innerHTML = `
        <div id="baseUrl">http://example.com</div>
        `;
        const dom = document.getElementById('baseUrl');
        const result =  dom ? dom.textContent : null;
        expect(result).toBe('http://example.com');
    });
    
    it('should set baseUrl to input element value if baseUrl input element is present', () => {
        const origin ='http://localhost';
        const result= contentUtilsService.baseUrl;
        expect(result).toBe(origin+ '/');
    });

    it('should get an unlisted share URL for a course', () => {
        const url = contentUtilsService.getUnlistedShareUrl(contentShare);
        expect(url).toBe(`${contentUtilsService.baseUrl}learn/course/${contentShare.identifier}/Unlisted`);
    });
    
    it('should get an unlisted share URL for a content collection', () => {
        contentShare.contentType = 'collection';
        const url = contentUtilsService.getUnlistedShareUrl(contentShare);
        expect(url).toBe(`${contentUtilsService.baseUrl}resources/play/collection/${contentShare.identifier}/Unlisted`);
    });

    it('should return the correct URL for unlisted content', () => {
        contentShare.mimeType = 'application/vnd.ekstep.player-collection';
        const result = contentUtilsService.getUnlistedShareUrl(contentShare);
        const expectedUrl = `${contentUtilsService.baseUrl}resources/play/content/${contentShare.identifier}/Unlisted`;
        expect(result).toBe(expectedUrl);
    });
    

    it('should get a public share URL for a collection with a collection ID', () => {
        const collectionId = 'collection123';
        const contentId = 'content456';
        const url = contentUtilsService.getPublicShareUrl(contentId, 'collection', collectionId);
        expect(url).toBe(`${contentUtilsService.baseUrl}play/collection/${collectionId}?contentId=${contentId}`);
    });
    
    it('should get a public share URL for a content', () => {
        const contentId = 'content123';
        const url = contentUtilsService.getPublicShareUrl(contentId, 'content');
        expect(url).toBe(`${contentUtilsService.baseUrl}play/content/${contentId}`);
    });

    it('should return the correct URL for collection without collectionId', () => {
        const contentId = 'content123';
        const type = contentUtilsService.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.collection;
        const result = contentUtilsService.getPublicShareUrl(contentId, type);
        const expectedUrl = `${contentUtilsService.baseUrl}play/collection/${contentId}`;
        expect(result).toBe(expectedUrl);
    });

    it('should return the correct URL for collection without collectionId', () => {
        const contentId = 'content123';
        const type = contentUtilsService.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.questionset;
        const result = contentUtilsService.getPublicShareUrl(contentId, type);
        const expectedUrl = `${contentUtilsService.baseUrl}play/questionset/${contentId}`;
        expect(result).toBe(expectedUrl);
    });

    it('should return the course public share URL', () => {
        const courseId = 'course123';
        const expectedUrl = `${contentUtilsService.baseUrl}explore-course/course/${courseId}`;
        const actualUrl = contentUtilsService.getCoursePublicShareUrl(courseId);
        expect(actualUrl).toBe(expectedUrl);
    });
    
    it('should return the course module public share URL', () => {
        const courseId = 'course123';
        const moduleId = 'module456';
        const expectedUrl = `${contentUtilsService.baseUrl}explore-course/course/${courseId}?moduleId=${moduleId}`;
        const actualUrl = contentUtilsService.getCourseModulePublicShareUrl(courseId, moduleId);
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
        const actualRollup = contentUtilsService.getContentRollup(mockContent);
        expect(actualRollup).toEqual(expectedRollup);
    });   
});