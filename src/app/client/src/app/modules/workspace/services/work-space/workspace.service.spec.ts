
/**
* Description.
* This spec file was created using ng-test-barrel plugin!
*
*/


import { ConfigService, ServerResponse, ICard, NavigationHelperService, ResourceService, BrowserCacheTtlService } from '@sunbird/shared';
import { ContentService, PublicDataService, UserService, ActionService } from '@sunbird/core';
import { Router } from '@angular/router';
import { _ } from 'lodash-es';
import { CacheService } from '../../../shared/services/cache-service/cache.service';
import { WorkSpaceService } from './workspace.service';
import { of, throwError } from 'rxjs';
import * as data from './workspace.service.spec.data';

describe('WorkSpaceService', () => {
	let component: WorkSpaceService;

	const config: Partial<ConfigService> = {
		urlConFig: {
			URLS: {
				QUESTIONSET: {
					V1: {
						HIERARCHY_READ: "questionset/v1/hierarchy",
						READ: "questionset/v1/read"
					},
					CREATE: "questionset/v2/create",
					READ: "questionset/v2/read",
					HIERARCHY_READ: "questionset/v2/hierarchy",
					COPY: "questionset/v2/copy",
					LIST_API: "api/question/v2/list"
				},
				CONTENT: {
					SEARCH: "content/v1/search",
					CREATE: "content/v1/create",
					PUBLISH: "content/v1/publish",
					GET: "content/v1/read",
					RETIRE: "content/v1/retire",
					REJECT: "content/v1/reject",
					FLAG: "content/v1/flag",
					UPLOAD: "content/v1/upload",
					ACCEPT_FLAG: "content/v1/flag/accept",
					DISCARD_FLAG: "content/v1/flag/reject",
					COPY: "content/v1/copy",
					LOCK_LIST: "lock/v1/list",
					LOCK_CREATE: "lock/v1/create",
					LOCK_RETIRE: "lock/v1/retire",
					UPDATE: "content/v3/update",
					REVIEW: "content/v3/review",
					HIERARCHY_ADD: "content/v3/hierarchy/add",
					HIERARCHY_REMOVE: "content/v3/hierarchy/remove",
					COPY_AS_COURSE: "course/v1/create"
				},
				dataDrivenForms: {
					READ: "data/v1/form/read"
				},
				COMPOSITE: {
					SEARCH: "composite/v1/search",
					SEARCH_IMAGES: "composite/v3/search"
				},
				CHANNEL: {
					READ: "channel/v1/read"
				},
			}
		},
		appConfig: {
			WORKSPACE: {
				genericMimeType: ['application/generic'],
				states: ['draft']
			}
		},
		editorConfig: {
			rules: {
				'levels': 7,
				'objectTypes': []
			},
			'publishMode': false,
			'isFlagReviewer': false,
			DEFAULT_PARAMS_FIELDS: 'createdBy,status,mimeType,contentType,resourceType,collaborators,contentDisposition,primaryCategory,framework,targetFWIds,qumlVersion',
		}

	};
	const content: Partial<ContentService> = {
		post: jest.fn(),
		delete: jest.fn(),

	};
	const route: Partial<Router> = {
		navigate: jest.fn()
	};
	const navigationHelperService: Partial<NavigationHelperService> = {
		storeWorkSpaceCloseUrl: jest.fn()
	};
	const cacheService: Partial<CacheService> = {
		get: jest.fn(),
		set: jest.fn()
	};
	const browserCacheTtlService: Partial<BrowserCacheTtlService> = {};
	const resourceService: Partial<ResourceService> = {};
	const publicDataService: Partial<PublicDataService> = {
		post: jest.fn(),
		get: jest.fn()
	};
	const userService: Partial<UserService> = {};
	const actionService: Partial<ActionService> = {
		post: jest.fn(),
		get: jest.fn()
	};

	beforeAll(() => {
		component = new WorkSpaceService(
			config as ConfigService,
			content as ContentService,
			route as Router,
			navigationHelperService as NavigationHelperService,
			cacheService as CacheService,
			browserCacheTtlService as BrowserCacheTtlService,
			resourceService as ResourceService,
			publicDataService as PublicDataService,
			userService as UserService,
			actionService as ActionService
		)
	});

	beforeEach(() => {
		jest.clearAllMocks();
		jest.resetAllMocks();
	});

	it('should create a instance of component', () => {
		expect(component).toBeTruthy();
	});

	it('should call getComments', () => {
		let requestParam = { contentIds: ['124s'] }
		component.deleteContent(requestParam);
		expect(content.delete).toHaveBeenCalled();
	});

	it('should open openCollectionEditor for course type', () => {
		let content = { mimeType: 'application/vnd.ekstep.content-collection', contentType: 'course', primaryCategory: 'course', status: 'active' }
		component.navigateToContent(content, {});
		expect(route.navigate).toHaveBeenCalled();
	});
	it('should open openCollectionEditor for textbook type', () => {
		let content = { mimeType: 'application/vnd.ekstep.content-collection', contentType: 'textbook', primaryCategory: 'textbook' }
		component.navigateToContent(content, {});
		expect(route.navigate).toHaveBeenCalled();
	});

	it('should open ecml workspace for draft status', () => {
		let content = { mimeType: 'application/vnd.ekstep.ecml-archive', contentType: 'ecml', primaryCategory: 'textbook', status: 'active' }
		component.navigateToContent(content, 'draft');
		expect(route.navigate).toHaveBeenCalled();
	});

	it('should open ecml workspace for upForReview status', () => {
		let content = { mimeType: 'application/vnd.ekstep.ecml-archive', contentType: 'ecml', primaryCategory: 'textbook', status: 'active' }
		component.navigateToContent(content, 'upForReview');
		expect(route.navigate).toHaveBeenCalled();
	});

	it('should open ecml workspace for flagged status', () => {
		let content = { mimeType: 'application/vnd.ekstep.ecml-archive', contentType: 'ecml', primaryCategory: 'textbook', status: 'active' }
		component.navigateToContent(content, 'flagged');
		expect(route.navigate).toHaveBeenCalled();
	});

	it('should open ecml workspace for review status', () => {
		let content = { mimeType: 'application/vnd.ekstep.ecml-archive', contentType: 'ecml', primaryCategory: 'textbook', status: 'active' }
		component.navigateToContent(content, 'review');
		expect(route.navigate).toHaveBeenCalled();
	});

	it('should open ecml workspace for flagreviewer status', () => {
		let content = { mimeType: 'application/vnd.ekstep.ecml-archive', contentType: 'ecml', primaryCategory: 'textbook', status: 'active' }
		component.navigateToContent(content, 'flagreviewer');
		expect(route.navigate).toHaveBeenCalled();
	});

	it('should open questonset editor', () => {
		let content = { mimeType: 'application/vnd.sunbird.questionset', contentType: 'ecml', primaryCategory: 'textbook', status: 'active' }
		component.navigateToContent(content, 'flagreviewer');
		expect(route.navigate).toHaveBeenCalled();
	});

	it('should open generic editor', () => {
		let content = { mimeType: 'application/generic', contentType: 'ecml', primaryCategory: 'textbook', status: 'active' }
		component.navigateToContent(content, 'draft');
		expect(route.navigate).toHaveBeenCalled();
	});

	it('should open generic editor for revew status', () => {
		let content = { mimeType: 'application/generic', contentType: 'ecml', primaryCategory: 'textbook', status: 'active' }
		component.navigateToContent(content, 'review');
		expect(route.navigate).toHaveBeenCalled();
	});

	it('should open generic editor for upForReview status', () => {
		let content = { mimeType: 'application/generic', contentType: 'ecml', primaryCategory: 'textbook', status: 'active' }
		component.navigateToContent(content, 'upForReview');
		expect(route.navigate).toHaveBeenCalled();
	});

	it('should open generic editor for flagged status', () => {
		let content = { mimeType: 'application/generic', contentType: 'ecml', primaryCategory: 'textbook', status: 'active' }
		component.navigateToContent(content, 'flagged');
		expect(route.navigate).toHaveBeenCalled();
	});

	it('should open generic editor for flagreviewer status', () => {
		let content = { mimeType: 'application/generic', contentType: 'ecml', primaryCategory: 'textbook', status: 'active' }
		component.navigateToContent(content, 'flagreviewer');
		expect(route.navigate).toHaveBeenCalled();
	});

	describe('getDataForCard', () => {
		it('should create a list of cards with static, dynamic and meta data', () => {
			const data = [
				{
					name: 'Card 1',
					appIcon: 'icon1.png',
					description: 'Description 1',
					lockInfo: 'Locked',
					originData: 'Origin 1',
					dynamicField1: 'Value1',
					dynamicField2: 'Value2',
					metaField1: 'MetaValue1',
				},
			];

			const staticData = {
				staticField1: 'StaticValue1',
				staticField2: 'StaticValue2',
			};

			const dynamicFields = {
				dynamicField1: ['dynamicField1'],
				dynamicField2: ['dynamicField2'],
			};

			const metaData = {
				metaField: ['metaField1'],
			};

			const expectedOutput = [
				{
					name: 'Card 1',
					image: 'icon1.png',
					description: 'Description 1',
					lockInfo: 'Locked',
					originData: 'Origin 1',
					staticField1: 'StaticValue1',
					staticField2: 'StaticValue2',
					metaField: { metaField1: 'MetaValue1' },
					dynamicField1: 'Value1',
					dynamicField2: 'Value2',
				},
			];

			const result = component.getDataForCard(data, staticData, dynamicFields, metaData);
		});

		it('should handle empty data input gracefully', () => {
			const data = [];
			const staticData = {};
			const dynamicFields = {};
			const metaData = {};

			const expectedOutput = [];

			const result = component.getDataForCard(data, staticData, dynamicFields, metaData);

			expect(result).toEqual(expectedOutput);
		});

		it('should handle missing dynamic and meta fields', () => {
			const data = [
				{
					name: 'Card 2',
					appIcon: 'icon2.png',
					description: 'Description 2',
					lockInfo: 'Unlocked',
					originData: 'Origin 2',
				},
			];

			const staticData = {
				staticField1: 'StaticValue1',
			};

			const dynamicFields = {};

			const metaData = {};

			const expectedOutput = [
				{
					name: 'Card 2',
					image: 'icon2.png',
					description: 'Description 2',
					lockInfo: 'Unlocked',
					originData: 'Origin 2',
					staticField1: 'StaticValue1',
				},
			];

			const result = component.getDataForCard(data, staticData, dynamicFields, metaData);

			expect(result).toEqual(expectedOutput);
		});
	});


	it('sets up popstate listener when inEditor is true', () => {
		component.toggleWarning();
	});

	it('sets up popstate listener when inEditor is true', () => {
		component.newtoggleWarning();
	});


	it('should call getFormData', () => {

		let content = { mimeType: 'application/generic', contentType: 'ecml', primaryCategory: 'textbook', status: 'active' }
		component.navigateToContent(content, 'flagreviewer');
		expect(route.navigate).toHaveBeenCalled();
	});

	it('should call the getFormConfig method with inputs for the method for cacheService', async () => {
		const formInputParams = {
			formType: 'user',
			formAction: 'onboarding',
			contentType: 'exclusion',
			component: 'portal',
			framework: 'NTP'
		};
		const mockCachedData = {
			id: 'id',
			params: {
				resmsgid: '',
				status: 'staus'
			},
			responseCode: 'OK',
			result: {},
			ts: '',
			ver: ''
		};
		publicDataService.post = jest.fn(() => of({}) as any)
		await component.getFormData(formInputParams).toPromise();
		expect(cacheService.get).toHaveBeenCalled();
	}, 10000);

	it('should call the getFormConfig method with inputs for the method for cacheService', async () => {
		const formInputParams = {
			formType: 'user',
			formAction: 'onboarding',
			contentType: 'exclusion',
			component: 'portal',
			framework: 'NTP'
		};
		const mockCachedData = {
			id: 'id',
			params: {
				resmsgid: '',
				status: 'staus'
			},
			responseCode: 'OK',
			result: {},
			ts: '',
			ver: ''
		};
		publicDataService.post = jest.fn(() => of({}) as any)
		jest.spyOn(cacheService, 'get').mockReturnValue(of(mockCachedData));
		await component.getFormData(formInputParams).toPromise();
		expect(cacheService.get).toHaveBeenCalled();
	}, 10000);

	it('should call getContentLockList', () => {
		component.getContentLockList({});
		expect(content.post).toHaveBeenCalled();
	});

	it('should call lockContent', () => {
		component.lockContent({});
		expect(content.post).toHaveBeenCalled();
	});

	it('should call retireLock', () => {
		component.retireLock({});
		expect(content.delete).toHaveBeenCalled();
	});

	it('should call searchContent', () => {
		component.searchContent({});
		expect(content.post).toHaveBeenCalled();
	});

	it('should call getChannel', () => {
		component.getChannel({});
		expect(publicDataService.get).toHaveBeenCalled();
	});

	it('should call createQuestionSet', () => {
		component.createQuestionSet({});
		expect(actionService.post).toHaveBeenCalled();
	});

	it('should call getQuestion', () => {
		actionService.get = jest.fn(() => of({})) as any
		component.getQuestion('123', {}).subscribe(data => {
			expect(actionService.get).toHaveBeenCalled();
		});
	});

	it('should call getCategoryDefinition', () => {
		component.getCategoryDefinition('type', 'name', 'channel');
		expect(actionService.post).toHaveBeenCalled();
	});

	it('should call getQuestionSetCreationStatus', () => {
		component.getFormData = jest.fn(() => of({})) as any
		component.getQuestionSetCreationStatus();
		expect(component.getFormData).toHaveBeenCalled();
	});

	it('should not call getQuestionSetCreationStatus', () => {
		component.getFormData = jest.fn(() => throwError(of({}))) as any
		component.getQuestionSetCreationStatus();
		expect(component.getFormData).toHaveBeenCalled();
	});

	it('should call getAllContent', () => {
		component.getFormData = jest.fn(() => of({})) as any
		component.getAllContent(data.mockRes.sucessData, true);
	});

	it('should call getAllContent', () => {
		component.getFormData = jest.fn(() => of({})) as any
		component.getAllContent(data.mockRes.sucessData, false);
	});
});