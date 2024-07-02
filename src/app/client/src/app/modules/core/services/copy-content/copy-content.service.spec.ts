import { of, throwError } from "rxjs";
import { ConfigService } from '../../../shared/services/config/config.service';
import { CopyContentService } from "./copy-content.service";
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { FrameworkService } from './../framework/framework.service';
import { ContentService } from './../content/content.service';
import { mockRes } from './copy-content.service.spec.data';

describe('CopyContentService', () => {
    let copyContentService: CopyContentService;
    const mockConfigService: Partial<ConfigService> = {
        urlConFig: {
            URLS: {
                CONTENT_PREFIX: '/content/',
                CONTENT: {
                    COPY: {}
                },
                QUESTIONSET: {
                    "COPY": "questionset/v2/copy"
                }
            }
        }
    };
    Object.defineProperty(window, 'open', {
        value: {
            href: 'www.test.com/workspace/edit/QuestionSet/sample-id/allcontent/Draft'
        }
    });
    const mockRouter: Partial<Router> = {
    };
    const mockUserService: Partial<UserService> = {
        userOrgDetails$: of({
            userProfile: {
                userId: 'sample-uid',
                rootOrgId: 'sample-root-id',
                rootOrg: {},
                hashTagIds: ['id']
            } as any
        }) as any,
        userProfile: {
            organisationIds: ['id1'],
            userId: 'sample-uid',
            lastName: 'last-name',
            firstName: 'first-name'
        } as any,
        orgNames: ['org-1']
    };
    const mockFrameworkService: Partial<FrameworkService> = {
        frameworkData$: of({
            defaultFramework: {
                code: 'CODE'
            }
        }) as any
    };
    const mockContentService: Partial<ContentService> = {};
    const mockDocument: Partial<Document> = {
        location: {
            origin: 'https://test.com'
        } as any
    };
    let windowSpy
    beforeAll(() => {
        copyContentService = new CopyContentService(
            mockConfigService as ConfigService,
            mockRouter as Router,
            mockUserService as UserService,
            mockContentService as ContentService,
            mockFrameworkService as FrameworkService,
            mockDocument as Document
        );
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        // windowSpy = jest.spyOn(window, "window", "get");

    });

    it('should create a instance of CopyContentService', () => {
        expect(copyContentService).toBeTruthy();
    });

    describe('formatData', () => {
        it('should return content if contentType is course', (done) => {
            // arrange
            const contentData = {
                name: 'sample-collection',
                description: '',
                framework: 'sample-framework',
                identifier: 'sample-id',
                code: 'sample-course',
                contentType: 'course',
                mimeType: 'sample-mime-type'
            } as any;
            // act
            copyContentService.formatData(contentData).subscribe((data) => {
                // assert
                expect(data).toBeTruthy();
                done();
            });
        });

        it('should return content if contentType is course', (done) => {
            // arrange
            const contentData = {
                name: 'sample-collection',
                framework: 'sample-framework',
                identifier: 'sample-id',
                code: 'sample-course',
                contentType: 'text-book',
                mimeType: 'sample-mime-type'
            } as any;
            // act
            copyContentService.formatData(contentData).subscribe((data) => {
                // assert
                expect(data).toBeTruthy();
                done();
            });
        });

        it('should return content if contentType is questionset', (done) => {
            // arrange
            const contentData = {
                name: 'sample-collection',
                description: '',
                framework: 'sample-framework',
                identifier: 'sample-id',
                code: 'sample-course',
                contentType: 'course',
                mimeType: 'application/vnd.sunbird.questionset'
            } as any;
            // act
            copyContentService.formatData(contentData).subscribe((data) => {
                // assert
                expect(data).toBeTruthy();
                done();
            });
        });
    });

    describe('redirectToEditor', () => {
        it('should navigate to Draft if mimetype is collection', () => {
            // arrange
            const contentData = {
                name: 'sample-collection',
                framework: 'sample-framework',
                identifier: 'sample-id-1',
                code: 'sample-course',
                contentType: 'text-book',
                mimeType: 'application/vnd.ekstep.content-collection'
            } as any;
            const copiedIdentifier = 'sample-id-1';
            mockRouter.navigate = jest.fn(() => Promise.resolve(true));
            // act
            copyContentService.redirectToEditor(contentData, copiedIdentifier);
            // assert
            expect(mockRouter.navigate).toHaveBeenCalledWith(['workspace/edit/text-book/sample-id-1/draft/Draft']);
        });

        it('should navigate to editor if mimetype is collection', () => {
            // arrange
            const contentData = {
                name: 'sample-collection',
                framework: 'sample-framework',
                identifier: 'sample-id',
                code: 'sample-course',
                contentType: 'text-book',
                mimeType: 'application/vnd.ekstep.ecml-archive'
            } as any;
            const copiedIdentifier = 'sample-id';
            mockRouter.navigate = jest.fn();
            // act
            copyContentService.redirectToEditor(contentData, copiedIdentifier);
            // assert
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/workspace/content/edit/content/sample-id/draft/sample-framework/Draft']);
        });

        it('should navigate to editor if mimetype is questionset', (done) => {
            // arrange
            const contentData = {
                name: 'sample-question',
                framework: 'sample-framework',
                identifier: 'sample-id',
                code: 'sample-course',
                contentType: 'text-book',
                mimeType: 'application/vnd.sunbird.questionset'
            } as any;
            copyContentService.hostUrl = 'www.test.com'
            const copiedIdentifier = 'sample-id';
            global.open = jest.fn();
            jest.spyOn(global, 'setTimeout');

            // act
            copyContentService.redirectToEditor(contentData, copiedIdentifier);
            // assert
            setTimeout(() => {
                expect(global.open).toBeCalled();
                done();
            }, 1000);
        });

        it('should navigate to editor for default mimetype', () => {
            // arrange
            const contentData = {
                name: 'sample-collection',
                framework: 'sample-framework',
                identifier: 'sample-id',
                code: 'sample-course',
                contentType: 'text-book',
                mimeType: 'default'
            } as any;
            const copiedIdentifier = 'sample-id';
            mockRouter.navigate = jest.fn();
            // act
            copyContentService.redirectToEditor(contentData, copiedIdentifier);
            // assert
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/workspace/content/edit/generic/sample-id/uploaded/sample-framework/Draft']);
        });
    });

    describe('should call the copyContent', () => {
        it('should call the copyContent method to copy the content with content data', (done) => {
            // arrange
            const contentData = { identifier: 'sample-id' } as any;
            mockFrameworkService.initialize = jest.fn();
            jest.spyOn(copyContentService, 'formatData').mockImplementation(() => {
                return of({
                    request: {
                        content: {
                            value: {}
                        }
                    }
                }) as any;
            });
            mockContentService.post = jest.fn(() => of(mockRes.ServerResponse));
            jest.spyOn(copyContentService, 'redirectToEditor').mockImplementation();
            // act
            copyContentService.copyContent(contentData).subscribe((data) => {
                // assert
                expect(data).toBe(mockRes.ServerResponse);
                expect(mockFrameworkService.initialize).toHaveBeenCalled();
                expect(mockContentService.post).toHaveBeenCalledWith({
                    data: {
                        request: {
                            content: {
                                value: {}
                            }
                        }
                    },
                    url: {} + '/' + 'sample-id'
                });
                done();
            });
        });

        it('should call the copyContent method to copy the content with content data for questionset', (done) => {
            // arrange
            const contentData = { identifier: 'sample-id', mimeType: 'application/vnd.sunbird.questionset' } as any;
            mockFrameworkService.initialize = jest.fn();
            jest.spyOn(copyContentService, 'formatData').mockImplementation(() => {
                return of({
                    request: {
                        content: {
                            value: {}
                        }
                    }
                }) as any;
            });
            mockContentService.post = jest.fn(() => of(mockRes.ServerResponse));
            jest.spyOn(copyContentService, 'redirectToEditor').mockImplementation();
            // act
            copyContentService.copyContent(contentData).subscribe((data) => {
                // assert
                expect(data).toBe(mockRes.ServerResponse);
                expect(mockFrameworkService.initialize).toHaveBeenCalled();
                expect(mockContentService.post).toHaveBeenCalledWith({
                    data: {
                        request: {
                            content: {
                                value: {}
                            }
                        }
                    },
                    url: 'questionset/v2/copy' + '/' + 'sample-id'
                });
                done();
            });
        });
    });

    it('should navigate course editor', () => {
        // arrange
        const framework = 'sample-framework';
        const copiedIdentifier = 'course-id';
        mockRouter.navigate = jest.fn(() => Promise.resolve(true));
        // act
        copyContentService.openCollectionEditor(framework, copiedIdentifier);
        // assert
        expect(mockRouter.navigate)
            .toHaveBeenCalledWith(['/workspace/content/edit/collection/course-id/Course/draft/sample-framework/Draft']);
    });

    it('should return copy of course file', (done) => {
        // arrange
        const collectionData = {
            name: 'sample-collection',
            description: '',
            framework: 'sample-framework',
            identifier: 'sample-id',
            children: [{
                identifier: 'id_1',
                selected: true
            },
            {
                identifier: 'id_2',
                selected: false
            }]
        } as any;
        mockContentService.post = jest.fn(() => of(mockRes.ServerResponse));
        jest.spyOn(copyContentService, 'openCollectionEditor').mockImplementation();
        // act
        copyContentService.copyAsCourse(collectionData).subscribe((data) => {
            // assert
            expect(data).toBe(mockRes.ServerResponse);
            expect(mockContentService.post).toHaveBeenCalled();
            done();
        });
    });
});