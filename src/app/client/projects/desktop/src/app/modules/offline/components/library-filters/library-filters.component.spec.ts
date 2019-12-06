import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryFiltersComponent } from './library-filters.component';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import { TelemetryModule } from '@sunbird/telemetry';
import { SuiModule } from 'ng2-semantic-ui';
import { ResourceService, ConfigService, BrowserCacheTtlService, ToasterService } from '@sunbird/shared';
import { CacheService } from 'ng2-cache-service';
import { OrgDetailsService, TenantService, ChannelService } from '@sunbird/core';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { response } from './library-filters.component.spec.data';
import { of as observableOf } from 'rxjs';
import { OnboardingService } from '../../services';


describe('LibraryFiltersComponent', () => {
    let component: LibraryFiltersComponent;
    let fixture: ComponentFixture<LibraryFiltersComponent>;
    const resourceBundle = {
        'messages': {
            'stmsg': {
                'm0007': 'Search for something else',
                'm0006': 'No result'
            },
            'fmsg': {
                'm0077': 'Fetching search result failed',
                'm0051': 'Fetching other courses failed, please try again later...'
            }
        }
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LibraryFiltersComponent],
            imports: [CommonConsumptionModule, TelemetryModule.forRoot(), SuiModule, HttpClientModule, RouterModule.forRoot([])],
            providers: [
                { provide: ResourceService, useValue: resourceBundle },
                CacheService,
                ConfigService,
                OrgDetailsService,
                CacheService,
                BrowserCacheTtlService,
                TenantService,
                ToasterService,
                OnboardingService,
                ChannelService
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LibraryFiltersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should call ngOnInit', () => {
        const onboardingService = TestBed.get(OnboardingService);
        const orgDetailsService = TestBed.get(OrgDetailsService);
        onboardingService.userData = response.userData;
        spyOn(orgDetailsService, 'getCustodianOrg').and.returnValue(observableOf(response.cutodianOrgData));
        spyOn(component, 'setBoard');
        component.ngOnInit();
        expect(component.hashTagId).toEqual('01285019302823526477');
        expect(component.userDetails).toBeDefined();
        expect(component.setBoard).toHaveBeenCalled();
    });

    it('should call setBoard and call setfilters with false', () => {
        const channelService = TestBed.get(ChannelService);
        component.userDetails = response.userData;
        component.selectedFilters = { 'board': ['State Test 1'] };
        spyOn(channelService, 'getFrameWork').and.returnValue(observableOf(response.channelData));
        spyOn(component.frameworkService, 'getFrameworkCategories').and.returnValue(observableOf(response.frameWorkData));
        spyOn(component, 'setFilters');
        component.setBoard();
        expect(component.boards).toEqual(response.channelData.result.channel.frameworks);
        expect(component.frameworkCategories).toEqual(response.frameWorkData.result.framework.categories);
        expect(component.setFilters).toHaveBeenCalledWith(false);
    });

    it('should call setBoard and call setfilters with true', () => {
        const channelService = TestBed.get(ChannelService);
        component.userDetails = response.userData;
        component.selectedFilters = { 'board': [] };
        spyOn(channelService, 'getFrameWork').and.returnValue(observableOf(response.channelData));
        spyOn(component.frameworkService, 'getFrameworkCategories').and.returnValue(observableOf(response.frameWorkData));
        spyOn(component, 'setFilters');
        component.setBoard();
        expect(component.setFilters).toHaveBeenCalledWith(true);
    });

    it('should call setFilters', () => {
        component.userDetails = response.userData;
        component.selectedFilters = { 'medium': ['English'], 'gradeLevel': ['Class 5']};
        spyOn(component, 'resetFilters');
        spyOn(component, 'triggerFilterChangeEvent');
        component.frameworkCategories = response.frameWorkData.result.framework.categories;
        component.setFilters();
        expect(component.resetFilters).toHaveBeenCalled();
        expect(component.mediums).toBeDefined();
        expect(component.classes).toBeDefined();
        expect(component.triggerFilterChangeEvent).toHaveBeenCalledWith();
    });

    it('should call setFilters with true', () => {
        component.userDetails = response.userData;
        spyOn(component, 'resetFilters');
        spyOn(component, 'triggerFilterChangeEvent');
        component.frameworkCategories = response.frameWorkData.result.framework.categories;
        component.setFilters(true);
        expect(component.resetFilters).toHaveBeenCalled();
        expect(component.mediums).toBeDefined();
        expect(component.classes).toBeDefined();
        expect(component.triggerFilterChangeEvent).toHaveBeenCalledWith();
    });

    it('should call onBoardChange', () => {
        spyOn(component.frameworkService, 'getFrameworkCategories').and.returnValue(observableOf(response.frameWorkData));
        spyOn(component, 'setFilters');
        spyOn(component, 'resetFilters');
        component.onBoardChange(response.selectedBoard);
        expect(component.frameworkCategories).toEqual(response.frameWorkData.result.framework.categories);
        expect(component.resetFilters).toHaveBeenCalled();
        expect(component.setFilters).toHaveBeenCalledWith(false);
    });

    it('should call resetFilters', () => {
        component.resetFilters();
        expect(component.mediums).toEqual([]);
        expect(component.classes).toEqual([]);
        expect(component.selectedClassIndex).toEqual([]);
        expect(component.selectedMediumIndex).toEqual([]);
    });

    it('should call applyFilters with event - medium', () => {
        spyOn(component, 'getSelectedFilters');
        const event = { 'event': { 'isTrusted': true }, 'data': { 'text': 'Kannada', 'selected': true, 'index': 1 } };
        component.applyFilters(event, 'medium');
        expect(component.getSelectedFilters).toHaveBeenCalled();
        expect(component.selectedClassIndex).toEqual([]);
        expect(component.selectedMediumIndex).toEqual([1]);
    });

    it('should call applyFilters with event - class', () => {
        spyOn(component, 'getSelectedFilters');
        const event = { 'event': { 'isTrusted': true }, 'data': { 'text': 'Class 4', 'selected': true, 'index': 0 } };
        component.applyFilters(event, 'class');
        expect(component.getSelectedFilters).toHaveBeenCalled();
        expect(component.selectedClassIndex).toEqual([0]);
    });

    it('should call getSelectedFilters when medium changed', () => {
        component.selectedBoard = {
            'identifier': 'ka_k-12', 'name': 'State Test 1',
            'objectType': 'Framework', 'relation': 'hasSequenceMember', 'description': 'State Test 1', 'index': 13, 'status': 'Live'
        };
        component.selectedMediumIndex = [1];
        component.selectedClassIndex = [];
        component.mediums = ['English', 'Kannada'];
        component.classes = ['Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];
        const result = component.getSelectedFilters();
        expect(result).toEqual({ 'board': ['State Test 1'], 'appliedFilters': true, 'medium': ['Kannada'] });
    });

    it('should call getSelectedFilters when class changed', () => {
        component.selectedBoard = {
            'identifier': 'ka_k-12', 'name': 'State Test 1',
            'objectType': 'Framework', 'relation': 'hasSequenceMember', 'description': 'State Test 1', 'index': 13, 'status': 'Live'
        };
        component.selectedMediumIndex = [1];
        component.selectedClassIndex = [3];
        component.mediums = ['English', 'Kannada'];
        component.classes = ['Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];
        const result = component.getSelectedFilters();
        expect(result).toEqual({
            'board': ['State Test 1'], 'appliedFilters': true,
            'medium': ['Kannada'], 'gradeLevel': ['Class 7']
        });
    });

    it('should call triggerFilterChangeEvent and emit event', () => {
        component.hashTagId = '01285019302823526477';
        component.selectedBoard = {
            'identifier': 'ka_k-12', 'name': 'State Test 1',
            'objectType': 'Framework', 'relation': 'hasSequenceMember', 'description': 'State Test 1', 'index': 13, 'status': 'Live'
        };
        component.selectedMediumIndex = [1];
        component.selectedClassIndex = [3];
        component.mediums = ['English', 'Kannada'];
        component.classes = ['Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];
        spyOn(component, 'getSelectedFilters');
        spyOn(component.filterChange, 'emit');
        component.triggerFilterChangeEvent();
        expect(component.filterChange.emit).toHaveBeenCalledWith({
            'filters': undefined, 'channelId': '01285019302823526477'
        });

    });
});
