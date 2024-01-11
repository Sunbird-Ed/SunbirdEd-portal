import { Location } from '@angular/common';
import { IImpressionEventInput,TelemetryService } from '@sunbird/telemetry';
import { SearchService } from '@sunbird/core';
import { Component,OnInit } from '@angular/core';
import { ResourceService,ToasterService,NavigationHelperService } from '@sunbird/shared';
import { Router,ActivatedRoute } from '@angular/router';
import { _ } from 'lodash-es';
import { ExploreCurriculumCoursesComponent } from './explore-curriculum-courses.component';
import { of } from 'rxjs';

describe('ExploreCurriculumCoursesComponent', () => {
    let component: ExploreCurriculumCoursesComponent;

    const mockSearchService :Partial<SearchService> ={
        subjectThemeAndCourse: {
            contents: [
              { identifier: 'course1', contentType: 'course', pkgVersion: '1.0' },
              { identifier: 'course2', contentType: 'course', pkgVersion: '1.0' }
            ]
        }
    };
	const mockToasterService :Partial<ToasterService> ={
        error: jest.fn(),
    };
	const mockResourceService :Partial<ResourceService> ={
        frmelmnts: {
            lbl: {
              fetchingContentFailed: 'Fetching content failed'
            }
        }
    };
	const mockActivatedRoute :Partial<ActivatedRoute> ={
        snapshot: {
            data: {
                telemetry: { env: 'mock-env', pageid: 'mock-pageid', type: 'mock-type' }
            },
            queryParams: {
                title: 'mock-title'
            }
        } as any
    };
	const mockRouter :Partial<Router> ={
        navigate: jest.fn(),
    };
	const mockNavigationhelperService :Partial<NavigationHelperService> ={
        getPageLoadTime: jest.fn().mockReturnValue('1ms'),
    };
	const mockTelemetryService :Partial<TelemetryService> ={
        interact: jest.fn(),
    };
	const mockLocation :Partial<Location> ={
        back: jest.fn(),
    };

    beforeAll(() => {
        component = new ExploreCurriculumCoursesComponent(
            mockSearchService as SearchService,
			mockToasterService as ToasterService,
			mockResourceService as ResourceService,
			mockActivatedRoute as ActivatedRoute,
			mockRouter as Router,
			mockNavigationhelperService as NavigationHelperService,
			mockTelemetryService as TelemetryService,
			mockLocation as Location
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
            
    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });
    
    describe("ngOnInit",()=>{
        it('should initialize component properties on ngOnInit', () => {
            const setTelemetryImpressionSpy = jest.spyOn(component,'setTelemetryImpression');
            component.ngOnInit();
            const contents = [
                { identifier: 'course1', contentType: 'course', pkgVersion: '1.0' },
                { identifier: 'course2', contentType: 'course', pkgVersion: '1.0' }
            ]
            expect(component.title).toEqual('mock-title');
            expect(component.courseList).toEqual(contents);
            expect(component.selectedCourse).toEqual({});
            expect(setTelemetryImpressionSpy).toHaveBeenCalled();
        });
        
        it('should handle error and navigate back if course list is empty', () => {
            mockSearchService.subjectThemeAndCourse = {};
            component.ngOnInit();
        
            expect(mockToasterService.error).toHaveBeenCalledWith('Fetching content failed');
            expect(mockLocation.back).toHaveBeenCalled();
        });
    });

    it('should navigate to course', () => {
        const event = { data: { identifier: 'course1' } };
        component.navigateToCourse(event);

        expect(mockRouter.navigate).toHaveBeenCalledWith(['explore-course/course', 'course1']);
    });
    
    it('should go back', () => {
        component.goBack();
        expect(mockLocation.back).toHaveBeenCalled();
    });
    
    it('should get interact data', () => {
        const event = { data: { identifier: 'mock-course1', contentType: 'course', pkgVersion: '1.0' } };
        component.getInteractData(event);
    
        expect(mockTelemetryService.interact).toHaveBeenCalledWith({
          context: { cdata: [], env: 'mock-env' },
          edata: { id: 'mock-course1', type: 'click', pageid: 'mock-pageid' },
          object: { id: 'mock-course1', type: 'course', ver: '1.0'}
        });
    });
    
});