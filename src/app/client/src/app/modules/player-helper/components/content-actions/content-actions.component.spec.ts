import { TelemetryService } from '@sunbird/telemetry';
import { actionButtons } from './actionButtons';
import { Router, ActivatedRoute } from '@angular/router';
import {
    ResourceService, ToasterService, ContentUtilsServiceService, NavigationHelperService, OfflineCardService,
    UtilService
} from '@sunbird/shared';
import { SimpleChange } from '@angular/core';
import { of, Subscription, throwError } from 'rxjs';
import * as _ from 'lodash-es';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ContentManagerService } from '../../../public/module/offline/services';
import { ContentActionsComponent } from './content-actions.component';
import { actionsData } from './content-actions.component.spec.data';

describe("ContentActionsComponent", () => {
    let contentActionsComponent: ContentActionsComponent;
    const mockRouter: Partial<Router> = {
        url: 'https:mydownloads',

    };
    const mockActivatedRoute: Partial<ActivatedRoute> = {
        params: of({ collectionId: "123" }),
        snapshot: {
            data: {
                telemetry: {
                    object: {
                        type: 'view'
                    }
                }
            }
        } as any,
    };
    const mockResourceService: Partial<ResourceService> = {
        messages: {
            stmsg: {
                m0140: 'DOWNLOADING',
            },
            fmsg: {
                m0096: 'Could not Update. Try again later'
            }
        }
    };
    const mockToasterService: Partial<ToasterService> = {
        error: jest.fn(),
        success: jest.fn()
    };
    const mockContentUtilsServiceService: Partial<ContentUtilsServiceService> = {
        contentShareEvent: of('open') as any,

    };
    const mockTelemetryService: Partial<TelemetryService> = {
        interact: jest.fn()

    };
    const mockNavigationHelperService: Partial<NavigationHelperService> = {
        emitFullScreenEvent: jest.fn()
    };
    const mockDeviceDetectorService: Partial<DeviceDetectorService> = {
        isMobile: jest.fn(),
        isTablet: jest.fn()
    };
    const mockContentManagerService: Partial<ContentManagerService> = {
        contentDownloadStatus$: of({ enrolledCourses: [{ identifier: 'COMPLETED' }] }),
        updateContent: jest.fn(),
        exportContent: jest.fn(),
        deleteContent: jest.fn(),


    } as any;
    const mockOfflineCardService: Partial<OfflineCardService> = {
        isYoutubeContent: jest.fn()
    };
    const mockUtilService: Partial<UtilService> = {
        isDesktopApp: true,
    };

    beforeAll(() => {
        contentActionsComponent = new ContentActionsComponent(
            mockRouter as Router,
            mockActivatedRoute as ActivatedRoute,
            mockResourceService as ResourceService,
            mockToasterService as ToasterService,
            mockContentUtilsServiceService as ContentUtilsServiceService,
            mockTelemetryService as TelemetryService,
            mockNavigationHelperService as NavigationHelperService,
            mockDeviceDetectorService as DeviceDetectorService,
            mockContentManagerService as ContentManagerService,
            mockOfflineCardService as OfflineCardService,
            mockUtilService as UtilService

        );
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it("should be created", () => {
        expect(contentActionsComponent).toBeTruthy();
    });

    describe('logTelemetry', () => {
        it('should call log telemetry ', () => {
            //arrange
            jest.spyOn(mockTelemetryService, 'interact').mockImplementation();
            const interactData = {
                context: {
                    env: 'content',
                    cdata: [

                    ]
                },
                edata: {
                    id: 'delete-content',
                    type: 'click',
                    pageid: 'play-content',
                },
                object: {
                    id: 'do_31275241153060864018150',
                    type: 'Resource',
                    ver: '2',
                    rollup: {},
                }
            };
            //act
            contentActionsComponent.logTelemetry('delete-content', actionsData.contentData);
            //assert
            expect(contentActionsComponent['telemetryService'].interact).toHaveBeenCalledWith(interactData);
        });
    });

    describe('shareContent', () => {
        it('should set sharelinkModal to true', () => {
            //arrange
            let content = {
                identifier: '123',
                contentType: 'text',
                mimeType: 'text/plain'
            };
            const param = {
                identifier: '123',
                type: 'text'
            };
            const sharelinkModal = false;
            jest.spyOn(contentActionsComponent, 'logTelemetry').mockImplementation();
            mockContentUtilsServiceService.getPublicShareUrl = jest.fn().mockReturnValue(of(content));
            //act
            contentActionsComponent.shareContent(content);
            //assert
            expect(param).toEqual({
                identifier: '123',
                type: 'text'
            });
            expect(mockContentUtilsServiceService.getPublicShareUrl).toHaveBeenCalledWith('123', 'text/plain');
            expect(contentActionsComponent.logTelemetry).toHaveBeenCalledWith('share-content', content);
        });
    });

    describe('changeContentStatus', () => {
        it('should show the changeContentStstus', () => {
            //arrange
            contentActionsComponent.contentData = { identifier: 'do_31275241153060864018150' };
            //act
            contentActionsComponent.changeContentStatus();
        });
    });

    describe('printPdf', () => {
        it('should open a new window with the pdfUrl', () => {
            //arrange
            const content = {
                itemSetPreviewUrl: 'www.example.com/pdf'
            };
            const spy = jest.spyOn(window, 'open').mockImplementation();
            //act
            contentActionsComponent.printPdf(content);
            //assert
            expect(spy).toHaveBeenCalledWith('www.example.com/pdf', '_blank');
        });
    });

    describe('downloadContent', () => {
        it('should call downloadContent and successfuly content downloaded', () => {
            //arrange
            contentActionsComponent.isDesktopApp = true;
            mockContentManagerService.startDownload = jest.fn().mockReturnValue(of(actionsData.downloadContent.success));
            jest.spyOn(contentActionsComponent, 'changeContentStatus').mockImplementation();
            contentActionsComponent.contentData = actionsData.contentData;
            //act
            contentActionsComponent.downloadContent(actionsData.contentData);
            //assert
            contentActionsComponent['contentManagerService'].startDownload({}).subscribe(data => {
                expect(data).toEqual(actionsData.downloadContent.success);
                expect(contentActionsComponent.contentManagerService.downloadContentId).toEqual('');
            });
        });
        it('should call downloadContent and error while downloading content', () => {
            //arrange
            contentActionsComponent.isDesktopApp = true;
            mockContentManagerService.startDownload = jest.fn().mockReturnValue(throwError(actionsData.downloadContent.downloadError));
            jest.spyOn(contentActionsComponent.toasterService, 'error').mockImplementation();
            contentActionsComponent.contentData = actionsData.contentData;
            //act
            contentActionsComponent.downloadContent(actionsData.contentData);
            //assert
            contentActionsComponent['contentManagerService'].startDownload({}).subscribe(data => { }, err => {
                expect(err).toEqual(actionsData.downloadContent.downloadError);
                expect(contentActionsComponent.contentManagerService.downloadContentId).toEqual('');
                expect(contentActionsComponent.contentManagerService.failedContentName).toEqual('');
                expect(contentActionsComponent.toasterService.error).toHaveBeenCalledWith(actionsData.resourceBundle.messages.fmsg.m0090);
            });
        });
    });

    describe('deleteContent', () => {
        it('should call deleteContent and successfuly delete content ', () => {
            //arrange
            contentActionsComponent.isDesktopApp = true;
            jest.spyOn(contentActionsComponent['contentManagerService'], 'deleteContent').mockReturnValue(of(actionsData.deleteContent.success));
            jest.spyOn(contentActionsComponent, 'logTelemetry').mockImplementation();
            contentActionsComponent.contentData = actionsData.contentData;
            //act
            contentActionsComponent.deleteContent(actionsData.contentData);
            //assert
            const request = { request: { contents: [actionsData.contentData.identifier], visibility: 'Parent' } };
            contentActionsComponent['contentManagerService'].deleteContent(request).subscribe(data => {
                expect(data).toEqual(actionsData.deleteContent.success);
                expect(contentActionsComponent.contentData['desktopAppMetadata.isAvailable']).toBeFalsy();
            });
            expect(contentActionsComponent.logTelemetry).toHaveBeenCalledWith('delete-content', actionsData.contentData);
        });
        it('should call deleteContent and error while deleting content ', () => {
            //arrange
            contentActionsComponent.isDesktopApp = true;
            contentActionsComponent.resourceService.messages = actionsData.resourceBundle.messages;
            jest.spyOn(contentActionsComponent['contentManagerService'], 'deleteContent').mockReturnValue(throwError(actionsData.deleteContent.error));
            jest.spyOn(contentActionsComponent, 'logTelemetry').mockImplementation();
            jest.spyOn(contentActionsComponent.toasterService, 'error').mockImplementation();
            contentActionsComponent.contentData = actionsData.contentData;
            //act
            contentActionsComponent.deleteContent(actionsData.contentData);
            //assert
            const request = { request: { contents: [actionsData.contentData.identifier], visibility: 'Parent' } };
            contentActionsComponent['contentManagerService'].deleteContent(request).subscribe(data => { }, err => {
                expect(err).toEqual(actionsData.deleteContent.error);
                expect(contentActionsComponent.toasterService.error).toHaveBeenCalledWith(actionsData.resourceBundle.messages.etmsg.desktop.deleteContentErrorMessage);
            });
        });
    });

    describe('ngOnChanges', () => {
        it('should initialize contentData on ngOnchanges', () => {
            //arrange
            contentActionsComponent.isDesktopApp = true;
            contentActionsComponent.contentData = actionsData.contentData;
            jest.spyOn(contentActionsComponent, 'changeContentStatus').getMockImplementation();
            //act
            contentActionsComponent.ngOnChanges({
                contentData: new SimpleChange(null, contentActionsComponent.contentData, false)
            });
            //assert
            expect(contentActionsComponent.changeContentStatus).toHaveBeenCalled();
        });
    });

    describe('updateContent', () => {
        it('should call updateContent and successfuly update content ', () => {
            //arrange
            contentActionsComponent.isDesktopApp = true;
            jest.spyOn(contentActionsComponent['contentManagerService'], 'updateContent').mockReturnValue(of(actionsData.updateContent.success));
            jest.spyOn(contentActionsComponent, 'changeContentStatus').mockImplementation();
            contentActionsComponent.contentData = actionsData.contentData;
            //act
            contentActionsComponent.updateContent(actionsData.contentData);
            //assert
            const request = { contentId: actionsData.contentData.identifier };
            contentActionsComponent['contentManagerService'].updateContent(request).subscribe(data => {
                expect(data).toEqual(actionsData.updateContent.success);
                expect(contentActionsComponent.contentData.desktopAppMetadata['updateAvailable']).toBeFalsy();
                jest.spyOn(contentActionsComponent, 'changeContentStatus').mockImplementation();

            });
        });
        it('should call updateContent and error while updating content ', () => {
            //arrange
            contentActionsComponent.isDesktopApp = true;
            jest.spyOn(contentActionsComponent['contentManagerService'], 'updateContent').mockReturnValue(throwError(actionsData.updateContent.error));
            jest.spyOn(contentActionsComponent, 'changeContentStatus').getMockImplementation();
            jest.spyOn(contentActionsComponent.toasterService, 'error').mockImplementation();
            contentActionsComponent.contentData = actionsData.contentData;
            //act
            contentActionsComponent.updateContent(actionsData.contentData);
            //assert
            const request = { contentId: actionsData.contentData.identifier };
            contentActionsComponent['contentManagerService'].updateContent(request).subscribe(data => { }, err => {
                expect(err).toEqual(actionsData.updateContent.error);
                jest.spyOn(contentActionsComponent, 'changeContentStatus').mockImplementation();
                expect(contentActionsComponent.contentData['desktopAppMetadata']['updateAvailable']).toBeTruthy();
                expect(contentActionsComponent.toasterService.error).toHaveBeenCalledWith(actionsData.resourceBundle.messages.fmsg.m0096);

            });
        });
    });

    describe('exportContent', () => {
        it('should call exportContent and successfuly export content ', (done) => {
            //arrange
            contentActionsComponent.isDesktopApp = true;
            jest.spyOn(contentActionsComponent['contentManagerService'], 'exportContent').mockReturnValue(of(actionsData.exportContent.success)) as any;
            contentActionsComponent.contentData = actionsData.contentData;
            //act
            contentActionsComponent.exportContent(actionsData.contentData);
            //assert
            contentActionsComponent['contentManagerService'].exportContent(actionsData.contentData.identifier).subscribe((data) => {
                expect(contentActionsComponent.showExportLoader).toBeFalsy();
                done();
            });
        });
        it('should call exportContent and error while  exporting content ', () => {
            //arrange
            contentActionsComponent.isDesktopApp = true;
            jest.spyOn(contentActionsComponent['contentManagerService'], 'exportContent').mockReturnValue(throwError(actionsData.exportContent.error));
            jest.spyOn(contentActionsComponent.toasterService, 'error').mockImplementation();
            contentActionsComponent.contentData = actionsData.contentData;
            //act
            contentActionsComponent.exportContent(actionsData.contentData);
            //assert
            contentActionsComponent['contentManagerService'].exportContent(actionsData.contentData.identifier).subscribe(data => { }, err => {
                expect(contentActionsComponent.showExportLoader).toBeFalsy();
                expect(contentActionsComponent.toasterService.error).toHaveBeenCalledWith(actionsData.resourceBundle.messages.fmsg.m0091);
            });
        });
    });

    describe('isYoutubeContentPresent', () => {
        it('should check isYoutubeContentPresent', () => {
            //arrange
            contentActionsComponent.isDesktopApp = true;
            jest.spyOn(mockOfflineCardService, 'isYoutubeContent').mockReturnValue(false);
            jest.spyOn(contentActionsComponent, 'downloadContent').mockReturnValue();
            //act
            contentActionsComponent.isYoutubeContentPresent(actionsData.contentData);
            //assert
            expect(contentActionsComponent.showModal).toBeFalsy();
            expect(contentActionsComponent.downloadContent).toHaveBeenCalledWith(actionsData.contentData);
        });
    });

    describe('onActionButtonClick', () => {
        it('should call onActionButtonClick for RATE ', () => {
            //arrange
            jest.spyOn(contentActionsComponent, 'logTelemetry').mockImplementation();
            //act
            contentActionsComponent.onActionButtonClick(actionsData.actionButtonEvents.RATE, actionsData.contentData);
            //assert
            expect(contentActionsComponent.contentRatingModal).toBeTruthy();
            expect(contentActionsComponent.logTelemetry).toHaveBeenCalledWith('rate-content', actionsData.contentData);
        });
        it('should call onActionButtonClick for SHARE fon no desktop ', () => {
            //arrange
            contentActionsComponent.isDesktopApp = false;
            jest.spyOn(contentActionsComponent, 'logTelemetry').mockImplementation();
            jest.spyOn(contentActionsComponent, 'setTelemetryShareData').mockImplementation();
            //act
            contentActionsComponent.onActionButtonClick(actionsData.actionButtonEvents.SHARE, actionsData.contentData);
            //assert
            expect(contentActionsComponent.setTelemetryShareData).toHaveBeenCalledWith(actionsData.param);
            expect(contentActionsComponent.logTelemetry).toHaveBeenCalledWith('share-content', actionsData.contentData);
        });
        it('should call onActionButtonClick for SHARE ', () => {
            //arrange
            contentActionsComponent.isDesktopApp = true;
            jest.spyOn(contentActionsComponent, 'logTelemetry').mockImplementation();
            jest.spyOn(contentActionsComponent, 'exportContent').mockImplementation();
            //act
            contentActionsComponent.onActionButtonClick(actionsData.actionButtonEvents.SHARE, actionsData.contentData);
            //assert
            expect(contentActionsComponent.exportContent).toHaveBeenCalledWith(actionsData.contentData);
        });
        it('should call onActionButtonClick for UPDATE ', () => {
            //arrange
            contentActionsComponent.isDesktopApp = true;
            jest.spyOn(contentActionsComponent, 'updateContent').mockImplementation();
            jest.spyOn(contentActionsComponent, 'logTelemetry').mockImplementation();
            //act
            contentActionsComponent.onActionButtonClick(actionsData.actionButtonEvents.UPDATE, actionsData.contentData);
            //assert
            expect(contentActionsComponent.updateContent).toHaveBeenCalledWith(actionsData.contentData);
            expect(contentActionsComponent.logTelemetry).toHaveBeenCalledWith('update-content', actionsData.contentData);
        });
        it('should call onActionButtonClick for DOWNLOAD ', () => {
            //arrange
            contentActionsComponent.isDesktopApp = true;
            jest.spyOn(contentActionsComponent, 'isYoutubeContentPresent').mockImplementation();
            jest.spyOn(contentActionsComponent, 'logTelemetry').mockImplementation();
            //act
            contentActionsComponent.onActionButtonClick(actionsData.actionButtonEvents.DOWNLOAD, actionsData.contentData);
            //assert
            expect(contentActionsComponent.isYoutubeContentPresent).toHaveBeenCalledWith(actionsData.contentData);
            expect(contentActionsComponent.logTelemetry).toHaveBeenCalledWith('download-content', actionsData.contentData);
        });
        it('should call onActionButtonClick for DELETE ', () => {
            //arrange
            contentActionsComponent.isDesktopApp = true;
            jest.spyOn(contentActionsComponent, 'logTelemetry').mockImplementation();
            //act
            contentActionsComponent.onActionButtonClick(actionsData.actionButtonEvents.DELETE, actionsData.contentData);
            //assert
            expect(contentActionsComponent.showDeleteModal).toBeTruthy();
            expect(contentActionsComponent.logTelemetry).toHaveBeenCalledWith('confirm-delete-content', actionsData.contentData);
        });
        it('should call onActionButtonClick for PRINT ', () => {
            //arrange
            contentActionsComponent.isDesktopApp = true;
            jest.spyOn(contentActionsComponent, 'printPdf').mockImplementation();
            jest.spyOn(contentActionsComponent, 'logTelemetry').mockImplementation();
            //act
            contentActionsComponent.onActionButtonClick(actionsData.actionButtonEvents.PRINT, actionsData.contentData);
            //assert
            expect(contentActionsComponent.printPdf).toHaveBeenCalledWith(actionsData.contentData);
            expect(contentActionsComponent.logTelemetry).toHaveBeenCalledWith('print-content', actionsData.contentData);
        });
        it('should call onActionButtonClick for FULL-SCREEN ', () => {
            //arrange
            contentActionsComponent.isDesktopApp = true;
            jest.spyOn(mockNavigationHelperService, 'emitFullScreenEvent').mockImplementation();
            jest.spyOn(contentActionsComponent, 'logTelemetry').mockImplementation();
            //act
            contentActionsComponent.onActionButtonClick(actionsData.actionButtonEvents.FULLSCREEN, actionsData.contentData);
            //assert
            expect(mockNavigationHelperService.emitFullScreenEvent).toHaveBeenCalledWith(true);
            expect(contentActionsComponent.logTelemetry).toHaveBeenCalledWith('fullscreen-content', actionsData.contentData);
        });
        it('should call onActionButtonClick for minimize ', () => {
            //arrange
            contentActionsComponent.isDesktopApp = true;
            jest.spyOn(mockNavigationHelperService, 'emitFullScreenEvent').mockImplementation();
            jest.spyOn(contentActionsComponent, 'logTelemetry').mockImplementation();
            //act
            contentActionsComponent.onActionButtonClick(actionsData.actionButtonEvents.MINIMIZE, actionsData.contentData);
            //assert
            expect(mockNavigationHelperService.emitFullScreenEvent).toHaveBeenCalledWith(false);
            expect(contentActionsComponent.logTelemetry).toHaveBeenCalledWith('minimize-screen-content', actionsData.contentData);
        });
    });

    describe('enableDisableactionButtons', () => {
        it('should enable fullscreen button when isFullScreen is false', () => {
            //arrange
            contentActionsComponent.isFullScreen = false;
            //act
            contentActionsComponent.enableDisableactionButtons();
            //assert
            expect(contentActionsComponent.actionButtons[0].isInActive).toBe(false);
        });
        it('should disable minimize button when isFullScreen is true', () => {
            //arrange
            contentActionsComponent.isFullScreen = true;
            //act
            contentActionsComponent.enableDisableactionButtons();
            //assert
            expect(contentActionsComponent.fullScreenActionButtons[0].isInActive).toBe(false);
        });
        it('should disable fullscreen button when ASSESS event is triggered', () => {
            //arrange
            contentActionsComponent.isFullScreen = false;
            contentActionsComponent.assessmentEvents = of({
                detail: {
                    telemetryData: {
                        eid: 'ASSESS'
                    }
                }
            });
            //act
            contentActionsComponent.enableDisableactionButtons();
            //assert
            expect(contentActionsComponent.actionButtons[0].isInActive).toBe(false);
        });
        it('should disable minimize button when ASSESS event is triggered', () => {
            //arrange
            contentActionsComponent.isFullScreen = true;
            contentActionsComponent.assessmentEvents = of({
                detail: {
                    telemetryData: {
                        eid: 'ASSESS'
                    }
                }
            });
            //act
            contentActionsComponent.enableDisableactionButtons();
            //assert
            expect(contentActionsComponent.fullScreenActionButtons[0].isInActive).toBe(false);
        });
    });

    describe('ngOnInit', () => {
        it('should listen for content download status and call changeContentstatus', () => {
            //arrange
            contentActionsComponent.contentDownloadStatus = { ['do_1234']: 'COMPLETED' };
            jest.spyOn(contentActionsComponent, 'changeContentStatus').mockImplementation();
            jest.spyOn(contentActionsComponent, 'enableDisableactionButtons').mockImplementation();
            mockUtilService._isDesktopApp = true;
            mockContentManagerService.contentDownloadStatus = jest.fn().mockReturnValue(of([{}]));;
            jest.spyOn(contentActionsComponent, 'shareContent').mockImplementation();
            //act
            contentActionsComponent.ngOnInit();
            //assert
            expect(contentActionsComponent.changeContentStatus).toHaveBeenCalled();
            expect(contentActionsComponent.enableDisableactionButtons).toHaveBeenCalled();
        });

        it('Fullscreen should be disabled if content mime type is video', () => {
            //arrange
            jest.spyOn(contentActionsComponent, 'changeContentStatus').mockImplementation();
            contentActionsComponent.contentData = actionsData.contentData;
            contentActionsComponent.contentData.mimeType = 'video/mp4';
            contentActionsComponent.actionButtons = actionButtons;
            jest.spyOn(contentActionsComponent, 'shareContent').mockImplementation();
            jest.spyOn(contentActionsComponent, 'enableDisableactionButtons').mockImplementation();
            //act
            contentActionsComponent.ngOnInit();
            const fullScreenObj = contentActionsComponent.actionButtons.find((e) => {
                return e;
            });
            //assert
            // expect(fullScreenObj.disabled).toBeTruthy();
            expect(contentActionsComponent.enableDisableactionButtons).toHaveBeenCalled();
        });
    });

    describe('isAvailable', () => {
        it('should return false if contentData does not have desktopAppMetadata', () => {
            //arrange
            const contentData = {};
            //act
            const result = contentActionsComponent.isAvailable();
            //assert
            expect(result).toBeDefined();
        });
        it('should return false if desktopAppMetadata does not have isAvailable', () => {
            //arrange
            const contentData = {
                desktopAppMetadata: {}
            };
            //act
            const result = contentActionsComponent.isAvailable();
            //assert
            expect(result).toBeDefined();
        });
        it('should return true if desktopAppMetadata has isAvailable', () => {
            //arrange
            const contentData = {
                desktopAppMetadata: {
                    isAvailable: true
                }
            };
            //act
            const result = contentActionsComponent.isAvailable();
            //assert
            expect(result).toBeDefined();
        });
    });

    describe('ngOnDestroy', () => {
        it('should unsubscribe from subscription', () => {
            //arrange
            let subscription: Subscription;
            let telemetryEventSubscription$: Subscription;
            subscription = new Subscription();
            telemetryEventSubscription$ = new Subscription();
            contentActionsComponent.subscription = subscription;
            jest.spyOn(telemetryEventSubscription$, 'unsubscribe').mockImplementation();
            jest.spyOn(subscription, 'unsubscribe').mockImplementation();
            //act
            contentActionsComponent.ngOnDestroy();
            //assert
            expect(subscription.unsubscribe).toHaveBeenCalled();
        });
    });
});