import { ActivatedRoute } from '@angular/router';
import { ResourceService, ConfigService, ICaraouselData } from '@sunbird/shared';
import { Component, Input, EventEmitter, Output, OnDestroy, ChangeDetectorRef, OnChanges, OnInit } from '@angular/core';
import * as _ from 'lodash-es';
import { IInteractEventEdata } from '@sunbird/telemetry';
import { of } from 'rxjs';
import { Response } from './page-section.component.spec.data';
import { PageSectionComponent } from './page-section.component'
import { compilePipeFromMetadata } from '@angular/compiler';
import { CslFrameworkService } from '../../../public/services/csl-framework/csl-framework.service';

describe('PageSectionComponent', () => {
  let component: PageSectionComponent;
  const mockConfigService: Partial<ConfigService> = {
    appConfig: {
      CourseBatchPageSection: {
        slideConfig: Response.slideConfig
      },
      CoursePageSection: {
        slideConfig: {
          "variableWidth": true,
          "centerPadding": "16px",
          "infinite": false,
          "rtl": false
        },
      }

    }
  };
  const mockActivatedRoute: Partial<ActivatedRoute> = {
    queryParams: of({})
  };
  const mockResourceService: Partial<ResourceService> = {
    frmelmnts:{lbl:{mytrainings:'My courses'}}
  };
  const mockChangeDetectionRef: Partial<ChangeDetectorRef> = {
    detectChanges: jest.fn()
  };
  const mockCslFrameworkService: Partial<CslFrameworkService> = {
    getFrameworkCategories: jest.fn(),
    setDefaultFWforCsl: jest.fn(),
    transformDataForCC: jest.fn()
  };
  beforeAll(() => {
    component = new PageSectionComponent(
      mockConfigService as ConfigService,
      mockActivatedRoute as ActivatedRoute,
      mockResourceService as ResourceService,
      mockCslFrameworkService as CslFrameworkService,
      mockChangeDetectionRef as ChangeDetectorRef,
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should be create a instance of PageSectionComponent', () => {
    expect(component).toBeTruthy();
  });
  it ('should call selectedLanguageTranslation()', () => {
    jest.spyOn(component, 'updateSlick');
    jest.spyOn(mockChangeDetectionRef, 'detectChanges');
    component.section=Response.successData;
    const obj = 'ur'
    component.slideConfig['rtl'] =false;
    component.selectedLanguageTranslation(obj);
    expect(component.slideConfig['rtl']).toBeTruthy();
  });
  it ('should call selectedLanguageTranslation() with language ur', () => {
    jest.spyOn(component, 'updateSlick');
    jest.spyOn(mockChangeDetectionRef, 'detectChanges');
    component.section=Response.successData;
    const obj = 'ur'
    component.slideConfig['rtl'] =false;
    component.selectedLanguageTranslation(obj);
    expect(component.slideConfig['rtl']).toBeTruthy();
  });
  it ('should call selectedLanguageTranslation() with language en', () => {
    jest.spyOn(component, 'updateSlick');
    jest.spyOn(mockChangeDetectionRef, 'detectChanges');
    component.section=Response.successData;
    const obj = 'en'
    component.slideConfig['rtl'] =true;
    component.selectedLanguageTranslation(obj);
    expect(component.slideConfig['rtl']).toBeFalsy();
  });

  it('should call the playContent method', () => {
    component.playEvent = new EventEmitter<void>();
    jest.spyOn(component.playEvent, 'emit') as any;
    component.playContent({ event: true });
    expect(component.playEvent.emit).toBeCalled()
  });
  it('should call selectedLanguageTranslation', () => {
    jest.spyOn(component, 'updateSlick');
    jest.spyOn(component, 'selectedLanguageTranslation');
    mockResourceService.languageSelected$ = of({
      language: 'en'
    });
    component.cardType = 'batch';
    component.pageid = 'course';
    component.section = { name: 'Section 1', length: 0, contents: [] };
    component.ngOnInit();
    expect(component.updateSlick).toHaveBeenCalled();
  });

  it ('should call updateSlick on reInitSlick', () => {
    jest.spyOn(component, 'updateSlick');
    jest.spyOn(mockChangeDetectionRef, 'detectChanges');
    component.reInitSlick();
    expect(component.updateSlick).toHaveBeenCalled();
    expect(component.contentList.length).toEqual(0);
    expect(component.maxSlide).toEqual(0);
    expect(component.refresh).toBeTruthy();
    expect(mockChangeDetectionRef.detectChanges).toHaveBeenCalled();
  });

  it ('should emit view all', () => {
    jest.spyOn(component.viewAll, 'emit');
    component.navigateToViewAll({});
    expect(component.viewAll.emit).toHaveBeenCalledWith({});
  });
  it ('should call updateContentViewed()', () => {
    component.contentList = Response.slideContentList;
    jest.spyOn(component.visits, 'emit');
    component.updateContentViewed();
    expect(component.visits.emit).toHaveBeenCalled();
  });
  it ('should call updateContentViewed()', () => {
    jest.spyOn(component, 'updateContentViewed');
    component.ngOnDestroy();
    expect(component.updateContentViewed).toHaveBeenCalled();
  });
  it ('should call ngOnChanges()', () => {
    jest.spyOn(component, 'reInitSlick');
    component.ngOnChanges();
    expect(component.reInitSlick).toHaveBeenCalled();
  });
  it ('should call handleAfterChange()', () => {
    jest.spyOn(component, 'updateSlick');
    component.maxSlide = 2;
    component.handleAfterChange({currentSlide:10});
    expect(component.updateSlick).toHaveBeenCalled();
  });
  it ('should call getObjectRollup()', () => {
    const obj = Response.slideContentList[0]
    const response = component.getObjectRollup(obj);
   expect(response).toEqual({ l1: 'do_112490751857254400131' });
  });


});