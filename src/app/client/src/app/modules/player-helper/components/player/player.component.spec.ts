import { ConfigService, NavigationHelperService, UtilService } from '@sunbird/shared';
import { Component, AfterViewInit, ViewChild, ElementRef, Input, Output, EventEmitter, OnChanges, HostListener, OnInit, ChangeDetectorRef } from '@angular/core';
import { _ } from 'lodash-es';
import { PlayerConfig } from '@sunbird/shared';
import { Router } from '@angular/router';
import { ToasterService, ResourceService, ContentUtilsServiceService } from '@sunbird/shared';
import { Subject, of, BehaviorSubject } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';
import { IInteractEventEdata } from '@sunbird/telemetry';
import { UserService, FormService } from '../../../core/services';
import { OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { CsContentProgressCalculator } from '@project-sunbird/client-services/services/content/utilities/content-progress-calculator';
import { ContentService } from '@sunbird/core';
import { questionsetRead } from '../../service/quml-player-v2/quml-player-v2.service.spec.data'
import { PublicPlayerService } from '@sunbird/public';
import { PlayerComponent } from './player.component';

describe('PlayerComponent', () => {
	let component: PlayerComponent;

	const configService: Partial<ConfigService> = {
		appConfig: {
			PLAYER_CONFIG: {
				cdnUrl: '',
				MIME_TYPE: {
					questionset: 'mockQuestionSetMimeType'
				}
			}
		},
		urlConFig: {
			URLS: {
				TELEMETRY: {
					SYNC: 'mocked-telemetry-sync-url'
				}
			}
		}
	};
	const router: Partial<Router> = {
		navigate: jest.fn(),
	};
	const toasterService: Partial<ToasterService> = {};
	const resourceService: Partial<ResourceService> = {};
	const navigationHelperService: Partial<NavigationHelperService> = {
		contentFullScreenEvent: new EventEmitter<any>(),
		emitFullScreenEvent: jest.fn(),
	};
	const deviceDetectorService: Partial<DeviceDetectorService> = {
		isMobile: jest.fn().mockReturnValue(true),
		isTablet: jest.fn().mockReturnValue(false),
	};
	const userService: Partial<UserService> = {
		loggedIn: true,
		slug: jest.fn().mockReturnValue('tn') as any,
		userData$: of({
			userProfile: {
				userId: 'sample-uid',
				rootOrgId: 'sample-root-id',
				rootOrg: {},
				hashTagIds: ['id']
			} as any
		}) as any,
		setIsCustodianUser: jest.fn(),
		setGuestUser: jest.fn(),
		userid: 'sample-uid',
		appId: 'sample-id',
		getServerTimeDiff: '',
	};
	const formService: Partial<FormService> = {
		getFormConfig: jest.fn(() => of({})),
	};
	const contentUtilsServiceService: Partial<ContentUtilsServiceService> = {
		contentShareEvent: of('open') as any,
	};
	const contentService: Partial<ContentService> = {
		post: jest.fn().mockImplementation(() => { }),
		patch: jest.fn(),
	};
	const cdr: Partial<ChangeDetectorRef> = {
		detectChanges: jest.fn(),
	};
	const playerService: Partial<PublicPlayerService> = {
		getQuestionSetRead: jest.fn().mockImplementation(() => {
			return of(questionsetRead)
		})
	};

	const utilService: Partial<UtilService> = {};

	beforeAll(() => {
		component = new PlayerComponent(
			configService as ConfigService,
			router as Router,
			toasterService as ToasterService,
			resourceService as ResourceService,
			navigationHelperService as NavigationHelperService,
			deviceDetectorService as DeviceDetectorService,
			userService as UserService,
			formService as FormService,
			contentUtilsServiceService as ContentUtilsServiceService,
			contentService as ContentService,
			cdr as ChangeDetectorRef,
			playerService as PublicPlayerService,
			utilService as UtilService
		)
	});

	beforeEach(() => {
		jest.clearAllMocks();
		jest.resetAllMocks();
	});

	it('should create a instance of component', () => {
		expect(component).toBeTruthy();
	});

	it('should append UTM data to player context', () => {
		const playerConfig = {
			metadata: {
				mimeType: 'questionset',
				instructions: 'Mock instructions',
				identifier: 'mockIdentifier'
			},
			config: {
				sideMenu: {
					showDownload: false
				}
			},
			context: {
				cdata: []
			}
		};
		sessionStorage.setItem('UTM', JSON.stringify(['utm_data']));
		component.playerConfig = playerConfig as any;

		component.ngOnInit();
		expect(component.playerConfig.context.cdata).toContain('utm_data');
	});

	it('should append UTM data to player context if context.cdata does not exist', () => {
		const playerConfig = {
			metadata: {
				mimeType: 'questionset',
				instructions: 'Mock instructions',
				identifier: 'mockIdentifier'
			},
			config: {
				sideMenu: {
					showDownload: false
				}
			},
			context: {}
		};

		const utmData = ['utm_data'];
		sessionStorage.setItem('UTM', JSON.stringify(utmData));
		component.playerConfig = playerConfig as any;
		component.ngOnInit();
		expect(component.playerConfig.context.cdata).toEqual(utmData);
	});

	it('should throw an error when JSON parsing of UTM data fails', () => {
		sessionStorage.setItem('UTM', 'invalidJSON');
		expect(() => component.ngOnInit()).toThrowError('JSON Parse Error => UTM data');
	});

	describe('addUserDataToContext', () => {
		it('should add user data to player context', () => {
			component.addUserDataToContext();
			expect(component.playerConfig.context.userData).toEqual({
				firstName: 'Guest',
				lastName: ''
			});
		});

		it('should add user data to player context when user not logged in', () => {
			Object.defineProperty(userService, 'loggedIn', { get: jest.fn(() => false) });
			component.addUserDataToContext();

			expect(component['userService'].loggedIn).toBeFalsy;
			expect(component.playerConfig.context.userData).toEqual({
				firstName: 'Guest',
				lastName: ''
			});
		});
	})

	it('should set showPlayIcon to false when isSingleContent is false', () => {
		const playerConfig = {
			metadata: {
				mimeType: 'questionset',
				instructions: 'Mock instructions',
				identifier: 'mockIdentifier'
			},
			config: {
				sideMenu: {
					showDownload: false
				}
			},
			context: {
				cdata: []
			}
		};
		sessionStorage.setItem('UTM', JSON.stringify(['utm_data']));
		component.playerConfig = playerConfig as any;
		component.isSingleContent = false;
		component.ngOnInit();
		expect(component.showPlayIcon).toBe(false);
	});

	describe("ngOnDestroy", () => {
		it('should destroy sub', () => {
			component.unsubscribe = {
				next: jest.fn(),
				complete: jest.fn()
			} as any;
			component.ngOnDestroy();
			expect(component.unsubscribe.next).toHaveBeenCalled();
			expect(component.unsubscribe.complete).toHaveBeenCalled();
		});

		it('should call remove of playerElement  when content window not present', () => {
			component.contentIframe = {
				nativeElement: {
					remove: jest.fn()
				}
			} as any
			component.ngOnDestroy();

			expect(component.contentIframe.nativeElement.remove).toHaveBeenCalled();
		});

	});

	it('should load player in ngAfterViewInit if playerConfig is set', () => {
		component.playerConfig = {} as any;
		jest.spyOn(component.formService, 'getFormConfig').mockReturnValue(of({ "response": true }));
		const loadPlayerSpy = jest.spyOn(component, 'loadPlayer');
		component.ngAfterViewInit();
		expect(loadPlayerSpy).toHaveBeenCalled();
	});

	it('should set contentRatingModal and showNewPlayer to false and call detectChanges in ngOnChanges', () => {
		component.ngOnChanges({});
		expect(component.contentRatingModal).toBe(false);
		expect(component.showNewPlayer).toBe(false);
		expect(component['cdr'].detectChanges).toHaveBeenCalled();
	});

	it('should not change showQumlPlayer when MIME type is not for Quml player', () => {
		const playerConfig = {
			metadata: {
				mimeType: 'application/pdf',
				identifier: 'mock-identifier',
				instructions: null
			},
			config: {
				sideMenu: {
					showDownload: true
				}
			}
		};
		component.playerConfig = playerConfig as any;
		component.checkForQumlPlayer();
		expect(component.playerConfig?.config?.sideMenu?.showDownload).toBe(true);
		expect(component.showQumlPlayer).toBe(false);
	});

	it('should load old player with default player URL if conditions are not met', () => {
		component.isDesktopApp = false;
		component.isMobileOrTab = false;
		component.previewCdnUrl = '';
		component.isCdnWorking = 'no';
		const loadDefaultPlayerSpy = jest.spyOn(component, 'loadDefaultPlayer').mockImplementation();

		component.loadOldPlayer();
		expect(loadDefaultPlayerSpy).toHaveBeenCalledTimes(1);
		expect(loadDefaultPlayerSpy).toHaveBeenCalledWith();
	});

	it('should load old player with local base URL for desktop app if download status is true', () => {
		component.isDesktopApp = true;
		component.isMobileOrTab = false;
		component.previewCdnUrl = '';
		component.isCdnWorking = 'no';
		component.playerConfig = {
			metadata: {
				desktopAppMetadata: {
					isAvailable: true
				}
			}
		} as any;
		const updateMetadataForDesktopSpy = jest.spyOn(component, 'updateMetadataForDesktop').mockImplementation();
		const loadDefaultPlayerSpy = jest.spyOn(component, 'loadDefaultPlayer').mockImplementation();
		const rotatePlayerSpy = jest.spyOn(component, 'rotatePlayer').mockImplementation();
		component.loadOldPlayer();

		expect(updateMetadataForDesktopSpy).toHaveBeenCalledTimes(1);
		expect(loadDefaultPlayerSpy).toHaveBeenCalledTimes(1);
		expect(loadDefaultPlayerSpy).toHaveBeenCalledWith(component.configService.appConfig.PLAYER_CONFIG.localBaseUrl);
		expect(rotatePlayerSpy).not.toHaveBeenCalled();
	});

	it('should close content full screen on pop state', () => {
		const closeContentFullScreenSpy = jest.spyOn(component, 'closeContentFullScreen');
		component.onPopState(null);
		expect(closeContentFullScreenSpy).toHaveBeenCalled();

		closeContentFullScreenSpy.mockRestore();
	});

	it('should close fullscreen on orientation change when in portrait mode', () => {
		const closeFullscreenSpy = jest.spyOn(component, 'closeFullscreen');
		const portraitEvent = new Event('orientationchange');
		Object.defineProperty(window, 'screen', {
			value: { orientation: { type: 'portrait-primary' } },
			writable: true
		});
		component.handleOrientationChange();
		expect(closeFullscreenSpy).toHaveBeenCalled();
		closeFullscreenSpy.mockRestore();
	});

	it('should not close fullscreen on orientation change when not in portrait mode', () => {
		const closeFullscreenSpy = jest.spyOn(component, 'closeFullscreen');
		Object.defineProperty(window, 'screen', {
			value: { orientation: { type: 'landscape-primary' } },
			writable: true
		});
		component.handleOrientationChange();
		expect(closeFullscreenSpy).not.toHaveBeenCalled();
		closeFullscreenSpy.mockRestore();
	});

	it('should show the rating popup when the event indicates the end of content and progress is 100%', () => {
		const event = {
			detail: {
				telemetryData: {
					eid: 'END',
					edata: {
						summary: [{}, {}]
					}
				}
			}
		};

		component.playerConfig = {
			metadata: {
				mimeType: 'mockMimeType'
			}
		} as any;

		jest.spyOn(CsContentProgressCalculator, 'calculate').mockReturnValue(100);

		const modal = { showContentRatingModal: false };
		component.modal = modal as any;

		component.showRatingPopup(event);
		expect(component.contentRatingModal).toBeTruthy();
		expect(component.showRatingModalAfterClose).toBeTruthy();
		expect(modal.showContentRatingModal).toBeTruthy();
	});

	it('should enable the player and load it', () => {
		const initialMode = false;
		component.showPlayIcon = initialMode;
		const loadPlayerSpy = jest.spyOn(component, 'loadPlayer').mockImplementation();
		component.enablePlayer(true);
		expect(component.showPlayIcon).toBe(true);
		expect(loadPlayerSpy).toHaveBeenCalled();
	});

	it('should emit ratingPopupClose event when closeModal is called', () => {
		const emitSpy = jest.spyOn(component.ratingPopupClose, 'emit');
		jest.spyOn(document, 'querySelector').mockReturnValue(null);

		const focusOnReplaySpy = jest.spyOn(component, 'focusOnReplay');

		component.closeModal();

		expect(focusOnReplaySpy).toHaveBeenCalled();
		expect(emitSpy).toHaveBeenCalledWith({});
	});

	it('should not focus on replay button when playerType is not quml-player', () => {
		jest.spyOn(document, 'querySelector').mockReturnValue(null);
		component.playerType = 'other-player';
		const focusSpy = jest.spyOn(HTMLElement.prototype, 'focus');

		component.focusOnReplay();

		expect(focusSpy).not.toHaveBeenCalled();
	});

	it('should not focus on replay button when replay button does not exist', () => {
		jest.spyOn(document, 'querySelector').mockReturnValue(null);
		const focusSpy = jest.spyOn(HTMLElement.prototype, 'focus');

		component.focusOnReplay();

		expect(focusSpy).not.toHaveBeenCalled();
	});

	it('should exit fullscreen mode and show rating modal if showRatingModalAfterClose is true', () => {
		const exitFullscreenMock = jest.fn();
		document.exitFullscreen = exitFullscreenMock;
		document['mozCancelFullScreen'] = undefined;
		document['webkitExitFullscreen'] = undefined;
		document['msExitFullscreen'] = undefined;
		component.showRatingModalAfterClose = true;
		component.modal = { showContentRatingModal: false };
		component.closeFullscreen();

		expect(exitFullscreenMock).toHaveBeenCalled();
		expect(component.contentRatingModal).toBe(true);
		expect(component.modal?.showContentRatingModal).toBe(true);
	});

	it('should exit fullscreen mode and not show rating modal if showRatingModalAfterClose is false', () => {
		const exitFullscreenMock = jest.fn();
		document.exitFullscreen = exitFullscreenMock;
		document['mozCancelFullScreen'] = undefined;
		document['webkitExitFullscreen'] = undefined;
		document['msExitFullscreen'] = undefined;

		component.showRatingModalAfterClose = false;
		component.modal = { showContentRatingModal: false };
		component.closeFullscreen();
		expect(exitFullscreenMock).toHaveBeenCalled();
		expect(component.contentRatingModal).toBe(true);
		expect(component.modal?.showContentRatingModal).toBe(false);
	});

	it('should load CDN player correctly', () => {
		const cdnUrl = 'mock-cdn-url';
		const buildNumber = 'mock-build-number';
		component.configService.appConfig.PLAYER_CONFIG = { cdnUrl };
		component.buildNumber = buildNumber;
		jest.useFakeTimers();
		const contentIframeMock = {
			nativeElement: {
				src: '',
				onload: null,
				addEventListener: jest.fn().mockReturnValue({}),
				removeEventListener: jest.fn()
			}
		};
		component.contentIframe = contentIframeMock as any;
		component.loadCdnPlayer();
		jest.runAllTimers();
		expect(contentIframeMock.nativeElement.src).toBe(`${cdnUrl}&build_number=${buildNumber}`);
		expect(contentIframeMock.nativeElement.onload).toBeInstanceOf(Function);
		expect(contentIframeMock.nativeElement.removeEventListener).not.toHaveBeenCalled();
	});

	it('should load default player correctly', () => {
		const baseURL = 'mock-base-url';
		component.configService.appConfig.PLAYER_CONFIG = { baseURL };
		jest.useFakeTimers();
		const contentIframeMock = {
			nativeElement: {
				src: 'mock-base-url&build_number=mock-build-number',
				onload: null,
				addEventListener: jest.fn(),
				removeEventListener: jest.fn()
			}
		};
		component.contentIframe = contentIframeMock as any;
		const historyMock = ['mock-url1', 'mock-url2'];
		//@ts-ignore
		component.navigationHelperService.history = historyMock as any;
		component.loadDefaultPlayer();
		jest.runAllTimers();
		const expectedSrc = `${baseURL}&build_number=${component.buildNumber}`;
		expect(contentIframeMock.nativeElement.src).toBe(expectedSrc);
		expect(contentIframeMock.nativeElement.onload).toBe(null);
		expect(contentIframeMock.nativeElement.removeEventListener).not.toHaveBeenCalled();
	});

	it('should emit selfAssessLastAttempt event when event has isLastAttempt property set to true', () => {
		const emitSpy = jest.spyOn(component.selfAssessLastAttempt, 'emit');
		const event = {
			edata: {
				isLastAttempt: true
			}
		};
		component.generatelimitedAttemptEvent(event);
		expect(emitSpy).toHaveBeenCalledWith(event);
	});


	it('should emit selfAssessLastAttempt event when event has maxLimitExceeded property set to true', () => {
		const event = {
			edata: {
				maxLimitExceeded: true
			}
		};
		component.generatelimitedAttemptEvent(event);
		expect(component.selfAssessLastAttempt.emit).toHaveBeenCalledWith(event);
	});

	it('should not emit selfAssessLastAttempt event when event does not have relevant properties', () => {
		const event = {};
		component.generatelimitedAttemptEvent(event);
		expect(component.selfAssessLastAttempt.emit).not.toHaveBeenCalled();
	});


	it('should handle event of type exdata', () => {
		const generateLimitedAttemptEventSpy = jest.spyOn(component, 'generatelimitedAttemptEvent');
		const event = {
			eid: 'exdata',
		};
		component.eventHandler(event);
		expect(generateLimitedAttemptEventSpy).toHaveBeenCalledWith(event);
	});

	it('should handle event of type END', () => {
		const setItemMock = jest.spyOn(localStorage, 'setItem');
		const event = {
			eid: 'END',
			metaData: {}
		};
		Object.defineProperty(userService, 'loggedIn', { get: jest.fn(() => true) });
		component['eventHandler'](event);
		expect(userService.loggedIn).toBe(true);
		expect(userService.userData$).toBeTruthy();
	});

	it('should handle event of type SHARE', () => {
		const contentUtilsServiceServiceMock = {
			contentShareEvent: {
				emit: jest.fn()
			}
		};
		component.contentUtilsServiceService = contentUtilsServiceServiceMock as any;
		const event = {
			edata: {
				type: 'SHARE'
			}
		};
		component.eventHandler(event);
		expect(contentUtilsServiceServiceMock.contentShareEvent.emit).toHaveBeenCalledWith('open');
		expect(component.mobileViewDisplay).toBe('none');
	});

	it('should handle event of type PRINT', () => {
		jest.spyOn(document, 'querySelector').mockReturnValue({
			contentWindow: {
				print: jest.fn()
			}
		} as any);
		const event = {
			edata: {
				type: 'PRINT'
			}
		};

		component.eventHandler(event);
		expect(document.querySelector).toHaveBeenCalledWith('pdf-viewer iframe');
		expect(component.mobileViewDisplay).toBe('none');
	});

	it('should handle generateContentReadEvent method correctly', () => {
		const event = {
			detail: {
				telemetryData: {
					eid: 'END',
					object: { id: 'sample-content-id' }
				}
			}
		};

		const contentProgressEvents$Spy = { next: jest.fn() };
		component.contentProgressEvents$ = contentProgressEvents$Spy as any;

		jest.spyOn(component, 'showRatingPopup' as any).mockReturnValue('');
		jest.spyOn(component.assessmentEvents, 'emit' as any).mockReturnValue('');
		jest.spyOn(component.questionScoreSubmitEvents, 'emit' as any).mockReturnValue('');

		component.playerConfig = { metadata: { identifier: 'sample-content-id', mimeType: 'sample-mime-type' } } as any;
		component.configService = {
			appConfig: {
				PLAYER_CONFIG: {
					cdnUrl: '',
					MIME_TYPE: {
						questionset: 'mockQuestionSetMimeType'
					}
				}
			},
		} as any;
		component.generateContentReadEvent(event);

		expect(component.showRatingPopup).toHaveBeenCalledWith(event);
		expect(contentProgressEvents$Spy.next).toHaveBeenCalledWith(event);
		expect(component.assessmentEvents.emit).toHaveBeenCalledWith(event);
	});

	it('should emit scene change event correctly', () => {
		const contentIframeMock = { nativeElement: { contentWindow: { EkstepRendererAPI: { getCurrentStageId: jest.fn() } } } };

		const eventData = { stageId: 'sample-stage-id' };
		jest.useFakeTimers();
		jest.spyOn(component.sceneChangeEvent, 'emit');
		jest.spyOn(window, 'setTimeout');

		component.contentIframe = contentIframeMock as any;
		component.emitSceneChangeEvent();

		jest.advanceTimersByTime(100);
		expect(window.setTimeout).toHaveBeenCalledWith(expect.any(Function), 0);
		expect(component.sceneChangeEvent.emit).toHaveBeenCalled();
	});

	it('should load new player correctly', () => {
		Object.defineProperty(userService, 'loggedIn', { get: jest.fn(() => true) });
		const userData$Mock = new BehaviorSubject<any>({ userProfile: { id: 'user_id' } });
		Object.defineProperty(userService, 'userData$', { get: jest.fn(() => userData$Mock.asObservable()) });
		jest.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation(() => {
			return '';
		});

		const originalLocationOrigin = location.origin;
		delete (global as any).location;
		(global as any).location = { origin: 'http://localhost' };

		component.playerConfig = {
			metadata: {
				desktopAppMetadata: { isAvailable: true },
				artifactUrl: 'artifact-url',
				identifier: 'content-id',
				mimeType: 'mime-type'
			},
			context: {
				objectRollup: { l1: 'collection-id' }
			},
			config: {}
		} as any;

		component.loadNewPlayer();
		expect(component.playerConfig.metadata.artifactUrl).toBe('http://localhost/artifact-url');
		expect(component.contentId).toBe('content-id');
		expect(component.collectionId).toBe('collection-id');
		expect(component.isFullScreenView).toBe(false);
		expect(component.showNewPlayer).toBe(true);
		expect(localStorage.getItem).toHaveBeenCalledTimes(1);
		expect(userData$Mock.subscribe).toBeInstanceOf(Function);
		(global as any).location.origin = originalLocationOrigin;
	});

	it('should set showQumlPlayer to true when mimeType is questionset', () => {
		component.playerConfig = {
			metadata: {
				mimeType: 'mockQuestionSetMimeType',
				identifier: 'sampleIdentifier',
				instructions: null
			},
			config: {
				sideMenu: { showDownload: true }
			}
		} as any;
		component.playerService = {
			getQuestionSetRead: jest.fn().mockImplementation(() => {
				return of(questionsetRead)
			})
		} as any;
		component.checkForQumlPlayer();
		expect(component.showQumlPlayer).toBe(false);
		expect(component.playerConfig.config.sideMenu.showDownload).toBe(false);
	});

	it('should configure the pdf player element correctly', () => {
		component.pdfPlayer = {} as any;
		const nativeElementSpy = document.createElement('div');
		Object.defineProperty(component.pdfPlayer, 'nativeElement', {
			get: jest.fn().mockReturnValue(nativeElementSpy)
		});
		jest.spyOn(nativeElementSpy, 'addEventListener');
		component.pdfPlayerConfig();
		expect(component.pdfPlayer.nativeElement.innerHTML).toContain('player-config');
	});

	it('should configure the video player element correctly', () => {
		component.videoPlayer = {} as any;
		const nativeElementSpy = document.createElement('div');
		Object.defineProperty(component.videoPlayer, 'nativeElement', {
			get: jest.fn().mockReturnValue(nativeElementSpy)
		});
		jest.spyOn(nativeElementSpy, 'addEventListener');
		component.videoPlayerConfig();
		expect(component.videoPlayer.nativeElement.innerHTML).toContain('player-config');
	});

	it('should configure the epub player element correctly', () => {
		component.epubPlayer = {} as any;
		const nativeElementSpy = document.createElement('div');
		Object.defineProperty(component.epubPlayer, 'nativeElement', {
			get: jest.fn().mockReturnValue(nativeElementSpy)
		});
		jest.spyOn(nativeElementSpy, 'addEventListener');
		component.epubPlayerConfig();
		expect(component.epubPlayer.nativeElement.innerHTML).toContain('player-config');
	});
	it('should configure the quml player element correctly', () => {
		component.qumlPlayer = {} as any;
		const nativeElementSpy = document.createElement('div');
		Object.defineProperty(component.qumlPlayer, 'nativeElement', {
			get: jest.fn().mockReturnValue(nativeElementSpy)
		});
		jest.spyOn(nativeElementSpy, 'addEventListener');
		component.qumlPlayerConfig();
		expect(component.qumlPlayer.nativeElement.innerHTML).toContain('player-config');
	});

	it('should emit questionScoreSubmitEvents when event data is ACCESSEVENT', () => {
		component.questionScoreSubmitEvents = {
			emit: jest.fn()
		} as any;
		component.selfAssessLastAttempt = {
			emit: jest.fn()
		} as any;
		component.questionScoreReviewEvents = {
			emit: jest.fn()
		} as any;
		component.CONSTANT = {
			ACCESSEVENT: 'ACCESSEVENT',
			ISLASTATTEMPT: 'ISLASTATTEMPT',
			MAXATTEMPT: 'MAXATTEMPT',
			ACCESSREVIEWEVENT: 'ACCESSREVIEWEVENT'
		} as any;

		const event = { data: 'ACCESSEVENT' };
		component.generateScoreSubmitEvent(event);
		expect(component.questionScoreSubmitEvents.emit).toHaveBeenCalledWith(event);
	});

	it('should emit selfAssessLastAttempt when event data is ISLASTATTEMPT or MAXATTEMPT', () => {
		component.questionScoreSubmitEvents = {
			emit: jest.fn()
		} as any;
		component.selfAssessLastAttempt = {
			emit: jest.fn()
		} as any;
		component.questionScoreReviewEvents = {
			emit: jest.fn()
		} as any;
		component.CONSTANT = {
			ACCESSEVENT: 'ACCESSEVENT',
			ISLASTATTEMPT: 'ISLASTATTEMPT',
			MAXATTEMPT: 'MAXATTEMPT',
			ACCESSREVIEWEVENT: 'ACCESSREVIEWEVENT'
		} as any;
		const event1 = { data: 'ISLASTATTEMPT' };
		const event2 = { data: 'MAXATTEMPT' };
		component.generateScoreSubmitEvent(event1);
		component.generateScoreSubmitEvent(event2);
		expect(component.selfAssessLastAttempt.emit).toHaveBeenCalledTimes(2);
		expect(component.selfAssessLastAttempt.emit).toHaveBeenCalledWith(event1);
		expect(component.selfAssessLastAttempt.emit).toHaveBeenCalledWith(event2);
	});

	it('should emit questionScoreReviewEvents when event data is ACCESSREVIEWEVENT', () => {
		component.questionScoreSubmitEvents = {
			emit: jest.fn()
		} as any;
		component.selfAssessLastAttempt = {
			emit: jest.fn()
		} as any;
		component.questionScoreReviewEvents = {
			emit: jest.fn()
		} as any;
		component.CONSTANT = {
			ACCESSEVENT: 'ACCESSEVENT',
			ISLASTATTEMPT: 'ISLASTATTEMPT',
			MAXATTEMPT: 'MAXATTEMPT',
			ACCESSREVIEWEVENT: 'ACCESSREVIEWEVENT'
		} as any;
		const event = { data: 'ACCESSREVIEWEVENT' };
		component.generateScoreSubmitEvent(event);
		expect(component.questionScoreReviewEvents.emit).toHaveBeenCalledWith(event);
	});

	it('should not emit any event when event data does not match any constant', () => {
		component.questionScoreSubmitEvents = {
			emit: jest.fn()
		} as any;
		component.selfAssessLastAttempt = {
			emit: jest.fn()
		} as any;
		component.questionScoreReviewEvents = {
			emit: jest.fn()
		} as any;
		component.CONSTANT = {
			ACCESSEVENT: 'ACCESSEVENT',
			ISLASTATTEMPT: 'ISLASTATTEMPT',
			MAXATTEMPT: 'MAXATTEMPT',
			ACCESSREVIEWEVENT: 'ACCESSREVIEWEVENT'
		} as any;
		const event = { data: 'OTHER_EVENT' };
		component.generateScoreSubmitEvent(event);
		expect(component.questionScoreSubmitEvents.emit).not.toHaveBeenCalled();
		expect(component.selfAssessLastAttempt.emit).not.toHaveBeenCalled();
		expect(component.questionScoreReviewEvents.emit).not.toHaveBeenCalled();
	});

	describe('updateMetadataForDesktop()', () => {
		it('should update metadata for desktop when download is available', () => {
			component.playerConfig = {
				metadata: {
					desktopAppMetadata: {
						isAvailable: true
					},
					artifactUrl: 'mockArtifactUrl',
					mimeType: 'mockMimeType'
				}
			} as any;
			component.playerConfig.data = 'mock'
			component.updateMetadataForDesktop();
			expect(component.playerConfig.data).toBe('mock');
			expect(component.playerConfig.metadata.artifactUrl).toBe('mockArtifactUrl');
		});
	});

	describe('eventHandler()', () => {
		it('should store metadata in localStorage for guest user', () => {
			Object.defineProperty(component['userService'], 'loggedIn', {
				get: jest.fn(() => false)
			});
			component.collectionId = 'mockCollectionId';
			component.contentId = 'mockContentId';
			const mockUser = { userProfile: { id: 'guest' } };
			jest.spyOn(component['userService'], 'userData$' as any, 'get').mockReturnValue(of(mockUser));
			const eventData = {
				eid: 'END',
				metaData: {
					mimeType: 'application/vnd.ekstep.content-collection',
				}
			};
			component.eventHandler(eventData);
			const expectedVarName = '';
			JSON.stringify(eventData.metaData);
			expect(localStorage.getItem(expectedVarName)).toBe(undefined);
		});
	});

	it('should subscribe to contentFullScreenEvent and handle full screen view', () => {
		component.playerConfig = {
			metadata: {
				mimeType: 'questionset',
				instructions: 'Mock instructions',
				identifier: 'mockIdentifier'
			},
			config: {
				sideMenu: {
					showDownload: false
				}
			},
			context: {
				cdata: [],
				userData: []
			}
		} as any;
		const contentUtilsServiceServiceMock = {
			contentShareEvent: {
				emit: jest.fn(),
				pipe: jest.fn(() => {
					return of(true)
				})
			} as any,
		};
		component.contentUtilsServiceService = contentUtilsServiceServiceMock as any;
		const mockIsFullScreen = true;
		const navigationHelperServiceSpy = jest.spyOn(component['navigationHelperService'].contentFullScreenEvent, 'pipe').mockReturnValueOnce(of(mockIsFullScreen));

		if (component['navigationHelperService'].handleContentManagerOnFullscreen) {
			jest.spyOn(component['navigationHelperService'], 'handleContentManagerOnFullscreen').mockImplementation(() => { });
		}
		const mockDocument = {
			getElementsByTagName: jest.fn().mockReturnValue([{ classList: { add: jest.fn() } }]),
			body: { classList: { add: jest.fn() } }
		};
		jest.spyOn(global.document, 'getElementsByTagName').mockImplementation(() => mockDocument.getElementsByTagName());
		jest.spyOn(mockDocument.body.classList, 'add');


		const loadPlayerSpy = jest.spyOn(component, 'loadPlayer').mockImplementation(() => { });
		component.ngOnInit();

		expect(navigationHelperServiceSpy).toHaveBeenCalled();
		expect(component.isFullScreenView).toBe(mockIsFullScreen);
		expect(document.getElementsByTagName).toHaveBeenCalledWith('html');
		expect(loadPlayerSpy).toHaveBeenCalled();
	});

	it('should subscribe to contentFullScreenEvent and handle exit full screen view', () => {
		component.playerConfig = {
			metadata: {
				mimeType: 'questionset',
				instructions: 'Mock instructions',
				identifier: 'mockIdentifier'
			},
			config: {
				sideMenu: {
					showDownload: false
				}
			},
			context: {
				cdata: [],
				userData: []
			}
		} as any;
		const contentUtilsServiceServiceMock = {
			contentShareEvent: {
				emit: jest.fn(),
				pipe: jest.fn(() => {
					return of(false)
				})
			} as any,
		};
		component.contentUtilsServiceService = contentUtilsServiceServiceMock as any;
		const mockIsFullScreen = false;
		const navigationHelperServiceSpy = jest.spyOn(component['navigationHelperService'].contentFullScreenEvent, 'pipe').mockReturnValueOnce(of(mockIsFullScreen));

		if (component['navigationHelperService'].handleContentManagerOnFullscreen) {
			jest.spyOn(component['navigationHelperService'], 'handleContentManagerOnFullscreen').mockImplementation(() => { });
		}
		const mockDocument = {
			getElementsByTagName: jest.fn().mockReturnValue([{ classList: { remove: jest.fn() } }]),
			body: { classList: { remove: jest.fn() } }
		};
		jest.spyOn(global.document, 'getElementsByTagName').mockImplementation(() => mockDocument.getElementsByTagName());
		jest.spyOn(mockDocument.body.classList, 'remove');
		component.ngOnInit();

		expect(navigationHelperServiceSpy).toHaveBeenCalled();
		expect(component.isFullScreenView).toBe(mockIsFullScreen);
		expect(document.getElementsByTagName).toHaveBeenCalledWith('html');
	});

	it('should subscribe to contentShareEvent and set mobileViewDisplay', () => {
		component.playerConfig = {
			metadata: {
				mimeType: 'questionset',
				instructions: 'Mock instructions',
				identifier: 'mockIdentifier'
			},
			config: {
				sideMenu: {
					showDownload: false
				}
			},
			context: {
				cdata: [],
				userData: []
			}
		} as any;
		const contentUtilsServiceServiceMock = {
			contentShareEvent: {
				emit: jest.fn(),
				pipe: jest.fn(() => {
					return of(true)
				})
			} as any,
		};
		component.contentUtilsServiceService = contentUtilsServiceServiceMock as any;
		component.isMobileOrTab = false;
		jest.spyOn(component['navigationHelperService'].contentFullScreenEvent, 'pipe').mockReturnValueOnce(of('close'));

		const contentUtilsServiceServiceSpy = jest.spyOn(component['contentUtilsServiceService'].contentShareEvent, 'pipe').mockReturnValueOnce(of('close'));

		component.ngOnInit();
		expect(contentUtilsServiceServiceSpy).toHaveBeenCalledWith(expect.any(Function));
	});

	it('should clone event if newPlayerEvent is true', () => {
		const mockEvent = {};
		const cloneDeepSpy = jest.spyOn(_, 'cloneDeep');
		component.generateContentReadEvent(mockEvent, true);
		expect(cloneDeepSpy).toHaveBeenCalledWith(mockEvent);
	});

	it('should not clone event if newPlayerEvent is false or not provided', () => {
		const mockEvent = {};
		const cloneDeepSpy = jest.spyOn(_, 'cloneDeep');
		component.generateContentReadEvent(mockEvent);
		expect(cloneDeepSpy).not.toHaveBeenCalled();
	});

	it('should return early if eventCopy is falsy', () => {
		component.generateContentReadEvent(null);
		component.generateContentReadEvent(undefined);
	});

	it('should call videoPlayerConfig after 200ms if playerType is "video-player"', () => {
		const nativeElementMock = {
			append: jest.fn()
		};
		component.videoPlayer = {
			nativeElement: nativeElementMock as any
		};
		component.playerConfig = true as any;
		component.playerType = "video-player";
		component.playerService = {
			getQuestionSetRead: jest.fn().mockImplementation(() => {
				return of(questionsetRead)
			})
		} as any;
		jest.useFakeTimers();
		const spy = jest.spyOn(component, 'videoPlayerConfig');
		component.ngAfterViewInit();
		jest.advanceTimersByTime(500);
		expect(spy).toHaveBeenCalled();
	});

	it('should not call videoPlayerConfig if playerType is not "video-player"', () => {
		component.playerConfig = true as any;
		component.playerType = "audio-player";
		jest.useFakeTimers();
		component.ngAfterViewInit();
		jest.advanceTimersByTime(500);
		expect(playerService.getQuestionSetRead).not.toHaveBeenCalled();
	});

	it('should call pdfPlayerConfig after 200ms if playerType is "pdf-player"', () => {
		const nativeElementMock = {
			append: jest.fn()
		};
		component.pdfPlayer = {
			nativeElement: nativeElementMock as any
		};
		component.playerConfig = true as any;
		component.playerType = "pdf-player";
		component.playerService = {
			getQuestionSetRead: jest.fn().mockImplementation(() => {
				return of(questionsetRead)
			})
		} as any;
		jest.useFakeTimers();
		const spy = jest.spyOn(component, 'pdfPlayerConfig');
		component.ngAfterViewInit();
		jest.advanceTimersByTime(500);
		expect(spy).toHaveBeenCalled();
	});
	it('should call epubPlayerConfig after 200ms if playerType is "epub-player"', () => {
		const nativeElementMock = {
			append: jest.fn()
		};
		component.epubPlayer = {
			nativeElement: nativeElementMock as any
		};
		component.playerConfig = true as any;
		component.playerType = "epub-player";
		component.playerService = {
			getQuestionSetRead: jest.fn().mockImplementation(() => {
				return of(questionsetRead)
			})
		} as any;
		jest.useFakeTimers();
		const spy = jest.spyOn(component, 'epubPlayerConfig');
		component.ngAfterViewInit();
		jest.advanceTimersByTime(500);
		expect(spy).toHaveBeenCalled();
	});

	it('should call qumlPlayerConfig after 200ms if playerType is "quml-player"', () => {
		const nativeElementMock = {
			append: jest.fn()
		};
		component.qumlPlayer = {
			nativeElement: nativeElementMock as any
		};
		component.playerConfig = true as any;
		component.playerType = "quml-player";
		component.playerService = {
			getQuestionSetRead: jest.fn().mockImplementation(() => {
				return of(questionsetRead)
			})
		} as any;
		jest.useFakeTimers();
		const spy = jest.spyOn(component, 'qumlPlayerConfig');
		component.ngAfterViewInit();
		jest.advanceTimersByTime(500);
		expect(spy).toHaveBeenCalled();
	});
	it('should not call any player config method for unknown playerType', () => {
		component.playerType = 'unknown-player';
		const videoPlayerConfigSpy = jest.spyOn(component, 'videoPlayerConfig');
		const pdfPlayerConfigSpy = jest.spyOn(component, 'pdfPlayerConfig');
		const pdfEpubConfigSpy = jest.spyOn(component, 'epubPlayerConfig');
		const qumlEpubConfigSpy = jest.spyOn(component, 'qumlPlayerConfig');
		component.configurePlayer();
		expect(videoPlayerConfigSpy).not.toHaveBeenCalled();
		expect(pdfPlayerConfigSpy).not.toHaveBeenCalled();
		expect(pdfEpubConfigSpy).not.toHaveBeenCalled();
		expect(qumlEpubConfigSpy).not.toHaveBeenCalled();


	});

});