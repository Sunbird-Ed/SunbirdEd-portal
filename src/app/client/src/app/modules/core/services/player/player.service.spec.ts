import { Router, ActivatedRoute } from '@angular/router';
import { ConfigService, NavigationHelperService, UtilService } from '../../../../modules/shared';
import { UserService, ContentService, PublicDataService } from '..';
import { PlayerService } from './player.service';
import { of } from 'rxjs';
import { MockResponse } from './player.service.spec.data';
import { CslFrameworkService } from '../../../public/services/csl-framework/csl-framework.service';
describe('PlayerService', () => {
    let playerService: PlayerService;

    const mockActivatedRoute: Partial<ActivatedRoute> = {};
    const mockConfigService: Partial<ConfigService> = {
        urlConFig: {
            params: {
                contentGet: 'mock-content1,mock-content2'
            } as any,
            URLS: {
                CONTENT: {
                    GET: 'sample-get'
                } as any
            } as any
        } as any,
        appConfig: {
        } as any
    };


    const mockContentService: Partial<ContentService> = {};
    const mockNavigationHelperService: Partial<NavigationHelperService> = {};
    const mockPublicDataService: Partial<PublicDataService> = {};
    const mockRouter: Partial<Router> = {};
    const mockUserService: Partial<UserService> = {
        sessionId: 'sample-sessionId',
        userid: 'sample-user-id',
        getServerTimeDiff: '100ms',
        userProfile: {
            hashTagIds: ['sample-ids'],
            organisations: [{
                hashTagId: 'sample-org-ids'
            }]
        },
        dims: ['sample-dims'],
        channel: 'sample-channel'
    };
    const mockUtilService: Partial<UtilService> = {};

    const mockCslFrameworkService: Partial<CslFrameworkService> = {
        getAllFwCatName: jest.fn(),
    };
    beforeAll(() => {
        playerService = new PlayerService(
            mockUserService as UserService,
            mockContentService as ContentService,
            mockConfigService as ConfigService,
            mockRouter as Router,
            mockNavigationHelperService as NavigationHelperService,
            mockPublicDataService as PublicDataService,
            mockUtilService as UtilService,
             mockActivatedRoute as ActivatedRoute,
            mockCslFrameworkService as CslFrameworkService
        );
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it('should be create a instance of playerservice', () => {
        expect(playerService).toBeTruthy();
    });

    describe('getConfigByContent', () => {
        it('should return content details', (done) => {
            // arrange
            const id = 'content-id';
            const option = {
                courseId: 'sample-courseId',
                batchId: 'sample-batch-id'
            };
            mockPublicDataService.get = jest.fn(() => of(MockResponse.successResult) as any);
            mockConfigService.urlConFig = {
                params: {
                    contentGet: { id: 'content-id' }
                },
                URLS: {
                    CONTENT: {
                        GET: 'sample-get'
                    }
                }
            };
            jest.spyOn(playerService.cslFrameworkService, 'getAllFwCatName').mockReturnValue(['category1', 'category2']);
            mockConfigService.urlConFig = {
                params: {
                  contentGet: 'content1, content2 ,content3'
                },
                URLS: {
                    CONTENT: {
                        GET: 'sample-get'
                    }
                }
            };
            mockConfigService.appConfig = {
                PLAYER_CONFIG: {
                    playerConfig: {
                        context: {
                            contentId: 'sample-id',
                            sid: '',
                            uid: '',
                            timeDiff: '',
                            contextRollup: {},
                            channel: '',
                            did: '',
                            pdata: {
                                ver: '',
                                id: 'sample-id'
                            },
                            dims: [],
                            tags: 'sample-tags',
                            app: 'sunbird',
                            cData: [{
                                id: '',
                                type: ''
                            }]
                        },
                        config: {
                            enableTelemetryValidation: true
                        }
                    },
                    MIME_TYPE: {
                        ecmlContent: {
                            id: 'sample-id'
                        }
                    }
                }
            };
            const configuration = mockConfigService.appConfig.PLAYER_CONFIG.playerConfig;
            mockUserService.isDesktopApp = true;
            jest.spyOn(document, 'getElementById').mockImplementation(() => {
                return {
                    deviceId: 'sample-device-id',
                    buildNumber: '12A670B567'
                } as any;
            });
            // act
            playerService.getConfigByContent(id, option).subscribe(() => {
                expect(mockPublicDataService.get).toHaveBeenCalled();
                expect(mockUserService.isDesktopApp).toBeTruthy();
                expect(configuration.context.contentId).toBe('sample-id');
                expect(configuration.context.contextRollup).toStrictEqual({});
                done();
            });
        });

        it('should return content details for undefined courseId', (done) => {
            // arrange
            const id = 'content-id';
            const option = {
                courseId: undefined,
                batchId: 'sample-batch-id'
            };
            mockPublicDataService.get = jest.fn(() => of(MockResponse.successResult) as any);
            mockConfigService.urlConFig = {
                params: {
                    contentGet: { id: 'content-id' }
                },
                URLS: {
                    CONTENT: {
                        GET: 'sample-get'
                    }
                }
            };
            mockConfigService.appConfig = {
                PLAYER_CONFIG: {
                    playerConfig: {
                        context: {
                            contentId: 'sample-id',
                            sid: '',
                            uid: '',
                            timeDiff: '',
                            contextRollup: {},
                            channel: '',
                            did: '',
                            pdata: {
                                ver: '',
                                id: 'sample-id'
                            },
                            dims: [],
                            tags: 'sample-tags',
                            app: 'sunbird',
                            cData: [{
                                id: '',
                                type: ''
                            }]
                        },
                        config: {
                            enableTelemetryValidation: true
                        }
                    },
                    MIME_TYPE: {
                        ecmlContent: undefined
                    }
                }
            };
            mockUserService.isDesktopApp = true;
            jest.spyOn(playerService.cslFrameworkService, 'getAllFwCatName').mockReturnValue(['category1', 'category2']);
            mockConfigService.urlConFig = {
                params: {
                  contentGet: 'content1, content2 ,content3'
                },
                URLS: {
                    CONTENT: {
                        GET: 'sample-get'
                    }
                }
            };
            jest.spyOn(document, 'getElementById').mockImplementation(() => {
                return {
                    deviceId: 'sample-device-id',
                    buildNumber: '12A670B567'
                } as any;
            });
            const configuration = mockConfigService.appConfig.PLAYER_CONFIG.playerConfig;
            // act
            playerService.getConfigByContent(id, option).subscribe(() => {
                expect(mockPublicDataService.get).toHaveBeenCalled();
                expect(mockUserService.isDesktopApp).toBeTruthy();
                expect(configuration.context.contentId).toBe('sample-id');
                expect(configuration.context.contextRollup).toStrictEqual({});
                done();
            });
        });
    });

    describe('getCollectionHierarchy', () => {
        it('should return collection Hierarchy', async() => {
            const identifier = 'content-id';
            const option = {
                courseId: 'sample-courseId',
                batchId: 'sample-batch-id',
                params: {
                    'resmsgid': '0d0aedd0-d3a7-11e9-953c-0be7c8ef2b37',
                    'msgid': '341222c0-58a8-2a3c-f090-62ba91c105e1',
                    'status': 'successful',
                    'err': null,
                    'errmsg': null
                }
            };
            mockConfigService.urlConFig = {
                URLS: {
                    COURSE: {
                        HIERARCHY: {
                            id: 'sample-id'
                        }
                    }
                }
            };
            mockPublicDataService.get = jest.fn(() => of(MockResponse.collectionHierarchy));
            mockUtilService.sortChildrenWithIndex = jest.fn(() => ({
                mimeType: 'application/vnd.ekstep.ecml-archive',
                body: 'body',
                identifier: 'domain_66675',
                versionKey: '1497028761823'
            }));
            await playerService.getCollectionHierarchy(identifier, option).subscribe(() => {
                expect(mockPublicDataService.get).toHaveBeenCalled();
                expect(mockUtilService.sortChildrenWithIndex).toHaveBeenCalled();
                expect(playerService.contentData).toStrictEqual({
                    mimeType: 'application/vnd.ekstep.ecml-archive',
                    body: 'body',
                    identifier: 'domain_66675',
                    versionKey: '1497028761823'
                });
            });
        });
    });

    describe('updateContentBodyForReviewer', () => {
        it('should update content body for reviewer', () => {
            const data = {
                theme: {
                    'plugin-manifest': {
                        plugin: [{
                            id: 'sample-id',
                            identifier: 'do-123'
                        }]
                    },
                    'stage': [
                        {
                            'org.ekstep.questionset': [
                                {
                                    config: {
                                        __cdata: JSON.stringify([{
                                            id: 'sample-id',
                                            type: 'sample-type'
                                        }])
                                    },
                                    'org.ekstep.question': ['ids']
                                }
                            ]
                        },
                    ]
                }
            };
            const response = playerService.updateContentBodyForReviewer(JSON.stringify(data));
            // assert
            expect(response).toBe(JSON.stringify(data));
        });

        it('should not update content body for catch part', () => {
            const data = {
            };
            const response = playerService.updateContentBodyForReviewer(data);
            // assert
            expect(response).toStrictEqual({});
        });
    });

    describe('playContent', () => {
        it('should navigate to collection page', (done) => {
            // Arrange
            const content = {
                mimeType: 'application/vnd.ekstep.content-collection',
                body: 'body',
                identifier: 'domain_66675',
                versionKey: '1497028761823'
            };
            const queryParams = {};
            mockNavigationHelperService.storeResourceCloseUrl = jest.fn(() => { });
            mockConfigService.appConfig = {
                PLAYER_CONFIG: {
                    MIME_TYPE: {
                        collection: 'application/vnd.ekstep.content-collection'
                    }
                }
            };
            mockRouter.navigate = jest.fn(() => Promise.resolve(true));
            playerService.contentData = {
                mimeType: 'application/vnd.ekstep.ecml-archive',
                body: 'body',
                identifier: 'domain_66675',
                versionKey: '1497028761823'
            } as any;
            playerService.playContent(content, queryParams);
            setTimeout(() => {
                expect(mockNavigationHelperService.storeResourceCloseUrl).toHaveBeenCalled();
                expect(mockRouter.navigate).toHaveBeenCalled();
                done();
            }, 10);
        });


        it('should be navigate to collection page for trackable content', (done) => {
            // arrange
            mockNavigationHelperService.storeResourceCloseUrl = jest.fn(() => { });
            mockConfigService.appConfig = {
                PLAYER_CONFIG: {
                    MIME_TYPE: {
                        collection: 'application/vnd.ekstep.content-collection'
                    }
                }
            };
            const content = {
                metaData: {
                    mimeType: 'application/vnd.ekstep.content-collection',
                },
                body: 'body',
                identifier: 'domain_66675',
                versionKey: '1497028761823',
                trackable: {
                    enabled: 'YES'
                },
                primaryCategory: 'Course',
                batchId: 'sample-batchId'
            };
            const queryParams = {};
            mockRouter.navigate = jest.fn(() => Promise.resolve(true));
            playerService.playContent(content, queryParams);
            setTimeout(() => {
                expect(mockNavigationHelperService.storeResourceCloseUrl).toHaveBeenCalled();
                expect(mockRouter.navigate).toHaveBeenCalled();
                done();
            }, 10);
        });

        it('should be navigate to collection page for trackable content and undefined batchId', (done) => {
            // arrange
            mockNavigationHelperService.storeResourceCloseUrl = jest.fn(() => { });
            mockConfigService.appConfig = {
                PLAYER_CONFIG: {
                    MIME_TYPE: {
                        collection: 'application/vnd.ekstep.content-collection'
                    }
                }
            };
            const content = {
                metaData: {
                    mimeType: 'application/vnd.ekstep.content-collection',
                },
                body: 'body',
                identifier: 'domain_66675',
                versionKey: '1497028761823',
                trackable: {
                    enabled: 'YES'
                },
                primaryCategory: 'Course',
                batchId: undefined
            };
            const queryParams = {};
            mockRouter.navigate = jest.fn(() => Promise.resolve(true));
            playerService.playContent(content, queryParams);
            setTimeout(() => {
                expect(mockNavigationHelperService.storeResourceCloseUrl).toHaveBeenCalled();
                expect(mockRouter.navigate).toHaveBeenCalled();
                done();
            }, 10);
        });

        it('should be open ecml content', (done) => {
            // arrange
            mockNavigationHelperService.storeResourceCloseUrl = jest.fn(() => { });
            mockConfigService.appConfig = {
                PLAYER_CONFIG: {
                    MIME_TYPE: {
                        ecmlContent: 'application/vnd.ekstep.ecml-archive',
                        collection: 'application/vnd.ekstep.content-collection'
                    }
                }
            };
            const content = {
                mimeType: 'application/vnd.ekstep.ecml-archive',
                body: 'body',
                identifier: 'domain_66675',
                versionKey: '1497028761823',
                trackable: {
                    enabled: 'YES'
                },
                primaryCategory: 'Course',
                batchId: 'sample-batchId'
            };
            const queryParams = {};
            mockRouter.navigate = jest.fn(() => Promise.resolve(true));
            playerService.playContent(content, queryParams);
            setTimeout(() => {
                expect(mockNavigationHelperService.storeResourceCloseUrl).toHaveBeenCalled();
                expect(mockRouter.navigate).toHaveBeenCalled();
                done();
            }, 10);
        });

        it('should be open ecml content', (done) => {
            // arrange
            mockNavigationHelperService.storeResourceCloseUrl = jest.fn(() => { });
            mockConfigService.appConfig = {
                PLAYER_CONFIG: {
                    MIME_TYPE: {
                        ecmlContent: 'application/vnd.ekstep.ecml-archive',
                        collection: 'application/vnd.ekstep.content-collection',
                        questionset: 'application/vnd.ekstep.question-set-archive'
                    }
                }
            };
            const content = {
                mimeType: 'application/vnd.ekstep.question-set-archive',
                body: 'body',
                identifier: 'domain_66675',
                versionKey: '1497028761823',
                trackable: {
                    enabled: 'YES'
                },
                primaryCategory: 'Course',
                batchId: 'sample-batchId'
            };
            const queryParams = {};
            mockRouter.navigate = jest.fn(() => Promise.resolve(true));
            playerService.playContent(content, queryParams);
            setTimeout(() => {
                expect(mockNavigationHelperService.storeResourceCloseUrl).toHaveBeenCalled();
                expect(mockRouter.navigate).toHaveBeenCalled();
                done();
            }, 10);
        });

        it('should be open default content', (done) => {
            // arrange
            mockNavigationHelperService.storeResourceCloseUrl = jest.fn(() => { });
            mockConfigService.appConfig = {
                PLAYER_CONFIG: {
                    MIME_TYPE: {
                        ecmlContent: 'application/vnd.ekstep.ecml-archive',
                        collection: 'application/vnd.ekstep.content-collection',
                        questionset: 'application/vnd.ekstep.question-set-archive'
                    }
                }
            };
            const content = {
                mimeType: '',
                body: 'body',
                identifier: 'domain_66675',
                versionKey: '1497028761823',
                trackable: {
                    enabled: 'YES'
                },
                primaryCategory: 'Course',
                batchId: 'sample-batchId'
            };
            const queryParams = {};
            mockRouter.navigate = jest.fn(() => Promise.resolve(true));
            playerService.playContent(content, queryParams);
            setTimeout(() => {
                expect(mockNavigationHelperService.storeResourceCloseUrl).toHaveBeenCalled();
                expect(mockRouter.navigate).toHaveBeenCalled();
                done();
            }, 10);
        });
    });
});
