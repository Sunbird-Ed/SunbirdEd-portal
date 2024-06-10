import { Router } from '@angular/router';
import { CsGroupAddActivitiesRequest, CsGroupRemoveActivitiesRequest, CsGroupSearchCriteria, CsGroupUpdateActivitiesRequest, CsGroupUpdateMembersRequest, CsGroupUpdateGroupGuidelinesRequest, CsGroupSupportedActivitiesFormField } from '@project-sunbird/client-services/services/group/interface';
import { UserService, LearnerService, TncService } from '@sunbird/core';
import { NavigationHelperService, ResourceService, ConfigService } from '@sunbird/shared';
import { TelemetryService } from '@sunbird/telemetry';
import { _ } from 'lodash-es';
import { IGroupCard, IGroupUpdate, IMember, MY_GROUPS } from '../../interfaces';
import { CsLibInitializerService } from './../../../../service/CsLibInitializer/cs-lib-initializer.service';
import { CsGroup } from '@project-sunbird/client-services/models';
import { GroupsService } from './groups.service';
jest.mock('@project-sunbird/client-services', () => {
	return {
		CsModule: {
			instance: {
				config: {
					core: {
						api: {
							authentication: {
								userToken: ''
							}
						}
					}
				},
				groupService: {
					updateById: jest.fn(),
					create: jest.fn(),
					search: jest.fn(),
					getById: jest.fn(),
					deleteById: jest.fn(),
					addMembers: jest.fn(),
					updateMembers: jest.fn(),
					removeMembers: jest.fn(),
					addActivities: jest.fn(),
					updateActivities: jest.fn(),
					removeActivities: jest.fn(),
					suspendById: jest.fn(),
					reactivateById: jest.fn(),
					updateGroupGuidelines: jest.fn(),

					activityService: {
						getDataAggregation: jest.fn(),
						getDataForDashlets: jest.fn()
					}
				},
				userService: {
					checkUserExists: jest.fn(),
					userProfile: {

					}

				},
				updateConfig: jest.fn().mockImplementation(() => {
				})
			},
			updateById: {}
		}
	};
});
describe('GroupsService', () => {
	let service: GroupsService;
	const csLibInitializerService: Partial<CsLibInitializerService> = {
		initializeCs: jest.fn()
	};
	const userService: Partial<UserService> = {
		userid: 'mocked-userid',
		userProfile: {
			_userData: {
				allTncAccepted: {
					groupsTnc: {
						version: 1
					}
				}
			}

		},
	};
	const resourceService: Partial<ResourceService> = {
		languageSelected$: {
			pipe: jest.fn().mockReturnValueOnce({
				subscribe: jest.fn((callback: any) => {
					setTimeout(() => {
						callback({ value: 'en' });
					}, 600);
				})
			})
		} as any,
		frmelmnts: {
			lbl: {
				you: 'You'
			}
		}
	};
	const telemetryService: Partial<TelemetryService> = {
		interact: jest.fn()
	};
	const navigationhelperService: Partial<NavigationHelperService> = {
		goBack: jest.fn(),
		getPageLoadTime: jest.fn()
	};
	const router: Partial<Router> = {
		navigate: jest.fn()
	};
	const configService: Partial<ConfigService> = {
		urlConFig: {
			URLS: {
				SYSTEM_SETTING: {
					GOOGLE_RECAPTCHA: 'mocked-url'
				}
			}
		},
	};
	const learnerService: Partial<LearnerService> = {

		get: jest.fn()
	};
	const tncService: Partial<TncService> = {};
	beforeAll(() => {
		service = new GroupsService(
			csLibInitializerService as CsLibInitializerService,
			userService as UserService,
			resourceService as ResourceService,
			telemetryService as TelemetryService,
			navigationhelperService as NavigationHelperService,
			router as Router,
			configService as ConfigService,
			learnerService as LearnerService,
			tncService as TncService

		)
	});

	beforeEach(() => {
		jest.clearAllMocks();
		jest.resetAllMocks();

	});
	it('should create a instance of service', () => {
		expect(service).toBeTruthy();
	});

	it('should set current user role correctly', () => {
		const members = [
			{ userId: '1', role: 'admin' },
			{ userId: '2', role: 'member' },
		];
		service['userService'] = { userid: '2' } as any
		service['groupData'] = { createdBy: '1' } as any;
		service.setCurrentUserRole(members);
		expect(service.isCurrentUserAdmin).toBe(false);
		expect(service.isCurrentUserCreator).toBe(false);
	});

	it('should assign random colors to each group in the provided groupList array', () => {
		const groupList = [
			{ id: 1, name: 'Group 1' },
			{ id: 2, name: 'Group 2' },
			{ id: 3, name: 'Group 3' }
		] as any

		const result = service.addGroupPaletteList(groupList);

		expect(result).toHaveLength(groupList.length);
		result.forEach(group => {
			expect(group).toHaveProperty('cardBgColor');
			expect(group).toHaveProperty('cardTitleColor');
		});
	});

	it('should return an empty array if groupList is null', () => {
		const result = service.addGroupPaletteList(null);

		expect(result).toEqual([]);
	});

	it('should call learnerService.get with the constructed systemSetting object', () => {
		service.getRecaptchaSettings();

		expect(learnerService.get).toHaveBeenCalledWith({
			url: configService.urlConFig.URLS.SYSTEM_SETTING.GOOGLE_RECAPTCHA
		});
	});

	it('should call groupCservice.updateById with the provided groupId and updateRequest', () => {
		service['groupCservice'].updateById = jest.fn()
		const groupId = 'group1';
		const updateRequest: IGroupUpdate = {
		} as any
		service.updateGroup(groupId, updateRequest);
		expect(service['groupCservice'].updateById).toHaveBeenCalledWith(groupId, updateRequest);
	});
	it('should call groupCservice.create with the provided groupData', () => {
		service['groupCservice'].create = jest.fn()
		const groupData: IGroupCard = {
		} as any;

		service.createGroup(groupData);

		expect(service['groupCservice'].create).toHaveBeenCalledWith(groupData);
	});

	it('should call groupCservice.search with the provided search request', () => {
		service['groupCservice'].search = jest.fn()
		const searchRequest: CsGroupSearchCriteria = {
		} as any;
		service.searchUserGroups(searchRequest);
		expect(service['groupCservice'].search).toHaveBeenCalledWith(searchRequest);
	});

	it('should call groupCservice.getById with the provided groupId and options', () => {
		service['groupCservice'].getById = jest.fn()
		const groupId = 'group1';
		const includeMembers = true;
		const includeActivities = false;
		const groupActivities = true;
		service.getGroupById(groupId, includeMembers, includeActivities, groupActivities);
		expect(service['groupCservice'].getById).toHaveBeenCalledWith(groupId, {
			includeMembers,
			includeActivities,
			groupActivities
		});
	});

	it('should add fields to the member object based on the defined logic', () => {
		const member = {
			name: 'John',
			userName: 'john_doe',
			userId: 'user123',
			identifier: 'identifier123',
			role: 'admin',
			isSelf: 'pkg',
			isMenu: "test"
		};
		service.isCurrentUserCreator = true
		const result = service.addFields(member);

		expect(result.title).toBe('John');
		expect(result.initial).toBe('J');
		expect(result.identifier).toBe('user123');
		expect(result.isAdmin).toBe(true);
		expect(result.isCreator).toBe(false);
		expect(result.isMenu).toBe(true);
	});
	it('should call groupCservice.deleteById with the provided groupId', () => {
		service['groupCservice'].deleteById = jest.fn()
		service.deleteGroupById('groupId123');
		expect(service['groupCservice'].deleteById).toHaveBeenCalledWith('groupId123');
	});

	it('should call groupCservice.addMembers with the provided groupId and members', () => {
		service['groupCservice'].addMembers = jest.fn();
		const members: IMember = {
		} as any;
		service.addMemberById('groupId123', members);
		expect(service['groupCservice'].addMembers).toHaveBeenCalledWith('groupId123', members);
	});

	it('should call groupCservice.updateMembers with the provided groupId and updateMembersRequest', () => {
		service['groupCservice'].updateMembers = jest.fn();
		const updateMembersRequest: CsGroupUpdateMembersRequest = {
		} as any;
		service.updateMembers('groupId123', updateMembersRequest);
		expect(service['groupCservice'].updateMembers).toHaveBeenCalledWith('groupId123', updateMembersRequest);
	});

	it('should call groupCservice.removeMembers with the provided groupId and userIds', () => {
		service['groupCservice'].removeMembers = jest.fn()
		const userIds: string[] = ['user1', 'user2'];
		service.removeMembers('groupId123', userIds);
		expect(service['groupCservice'].removeMembers).toHaveBeenCalledWith('groupId123', { userIds });
	});

	it('should call groupCservice.addActivities with the provided groupId and addActivitiesRequest', () => {
		service['groupCservice'].addActivities = jest.fn();
		const addActivitiesRequest: CsGroupAddActivitiesRequest = {
		} as any;

		service.addActivities('groupId123', addActivitiesRequest);

		expect(service['groupCservice'].addActivities).toHaveBeenCalledWith('groupId123', addActivitiesRequest);
	});

	it('should call groupCservice.updateActivities with the provided groupId and updateActivitiesRequest', () => {
		service['groupCservice'].updateActivities = jest.fn();
		const updateActivitiesRequest: CsGroupUpdateActivitiesRequest = {
			activities: {
				id: 'string',
				type: 'test',
				status: {
					ACTIVE: "active",
					INACTIVE: "inactive",
					SUSPENDED: "suspended"
				}
			} as any
		};

		service.updateActivities('groupId123', updateActivitiesRequest);

		expect(service['groupCservice'].updateActivities).toHaveBeenCalledWith('groupId123', updateActivitiesRequest);
	});

	it('should call groupCservice.removeActivities with the provided groupId and removeActivitiesRequest', () => {
		service['groupCservice'].removeActivities = jest.fn();
		const removeActivitiesRequest: CsGroupRemoveActivitiesRequest = {
			activityIds: ['test']
		};

		service.removeActivities('groupId123', removeActivitiesRequest);

		expect(service['groupCservice'].removeActivities).toHaveBeenCalledWith('groupId123', removeActivitiesRequest);
	});

	it('should call userCservice.checkUserExists with the provided memberId and captchaToken', () => {
		service['userCservice'].checkUserExists = jest.fn();
		const captchaToken = {};
		service.getUserData('memberId123', captchaToken);
		expect(service['userCservice'].checkUserExists).toHaveBeenCalledWith({ key: 'userName', value: 'memberId123' }, captchaToken);
	});

	it('should call groupCservice.activityService.getDataAggregation with the provided groupId, activity, mergeGroup, and leafNodesCount', () => {
		service['groupCservice'].activityService.getDataAggregation = jest.fn();
		const groupId = 'groupId123';
		const activity = 'activity123';
		const mergeGroup = true;
		const leafNodesCount = 5;
		service.getActivity(groupId, activity, mergeGroup, leafNodesCount);
		expect(service['groupCservice'].activityService.getDataAggregation).toHaveBeenCalledWith(groupId, activity, mergeGroup, leafNodesCount);
	});

	it('should call telemetryService.interact with the correct interactData object', () => {
		const eid = {
			id: 'eventId123', 
			edata: {
				type: 'eventType',
				subtype: 'eventSubtype'
			},
			extra: {
				key1: 'value1',
				key2: 'value2'
			}
		};
		const routeData = {
			params: {
				groupId: 'groupId123'
			},
			data: {
				telemetry: {
					env: 'testEnvironment',
					pageid: 'testPageId'
				}
			}
		};
		const cdata = [];
		const groupId = 'groupId123';
		const obj = {
			key: 'value'
		};
		service.addTelemetry(eid, routeData, cdata, groupId, obj);
		expect(telemetryService.interact).toHaveBeenCalledWith({
			context: {
				env: 'testEnvironment',
				cdata: [{ id: 'groupId123', type: 'Group' }]
			},
			edata: {
				id: 'eventId123',
				type: 'eventType',
				subtype: 'eventSubtype',
				extra: {
					key1: 'value1',
					key2: 'value2'
				},
				pageid: 'testPageId'
			},
			object: {
				key: 'value'
			}
		});
	});

	it('should handle empty activitiesGrouped', () => {
		const showList = false;
		const groupData = {};

		const result = service.groupContentsByActivityType(showList, groupData);

		expect(result.showList).toBe(false);
		expect(result.activities).toEqual({});
	});

	it('should emit showActivateModal event with the provided name and eventName', () => {
		const name = 'testName';
		const eventName = 'testEvent';
		jest.spyOn(service.showActivateModal, 'emit')
		service.emitActivateEvent(name, eventName);
		expect(service.showActivateModal.emit).toHaveBeenCalledWith({ name, eventName });
	});

	it('should call groupCservice.suspendById with the provided groupId', () => {
		service['groupCservice'].suspendById = jest.fn();
		const groupId = 'groupId123';
		service.deActivateGroupById(groupId);
		expect(service['groupCservice'].suspendById).toHaveBeenCalledWith(groupId);
	});

	it('should call groupCservice.reactivateById with the provided groupId', () => {
		service['groupCservice'].reactivateById = jest.fn()
		const groupId = 'groupId123';
		service.activateGroupById(groupId);
		expect(service['groupCservice'].reactivateById).toHaveBeenCalledWith(groupId);
	});

	it('should emit updateEvent with the provided value', () => {
		const value = 'testValue';
		jest.spyOn(service.updateEvent, 'emit');
		service.emitUpdateEvent(value);
		expect(service.updateEvent.emit).toHaveBeenCalledWith(value);
	});

	it('should update the group status and return whether the group is active', () => {
		const group = new CsGroup();
		const status =
			{
				ACTIVE: "active",
			} as any;
		const isActive = service.updateGroupStatus(group, status);
		expect(group.status).toBe(status);
		expect(isActive).toBe(group.isActive());
	});


	it('should emit the showMenu event with the provided visibility parameter', () => {
		const visibility = true;
		jest.spyOn(service.showMenu, 'emit')
		service.emitMenuVisibility(visibility);
		expect(service.showMenu.emit).toHaveBeenCalledWith(visibility);
	});
	it('should emit the closeForm event', () => {
		jest.spyOn(service.closeForm, 'emit')
		service.emitCloseForm();
		expect(service.closeForm.emit).toHaveBeenCalled();
	});

	it('should emit the membersList event with the provided members', () => {
		const members = [{}, {}] as any;
		jest.spyOn(service.membersList, 'emit')
		service.emitMembers(members);
		expect(service.membersList.emit).toHaveBeenCalledWith(members);
	});

	it('should emit the showLoader event with the provided value', () => {
		const value = true;
		jest.spyOn(service.showLoader, 'emit')
		service.emitShowLoader(value);
		expect(service.showLoader.emit).toHaveBeenCalledWith(value);
	});


	it('should construct the impression object with default edata properties when edata is not provided', () => {
		const routeData = {
			data: {
				telemetry: {
					type: 'defaultType',
					subtype: 'defaultSubtype',
					env: 'defaultEnv',
					pageid: 'defaultPageId',
				}
			},
			params: {}
		};
		const url = 'testUrl';

		const impressionObj = service.getImpressionObject(routeData, url);

		expect(impressionObj).toEqual({
			context: {
				env: 'defaultEnv'
			},
			edata: {
				type: 'defaultType',
				pageid: 'defaultPageId',
				subtype: 'defaultSubtype',
				uri: 'testUrl',
			}
		});
	});
	it('should include object information in the impression object if groupId is present in routeData', () => {
		const routeData = {
			data: {
				telemetry: {
					type: 'defaultType',
					subtype: 'defaultSubtype',
					env: 'defaultEnv',
					pageid: 'defaultPageId'
				}
			},
			params: {
				groupId: 'testGroupId'
			}
		};
		const url = 'testUrl';
		const impressionObj = service.getImpressionObject(routeData, url);
		expect(impressionObj).toEqual({
			context: {
				env: 'defaultEnv'
			},
			edata: {
				type: 'defaultType',
				pageid: 'defaultPageId',
				subtype: 'defaultSubtype',
				uri: 'testUrl',
			},
			object: {
				id: 'testGroupId',
				type: 'Group',
				ver: '1.0'
			}
		});
	});


	it('should return false if the groups TNC version is equal to or greater than the latest version', () => {

		const result = service.isTncUpdated();

		expect(result).toBe(false);
	});
	it('should return an empty array if members array is falsy', () => {
		const result = service.addFieldsToMember(null);
		expect(result).toEqual([]);
	});

	it('should correctly add fields to each member and sort the array based on criteria', () => {
		const members = [
			{ userId: 1, name: 'John', role: 'admin' },
			{ userId: 2, name: 'Alice', role: 'member' }
		];

		const result = service.addFieldsToMember(members);

		expect(result).toEqual([
			{ userId: 1, name: 'John', role: 'admin', indexOfMember: 0, isAdmin: true, isSelf: false, isMenu: false, title: 'John', initial: 'J', identifier: 1, isCreator: false, },
			{ userId: 2, name: 'Alice', role: 'member', indexOfMember: 1, isAdmin: false, isSelf: false, isMenu: false, title: 'Alice', initial: 'A', identifier: 2, isCreator: false, }
		]);
	});
	it('should call getDataForDashlets method of activityService with the provided data', () => {
		service['groupCservice'].activityService.getDataForDashlets = jest.fn()
		const courseHeirarchyData = {};
		const aggData = {};
		service.getDashletData(courseHeirarchyData, aggData);
		expect(service['groupCservice'].activityService.getDataForDashlets).toHaveBeenCalledWith(courseHeirarchyData, aggData);
	});
	it('should call updateGroupGuidelines method of groupCService with the provided request', () => {
		service['groupCservice'].updateGroupGuidelines = jest.fn();
		const request = {} as any;
		service.updateGroupGuidelines(request);
		expect(service['groupCservice'].updateGroupGuidelines).toHaveBeenCalledWith(request);
	});

	it('should navigate to MY_GROUPS if _history has only one item', () => {
		navigationhelperService['_history'] = ['someRoute'];
		service.goBack();
		expect(router.navigate).toHaveBeenCalledWith([MY_GROUPS]);
	});
	it('should call navigationhelperService.goBack if _history has more than one item', () => {
		navigationhelperService['_history'] = ['someRoute1', 'someRoute2'];

		service.goBack();

		expect(navigationhelperService.goBack).toHaveBeenCalled();
	});
	it('should return the latestTnc value when using the getter method', () => {
		const groupsTnc = {};
		service['_groupsTnc'] = groupsTnc;
		const result = service.latestTnc;
		expect(result).toEqual(groupsTnc);
	});

	it('should set the userData value when using the setter method', () => {
		const userData = {};
		service.userData = userData;
		expect(service['_userData']).toEqual(userData);
	});
	it('should return true if user has accepted TNC and groupsTnc is not empty', () => {
		service['_userData'] = {
			allTncAccepted: {
				groupsTnc: {
					version: 1
				}
			}
		};
		const result = service.isUserAcceptedTnc();
		expect(result).toBe(true);
	});

	it('should return false if user has not accepted TNC or groupsTnc is empty', () => {
		service['_userData'] = {
			allTncAccepted: {
				groupsTnc: {

				}
			}
		};
		const resultEmptyGroupsTnc = service.isUserAcceptedTnc();

		expect(resultEmptyGroupsTnc).toBe(false);

		service['_userData'] = {
			allTncAccepted: {}
		};
		const resultNoGroupsTnc = service.isUserAcceptedTnc();
		expect(resultNoGroupsTnc).toBe(false);
	});

	it('should parse groupsTnc value if it is a string before setting', () => {
		const groupsTnc = {
			value: '{"key": "value"}'
		};
		service.groupsTncDetails = groupsTnc;
		expect(service['_groupsTnc']).toEqual({ value: { key: 'value' } });
	});

	it('should set groupsTnc value as is if it is not a string', () => {
		const groupsTnc = {
			value: { key: 'value' }
		};
		service.groupsTncDetails = groupsTnc;
		expect(service['_groupsTnc']).toEqual(groupsTnc);
	});
});