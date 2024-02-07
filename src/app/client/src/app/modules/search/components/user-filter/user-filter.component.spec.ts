import { ResourceService,IUserData,ToasterService } from '@sunbird/shared';
import { Component,OnInit,ChangeDetectorRef } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { UserService,OrgDetailsService,RolesAndPermissions,PermissionService,FrameworkService,FormService } from '@sunbird/core';
import { _ } from 'lodash-es';
import { ProfileService } from '@sunbird/profile';
import { map,catchError } from 'rxjs/operators';
import { of, throwError, combineLatest } from 'rxjs';
import { UserSearchService } from './../../services';
import { IInteractEventObject,IInteractEventEdata } from '@sunbird/telemetry';
import { CslFrameworkService } from '../../../public/services/csl-framework/csl-framework.service';
import { UserFilterComponent } from './user-filter.component';

describe('UserFilterComponent', () => {
    let component: UserFilterComponent;

    const mockCdr :Partial<ChangeDetectorRef> ={
		detectChanges: jest.fn(),
	};
	const mockResourceService :Partial<ResourceService> ={
		messages: {
			emsg: {
			  m0005: 'error message'
			}
		}
	};
	const mockRouter :Partial<Router> ={
		navigate: jest.fn(),
	};
	const mockActivatedRoute :Partial<ActivatedRoute> ={};
	const mockUserService :Partial<UserService> ={
		userData$: of({userProfile: {
			userId: 'sample-uid',
			rootOrgId: 'sample-root-id',
			rootOrg: {},
			hashTagIds: ['id']
		} as any}) as any,
		userid: '123'
	};
	const mockToasterService :Partial<ToasterService> ={
		error: jest.fn()
	};
	const mockProfileService :Partial<ProfileService> ={
		getUserLocation: jest.fn(),
	};
	const mockOrgDetailsService :Partial<OrgDetailsService> ={
		fetchOrgs: jest.fn(),
	};
	const mockPermissionService :Partial<PermissionService> ={};
	const mockFrameworkService :Partial<FrameworkService> ={};
	const mockUserSearchService :Partial<UserSearchService> ={};
	const mockFormService :Partial<FormService> ={};
	const mockCslFrameworkService :Partial<CslFrameworkService> ={
		getAllFwCatName: jest.fn(),
	};

    beforeAll(() => {
        component = new UserFilterComponent(
            mockCdr as ChangeDetectorRef,
			mockResourceService as ResourceService,
			mockRouter as Router,
			mockActivatedRoute as ActivatedRoute,
			mockUserService as UserService,
			mockToasterService as ToasterService,
			mockProfileService as ProfileService,
			mockOrgDetailsService as OrgDetailsService,
			mockPermissionService as PermissionService,
			mockFrameworkService as FrameworkService,
			mockUserSearchService as UserSearchService,
			mockFormService as FormService,
			mockCslFrameworkService as CslFrameworkService
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
            
    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });

	it('should initialize frameworkCategoriesList on ngOnInit', () => {
		jest.spyOn(component.cslFrameworkService,'getAllFwCatName').mockReturnValue(['category1', 'category2']);
		component.ngOnInit();
		expect(component.frameworkCategoriesList).toEqual(['category1', 'category2']);
	});

    describe('resetFilters',()=>{
		it('should reset filters and navigate to parent route with empty query params', () => {
			component.resetFilters();
			expect(component.inputData).toEqual({});
			expect(component.queryParams).toEqual({});
			expect(mockRouter.navigate).toHaveBeenCalledWith([], { relativeTo: mockActivatedRoute.parent, queryParams: {} });
		});
	
		it('should reset selectedDistrict, selectedBlock, and selectedSchool', () => {
			component.resetFilters();
			expect(component.selectedDistrict).toEqual('');
			expect(component.selectedBlock).toEqual('');
			expect(component.selectedSchool).toEqual('');
		});
	
		it('should call getBlock with districtIds', () => {
			component.districtIds = ['mock-district'];
			jest.spyOn(component.profileService as any,'getUserLocation').mockReturnValue(of({}));
			jest.spyOn(component,'getBlock')
			component.resetFilters();
			expect(component.getBlock).toHaveBeenCalledWith(component.districtIds);
		});
	
		it('should call hardRefreshFilter method', () => {
			jest.spyOn(component.profileService as any,'getUserLocation').mockReturnValue(of({}));
			const refreshSpy = jest.spyOn(component as any, 'hardRefreshFilter');
			component.resetFilters();
			expect(refreshSpy).toHaveBeenCalled();
		});
	});	
    
	it('should update inputData and call settelemetryData', () => {
		const mockSetTelemetryData = jest.spyOn(component as any, 'settelemetryData');
		component.selectedValue('someValue', 'someCode');
	
		expect(component.inputData['someCode']).toBe('someValue');
		expect(mockSetTelemetryData).toHaveBeenCalled();
	});

	it('should update selected values and call getBlock method with districtId', () => {
		const mockSelectedValue = jest.spyOn(component as any, 'selectedValue');
		const mockGetBlock = jest.spyOn(component, 'getBlock');
		component.onDistrictChange('districtId123');
	
		expect(mockSelectedValue).toHaveBeenCalledWith(['districtId123'], 'District');
		expect(mockSelectedValue).toHaveBeenCalledWith('', 'Block');
		expect(mockSelectedValue).toHaveBeenCalledWith('', 'School');
		expect(mockGetBlock).toHaveBeenCalledWith(['districtId123']);
	});
    
	it('should update selected values and call getSchool method with blockId', () => {
		const mockSelectedValue = jest.spyOn(component as any, 'selectedValue');
		const mockGetSchool = jest.spyOn(component, 'getSchool');
		jest.spyOn(component.orgDetailsService as any,'fetchOrgs').mockReturnValue(of({}));
		component.onBlockChange('blockId123');
	
		expect(mockSelectedValue).toHaveBeenCalledWith(['blockId123'], 'Block');
		expect(mockSelectedValue).toHaveBeenCalledWith('', 'School');
		expect(mockGetSchool).toHaveBeenCalledWith(['blockId123']);
	});

	it('should call selectedValue method onschoolchange', () => {
		const mockSchoolId = 123;
		component.onSchoolChange(mockSchoolId);
		expect(component.selectedValue).toHaveBeenCalledWith([123],'School');
	});

	it('should sort object based on name property', () => {
		const inputObject = [
		  { name: 'Zebra' },
		  { name: 'Apple' },
		  { name: 'Banana' }
		];
		const expectedSortedObject = [
		  { name: 'Apple' },
		  { name: 'Banana' },
		  { name: 'Zebra' }
		];
		const sortedObject = component.sortFilters(inputObject);

		expect(sortedObject).toEqual(expectedSortedObject);
	});
	
	it('should sort and capitalize object based on name property', () => {
		const inputObject = [
		  { name: 'zebra' },
		  { name: 'apple' },
		  { name: 'banana' }
		];
		const expectedSortedAndCapitalizedObject = [
		  { name: 'Apple' },
		  { name: 'Banana' },
		  { name: 'Zebra' }
		];
		const sortedAndCapitalizedObject = component.sortAndCapitaliseFilters(inputObject);
	
		expect(sortedAndCapitalizedObject).toEqual(expectedSortedAndCapitalizedObject);
	});
    
	it('should set telemetry data correctly', () => { 
		const filters = {}
		component.settelemetryData();

		expect(component.resetInteractEdata).toEqual({
		  id: 'reset-user-filter',
		  type: 'click',
		  pageid: 'user-search'
		});
		expect(component.telemetryInteractObject).toEqual({
		  id: '123',
		  type: 'User',
		  ver: '1.0'
		});
	});

	it('should call onDistrictChange with district id', () => {
		const mockOnDistrictChange = jest.spyOn(component, 'onDistrictChange');
		const event = { value: { id: 'districtId123' } };
		component.districtSelected(event);
	
		expect(mockOnDistrictChange).toHaveBeenCalledWith('districtId123');
	});

	it('should call onBlockChange with block id', () => {
		const mockOnBlockChange = jest.spyOn(component, 'onBlockChange');
		const event = { value: { id: 'blockId123' } };
		component.blockSelected(event);
	
		expect(mockOnBlockChange).toHaveBeenCalledWith('blockId123');
	});

	it('should call onSchoolChange with school id', () => {
		const mockOnSchoolChange = jest.spyOn(component, 'onSchoolChange');
		const event = { value: { id: 'schoolId123' } };
		component.schoolSelected(event);
	
		expect(mockOnSchoolChange).toHaveBeenCalled();
	});

	it('should call selectedValue with correct parameters', () => {
		const mockSelectedValue = jest.spyOn(component as any, 'selectedValue');
		const roleSelected = { value: 'roleValue' };
		const code = 'roleCode';
	
		component.selectedMultiValues(roleSelected, code);
		expect(mockSelectedValue).toHaveBeenCalledWith('roleValue', 'roleCode');
	});

	it('should sort array of objects based on specified object key', () => {
		const arr = [
		  { id: 3, name: 'Zebra' },
		  { id: 1, name: 'Apple' },
		  { id: 2, name: 'Banana' }
		];
		const objKey = 'name';
		const expectedSortedArray = [
		  { id: 1, name: 'Apple' },
		  { id: 2, name: 'Banana' },
		  { id: 3, name: 'Zebra' }
		];
		const sortedArray = component.getSortedList(arr, objKey);

		expect(sortedArray).toEqual(expectedSortedArray);
	});

	it('should call profileService.getUserLocation with correct parameters', () => {
		component.stateId = 'stateId123';
		component.queryParams = { District: 'districtId123' };
		const mockResponse = {
		  result: {
			response: [{ id: 'districtId1', name: 'District 1' }, { id: 'districtId2', name: 'District 2' }]
		  }
		};
		jest.spyOn(component.profileService as any ,'getUserLocation').mockReturnValue(of(mockResponse));
		component.getDistrict().subscribe((result: string) => {
		  expect(mockProfileService.getUserLocation).toHaveBeenCalledWith({
			filters: { type: 'district', parentId: 'stateId123' }
		  });
		  expect(component.allDistricts).toEqual([
			{ id: 'districtId1', name: 'District 1' },
			{ id: 'districtId2', name: 'District 2' }
		  ]);
		  expect(component.districtIds).toEqual(['districtId1', 'districtId2']);
		  expect(component.selectedDistrict).toEqual('districtId123');
		  expect(result).toBe('District API success');
		});
	});

  describe('applyFilters', () => {
    it('should navigate with queryParams when inputData is not empty', () => {
      component.inputData = {
          key1: 'value1',
          key2: ['value2']
      };

      component.applyFilters();

      expect(mockRouter.navigate).toHaveBeenCalledWith([], { relativeTo: mockActivatedRoute.parent, queryParams: {
          key1: 'value1',
          key2: ['value2'],
          appliedFilters: true
      } });
    });

    it('should not navigate when inputData is empty', () => {
        component.inputData = {};

        component.applyFilters();

        expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  describe('subscribeToQueryParams', () => {
    it('should subscribe to queryParams and set inputData and queryParams', () => {
        const queryParams = { Usertype: 'administrator' };
        const mockActivatedRoute = {
            queryParams: of(queryParams)
        };
        component['activatedRoute'] = mockActivatedRoute as any;
        component['subscribeToQueryParams']();
        expect(component.queryParams).toEqual(queryParams);
        expect(component.inputData).toEqual({ Usertype: ['School head or officials'] });
    });

    it('should handle empty queryParams', () => {
        const queryParams = {};
        const mockActivatedRoute = {
            queryParams: of(queryParams)
        };
        component['activatedRoute'] = mockActivatedRoute as any;
        component['subscribeToQueryParams']();
        expect(component.queryParams).toEqual(queryParams);
        expect(component.inputData).toEqual({});
    });

  });

  describe('combineAllApis', () => {
    it('should call getUserType, getDistrict, getRoles, and getFormatedFilterDetails and set showFilters to true', () => {
        jest.spyOn(component, 'getUserType').mockReturnValue(of('User type API success'));
        jest.spyOn(component, 'getDistrict').mockReturnValue(of('District API success'));
        jest.spyOn(component, 'getRoles').mockReturnValue(of('Roles API success'));
        jest.spyOn(component, 'getFormatedFilterDetails' as any).mockReturnValue(of('Framework API success'));
        component.combineAllApis();
        expect(component.showFilters).toBe(true);
        expect(component.getUserType).toHaveBeenCalled();
        expect(component.getDistrict).toHaveBeenCalled();
        expect(component.getRoles).toHaveBeenCalled();
        expect(component['getFormatedFilterDetails']).toHaveBeenCalled();
    });
  });

});