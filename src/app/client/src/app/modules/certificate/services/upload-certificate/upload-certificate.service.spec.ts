import { ConfigService } from '@sunbird/shared';
import { PublicDataService } from '@sunbird/core';
import { HttpClient } from '@angular/common/http';
import { ContentService } from './../../../../modules/core/services/content/content.service';
import { UserService } from '@sunbird/core';
import { UploadCertificateService } from './upload-certificate.service';

describe("PageApiService", () => {
    let uploadCertificateService: UploadCertificateService;
    const mockPublicDataService: Partial<PublicDataService> = {};
    const mockHttpClient: Partial<HttpClient> = {
        get: jest.fn()
    };
    const mockConfigService: Partial<ConfigService> = {
        urlConFig: {
            URLS: {
                CONTENT: {
                    'SEARCH': 'asset/v1/upload/SOME_IDENTIFIER',
                    'CREATE': 'content/v1/create'
                },
                COMPOSITE: {
                    'SEARCH': 'composite/v1/search'
                },
                CERTIFICATE: {
                    'UPLOAD_CERT_TEMPLATE': 'asset/v1/upload/SOME_IDENTIFIER'
                }
            }
        }
    };

    const mockContentService: Partial<ContentService> = {};
    const mockUserService: Partial<UserService> = {};

    beforeAll(() => {
        uploadCertificateService = new UploadCertificateService(
            mockPublicDataService as PublicDataService,
            mockHttpClient as HttpClient,
            mockConfigService as ConfigService,
            mockContentService as ContentService,
            mockUserService as UserService

        );
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it("should be created", () => {
        expect(uploadCertificateService).toBeTruthy();
    });

    describe('createAsset', () => {
        it('should get the asset data', () => {
            //arrange
            const body = {
                'request': {
                    'filters': {
                        'mediaType': ['image'],
                        'contentType': ['Asset'],
                        'compatibilityLevel': { 'min': 1, 'max': 2 },
                        'status': ['Live'],
                        'primaryCategory': 'Asset',
                        'channel': undefined
                    },
                    'sort_by': {
                        'lastUpdatedOn': 'desc'
                    },
                    'limit': 50,
                    'offset': 0
                }
            };
            const data = {
                url: mockConfigService.urlConFig.URLS.CONTENT.SEARCH,
                data: body
            };
            mockPublicDataService.post = jest.fn().mockReturnValue((data)) as any;
            //act
            uploadCertificateService.getAssetData();
            //assert
            expect(mockPublicDataService.post).toHaveBeenCalledWith(data);
        });
    });

    describe('getCertificates', () => {
        it('should create asset', () => {
            //arrange
            const body = {
                'request': {
                    'filters': {
                        'certType': 'cert template',
                        'channel': '12345'
                    },
                    'sort_by': {
                        'lastUpdatedOn': 'desc'
                    },
                    'fields': ['indentifier', 'name', 'code', 'certType', 'data', 'issuer', 'signatoryList', 'artifactUrl', 'primaryCategory', 'channel'],
                    'limit': 100
                }
            };
            const data = {
                url: mockConfigService.urlConFig.URLS.COMPOSITE.SEARCH,
                data: body
            };
            mockContentService.post = jest.fn().mockReturnValue((data)) as any;
            //act
            uploadCertificateService.getCertificates(body);
            //assert
            expect(mockContentService.post).toHaveBeenCalledWith(data);

        });
    });

    describe('createAsset', () => {
        it('should create asset', () => {
            //arrange
            const body = {
                'request':
                {
                    'content': {
                        'name': 'picture1',
                        'creator': 'ekstep',
                        'createdBy': '123456',
                        'code': 'org.ekstep0.9002440445885993',
                        'mimeType': 'image/png',
                        'mediaType': 'image',
                        'contentType': 'Asset',
                        'primaryCategory': 'Asset',
                        'osId': 'org.ekstep.quiz.app',
                        'language': ['English'],
                        'channel': undefined
                    }
                }
            };
            const option = {
                url: mockConfigService.urlConFig.URLS.CONTENT.CREATE,
                data: body
            };
            mockContentService.post = jest.fn().mockReturnValue((option)) as any;
            //act
            uploadCertificateService.createAsset({
                assetCaption: 'picture1',
                creator: 'ekstep',
                creatorId: '123456'
            });
            //assert
            expect(mockContentService.post).toHaveBeenCalledWith(option);

        });
    });

    describe('storeAsset', () => {
        it('should store the asset', () => {
            //arrange
            const formData = new FormData();
            formData.append('file', 'SVG_BYTE_ARRAY');
            const data = {
                url: mockConfigService.urlConFig.URLS.CERTIFICATE.UPLOAD_CERT_TEMPLATE + `/SOME_IDENTIFIER`,
                data: formData
            };
            mockContentService.get = jest.fn().mockReturnValue((data)) as any;
            //act
            uploadCertificateService.storeAsset('SVG_BYTE_ARRAY', 'SOME_IDENTIFIER');
            //assert
            expect(mockContentService.post).toHaveBeenCalledWith(data);
        });
    });

    describe('createCertTemplate', () => {
        it('should create the certificate template', () => {
            //arrange
            const data = {};
            const request = {
                url: mockConfigService.urlConFig.URLS.CERTIFICATE.CREATE_CERT_TEMPLATE,
                data: data
            };
            mockContentService.post = jest.fn().mockReturnValue((data)) as any;
            //act
            uploadCertificateService.createCertTemplate(data);
            //assert
            expect(mockContentService.post).toHaveBeenCalledWith(request);
        });
    });

    describe('uploadTemplate', () => {
        it('should upload the certificate template', () => {
            //arrange
            const formData = new FormData();
            formData.append('file', 'SVG_BYTE_ARRAY');
            const option = {
                url: mockConfigService.urlConFig.URLS.CERTIFICATE.UPLOAD_CERT_TEMPLATE + `/SOME_IDENTIFIER`,
                data: formData
            };
            mockContentService.post = jest.fn().mockReturnValue(option) as any;
            //act
            uploadCertificateService.uploadTemplate('SVG_BYTE_ARRAY', 'SOME_IDENTIFIER');
            //assert
            expect(mockContentService.post).toHaveBeenCalledWith(option);
        });
    });

    describe('getSvg', () => {
        it('should get SVG', (done) => {
            //arrange
            const url = 'https://sunbirddev.blob.core.windows.net';
            const mockPromise = {
                toPromise: () => Promise.resolve(url)
            }
            mockHttpClient.get = jest.fn().mockImplementation(() => mockPromise);
            //act
            uploadCertificateService.getSvg(url).then((res) => {
                setTimeout(() => {
                    //assert
                    expect(mockHttpClient.get).toHaveBeenCalledWith(url, { responseType: 'text' });
                    done();
                }, 0);
            });
        });
    });
});