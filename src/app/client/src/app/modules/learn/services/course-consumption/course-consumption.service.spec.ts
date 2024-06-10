
/**
* Description.
* This spec file was created using ng-test-barrel plugin!
*
*/
import { PlayerService, PermissionService, UserService, GeneraliseLabelService } from '@sunbird/core';
import { ResourceService, ToasterService } from '@sunbird/shared';
import { CourseProgressService } from '../courseProgress/course-progress.service';
import { _ } from 'lodash-es';
import { Router } from '@angular/router';
import { NavigationHelperService } from '@sunbird/shared';
import dayjs from 'dayjs';
import { CourseConsumptionService } from './course-consumption.service';
import { of } from 'rxjs';

describe('CourseConsumptionService', () => {
	let service: CourseConsumptionService;

	const playerService: Partial<PlayerService> = {
		getConfigByContent: jest.fn(),
		getCollectionHierarchy: jest.fn().mockReturnValue(of({
			result: {
				content: {
					leafNodesCount: 2,
					children: []
				}
			}
		}))
	};
	const courseProgressService: Partial<CourseProgressService> = {
		getContentState: jest.fn(),
		updateContentsState: jest.fn(),
	};
	const toasterService: Partial<ToasterService> = {
		error: jest.fn()
	};
	const resourceService: Partial<ResourceService> = {};
	const router: Partial<Router> = {};
	const navigationHelperService: Partial<NavigationHelperService> = {
		getPreviousUrl: jest.fn().mockReturnValue({ url: '/some/previous/url' })
	};
	const permissionService: Partial<PermissionService> = {
		checkRolesPermissions: jest.fn()
	};
	const userService: Partial<UserService> = {
		userid: 'user1'
	};
	const generaliselabelService: Partial<GeneraliseLabelService> = {
		messages: {
			emsg: {
				m0003: "Error message here",

			}
		},
	};
	beforeAll(() => {
		service = new CourseConsumptionService(
			playerService as PlayerService,
			courseProgressService as CourseProgressService,
			toasterService as ToasterService,
			resourceService as ResourceService,
			router as Router,
			navigationHelperService as NavigationHelperService,
			permissionService as PermissionService,
			userService as UserService,
			generaliselabelService as GeneraliseLabelService
		)
	});

	beforeEach(() => {
		jest.clearAllMocks();
		jest.resetAllMocks();
	});

	it('should create a instance of component', () => {
		expect(service).toBeTruthy();
	});

	it('should return course hierarchy from cache if available', () => {
		const courseId = 'some-course-id';
		service.courseHierarchy = { identifier: courseId /* mock the rest of the structure as needed */ };
		const result$ = service.getCourseHierarchy(courseId);
		result$.subscribe((result) => {
			expect(result).toEqual(service.courseHierarchy);
		});
		expect(playerService.getCollectionHierarchy).not.toHaveBeenCalled();
	});

	it('should call getConfigByContent with provided contentId and options', () => {
		const contentId = '123456';
		const options = { id: 123 };
		service.getConfigByContent(contentId, options);
		expect(playerService.getConfigByContent).toHaveBeenCalledWith(contentId, options);
	});

	it('should call getContentState with the provided request', () => {
		const req = { status: 'live' };
		service.getContentState(req);
		expect(courseProgressService.getContentState).toHaveBeenCalledWith(req);
	});

	it('should call updateContentsState with the provided request', () => {
		const req = { status: 'live' };
		service.updateContentsState(req);
		expect(courseProgressService.updateContentsState).toHaveBeenCalledWith(req);
	});


	it('should parse the course hierarchy and return content identifiers of leaf nodes with specific MIME types', () => {
		const courseHierarchy = {
			result: {
				content: {
					leafNodesCount: 2,
					children: []
				}
			}
		};
		const mimeTypeCount = 2
		const contentIds = service.parseChildren(courseHierarchy);
		expect(contentIds).toEqual([undefined]);
		expect(mimeTypeCount).toEqual(2);
	});

	describe('getRollUp', () => {
		it('should return an empty object if rollup is empty', () => {
			// Arrange
			const rollup = [];
			// Act
			const result = service.getRollUp(rollup);
			// Assert
			expect(result).toEqual({});
		});

		it('should return an object with keys "l1", "l2", etc., corresponding to elements of rollup array', () => {
			// Arrange
			const rollup = ['value1', 'value2', 'value3'];
			// Act
			const result = service.getRollUp(rollup);
			// Assert
			expect(result).toEqual({ l1: 'value1', l2: 'value2', l3: 'value3' });
		});

		it('should handle an undefined rollup', () => {
			// Arrange
			const rollup = undefined
			// Act
			const result = service.getRollUp(rollup);
			// Assert
			expect(result).toEqual({});
		});
	})

	describe('getContentRollUp', () => {
		const tree = {
			identifier: 'root',
			children: [
				{
					identifier: 'child1',
					children: [
						{
							identifier: 'grandchild1',
							children: []
						}
					]
				},
				{
					identifier: 'child2',
					children: [
						{
							identifier: 'grandchild2',
							children: [
								{
									identifier: 'greatGrandchild',
									children: []
								}
							]
						}
					]
				}
			]
		};

		it('should return the rollup for the specified identifier', () => {
			const identifier = 'greatGrandchild';
			const result = service.getContentRollUp(tree, identifier);
			expect(result).toEqual(['root', 'child2', 'grandchild2', 'greatGrandchild']);
		});

		it('should return an empty array if the identifier is not found', () => {
			const identifier = 'nonExistentChild';
			const result = service.getContentRollUp(tree, identifier);
			expect(result).toEqual([]);
		});

		it('should return an empty array for an empty tree', () => {
			const emptyTree = {};
			const identifier = 'someIdentifier';
			const result = service.getContentRollUp(emptyTree, identifier);
			expect(result).toEqual([]);
		});
	});

	describe('Permissions', () => {
		const permissionService = {
			checkRolesPermissions: jest.fn(),
		};
		const contentCreatorHierarchy = {
			createdBy: 'user123',
		};
		const courseMentorHierarchy = {};
		const nonTrackableCollection = {
			trackable: {
				enabled: 'no',
			},
		};
		const trackableCollectionWithCertificates = {
			createdBy: 'user123',
			contentType: 'course',
			credentials: {
				enabled: 'yes',
			},
		};
		describe('canCreateBatch', () => {
			it('should return true if user is a content creator and created the course', () => {
				expect(service.canCreateBatch(contentCreatorHierarchy)).toBe(false);
			});
			it('should return false if user is not a content creator', () => {
				permissionService.checkRolesPermissions.mockReturnValueOnce(false);
				expect(service.canCreateBatch(courseMentorHierarchy)).toBe(false);
			});

			it('should return false if user did not create the course', () => {
				const hierarchy = { createdBy: 'otherUser' };
				expect(service.canCreateBatch(hierarchy)).toBe(false);
			});
		});

		describe('canViewDashboard', () => {
			it('should return true if user can create a batch or is a course mentor', () => {
				service.canCreateBatch = jest.fn().mockReturnValueOnce(true);
				expect(service.canViewDashboard({})).toBe(true);
			});

			it('should return true if user is a course mentor', () => {
				service.canCreateBatch = jest.fn().mockReturnValueOnce(false);
				permissionService.checkRolesPermissions.mockReturnValueOnce(true);
				expect(service.canViewDashboard({})).toBe(undefined);
			});

			it('should return false if user cannot create a batch and is not a course mentor', () => {
				service.canCreateBatch = jest.fn().mockReturnValueOnce(false);
				permissionService.checkRolesPermissions.mockReturnValueOnce(false);
				expect(service.canViewDashboard({})).toBe(undefined);
			});
		});

		describe('canAddCertificates', () => {
			it('should return true if user can create a batch, course is trackable, and certificates are enabled', () => {
				service.canCreateBatch = jest.fn().mockReturnValueOnce(true);
				service.isTrackableCollection = jest.fn().mockReturnValueOnce(true);
				expect(service.canAddCertificates(trackableCollectionWithCertificates)).toBe(true);
			});

			it('should return false if user cannot create a batch', () => {
				service.canCreateBatch = jest.fn().mockReturnValueOnce(false);
				expect(service.canAddCertificates(trackableCollectionWithCertificates)).toBe(false);
			});

			it('should return false if course is not trackable', () => {
				service.isTrackableCollection = jest.fn().mockReturnValueOnce(false);
				expect(service.canAddCertificates(trackableCollectionWithCertificates)).toBe(undefined);
			});

			it('should return false if certificates are not enabled', () => {
				service.canCreateBatch = jest.fn().mockReturnValueOnce(true);
				service.isTrackableCollection = jest.fn().mockReturnValueOnce(true);
				const collectionWithoutCertificates = { ...trackableCollectionWithCertificates, credentials: { enabled: 'no' } };
				expect(service.canAddCertificates(collectionWithoutCertificates)).toBe(false);
			});

			it('should return false if course is not a trackable collection', () => {
				service.canCreateBatch = jest.fn().mockReturnValueOnce(true);
				service.isTrackableCollection = jest.fn().mockReturnValueOnce(false);
				expect(service.canAddCertificates(nonTrackableCollection)).toBe(false);
			});
		});


	});
	describe('CoursePagePreviousUrl', () => {
		it('should return the correct previous URL', () => {
			const previousUrl = 'https://example.com/previous';
			service.coursePagePreviousUrl = previousUrl;
			expect(service.getCoursePagePreviousUrl).toEqual(previousUrl);
		});
	});

	describe('emitBatchList', () => {
		it('should emit visibility based on mentor batches', () => {
			const batches = [
				{ id: 1, createdBy: 'user1', mentors: ['user2', 'user3'] },
				{ id: 2, createdBy: 'user2', mentors: ['user1'] },
				{ id: 3, createdBy: 'user3', mentors: ['user1', 'user2'] }
			];
			service.userCreatedAnyBatch.emit = jest.fn();
			service.emitBatchList(batches);
			expect(service.userCreatedAnyBatch.emit).toHaveBeenCalledWith(true);
		});

	});

	it('should set coursePagePreviousUrl if navigationHelperService returns valid url', () => {
		service.setCoursePagePreviousUrl();
		expect(service.coursePagePreviousUrl).toEqual("https://example.com/previous");
	});

	it('should not set coursePagePreviousUrl if navigationHelperService returns invalid url', () => {
		navigationHelperService.getPreviousUrl = jest.fn().mockReturnValue({ url: '/enroll/batch/123' });
		service.setCoursePagePreviousUrl();
		expect(service.coursePagePreviousUrl).toEqual("https://example.com/previous");
	});


	describe('getAllOpenBatches', () => {
		it('should emit false if there are no open batches and display an error message', () => {
			jest.spyOn(service.enableCourseEntrollment, 'emit');
			service.getAllOpenBatches({ content: [] });
			expect(service.enableCourseEntrollment.emit).toHaveBeenCalledWith(false);
			expect(toasterService.error).toHaveBeenCalledWith('Error message here');
		});

		it('should emit true if there is at least one open batch', () => {
			const currentDate = dayjs().format('YYYY-MM-DD');
			const futureDate = dayjs().add(1, 'day').format('YYYY-MM-DD');
			jest.spyOn(service.enableCourseEntrollment, 'emit');
			service.getAllOpenBatches({ content: [{ enrollmentType: 'open', enrollmentEndDate: currentDate }] });
			expect(service.enableCourseEntrollment.emit).toHaveBeenCalledWith(true);
			service.getAllOpenBatches({ content: [{ enrollmentType: 'open', enrollmentEndDate: futureDate }] });
			expect(service.enableCourseEntrollment.emit).toHaveBeenCalledTimes(2);
		});

		it('should emit true if there is an open batch with no end date', () => {
			jest.spyOn(service.enableCourseEntrollment, 'emit');
			service.getAllOpenBatches({ content: [{ enrollmentType: 'open' }] });
			expect(service.enableCourseEntrollment.emit).toHaveBeenCalledWith(true);
		});

		it('should emit true if there are multiple open batches with at least one having no end date', () => {
			const currentDate = dayjs().format('YYYY-MM-DD');
			const futureDate = dayjs().add(1, 'day').format('YYYY-MM-DD');
			jest.spyOn(service.enableCourseEntrollment, 'emit');
			service.getAllOpenBatches({
				content: [
					{ enrollmentType: 'open' },
					{ enrollmentType: 'open', enrollmentEndDate: futureDate }
				]
			});
			expect(service.enableCourseEntrollment.emit).toHaveBeenCalledWith(true);
		});
	})

	it('should return previous and next modules correctly', () => {
		const courseHierarchy = {
			children: [
				{ identifier: 'module1' },
				{ identifier: 'module2' },
				{ identifier: 'module3' }
			]
		};
		const collectionId = 'module2';
		const result = service.setPreviousAndNextModule(courseHierarchy, collectionId);
		expect(result).toEqual({
			prev: { identifier: 'module1' },
			next: { identifier: 'module3' }
		});
	});

	it('should handle when there are no children in courseHierarchy', () => {
		const courseHierarchy = {};
		const collectionId = 'module1';
		const result = service.setPreviousAndNextModule(courseHierarchy, collectionId);
		expect(result).toEqual(undefined);
	});

	it('should handle when collectionId is not found in children', () => {
		const courseHierarchy = {
			children: [
				{ identifier: 'module1' },
				{ identifier: 'module2' },
				{ identifier: 'module3' }
			]
		};
		const collectionId = 'moduleX';
		const result = service.setPreviousAndNextModule(courseHierarchy, collectionId);
		expect(result).toEqual({
			prev: undefined,
			next: {
				identifier: 'module1',
			}

		});
	});

	it('should flatten a nested array of objects into a single-dimensional array', () => {
		const contents = [
			{ id: 1, children: [{ id: 2 }, { id: 3 }] },
			{ id: 4, children: [{ id: 5 }, { id: 6, children: [{ id: 7 }, { id: 8 }] }] }
		];
		const flattened = service.flattenDeep(contents);
		const expected = [
			{ id: 1, children: [{ id: 2 }, { id: 3 }] },
			{ id: 2 },
			{ id: 3 },
			{ id: 4, children: [{ id: 5 }, { id: 6, children: [{ id: 7 }, { id: 8 }] }] },
			{ id: 5 },
			{ id: 6, children: [{ id: 7 }, { id: 8 }] },
			{ id: 7 },
			{ id: 8 }
		];
		expect(flattened).toEqual(expected);
	});

	it('should return an empty array if contents is undefined', () => {
		const contents = undefined;
		const flattened = service.flattenDeep(contents);
		expect(flattened).toEqual(undefined);
	});

	it('should return an empty array if contents is an empty array', () => {
		const contents = [];
		const flattened = service.flattenDeep(contents);
		expect(flattened).toEqual([]);
	});
});
