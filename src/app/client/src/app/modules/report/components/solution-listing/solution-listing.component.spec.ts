import { ResourceService, ConfigService, PaginationService, LayoutService, ReportViewerTncService } from '@sunbird/shared';
import { SolutionListingComponent } from './solution-listing.component';
import { ObservationService, UserService } from '@sunbird/core';
import {
  ObservationData,
  profileData,
  EntityClick,
  ModalEventData,
  ObservationDataFail
} from './solution-listing.component.spec.data';
import { of as observableOf, throwError as observableThrowError, of, Observable } from 'rxjs';
import { ObservationUtilService } from '../../../observation/service';
import { Router } from '@angular/router';

describe('SolutionListingComponent', () => {
  let component: SolutionListingComponent;

  const mockConfigService: Partial<ConfigService> = {};
  const mockConfig: Partial<ConfigService> = {
    urlConFig: {
      URLS: {
        OBSERVATION: {
          OBSERVATION_REPORT_SOLUTION_LIST: 'v1/observationSubmissions/solutionList?'
        }
      }
    }
  };
  const mockLayoutService: Partial<LayoutService> = {
    initlayoutConfig(): any {
      return { value: 'v' };
    },
    switchableLayout(): Observable<any> {
      return of({ layout: 'l1' });
    }
  };
  const mockObservationService: Partial<ObservationService> = {
    post(): Observable<any> {
      return of(ObservationData);
    }
  };
  const mockPaginationService: Partial<PaginationService> = {
    getPager(): any {
      return { currentPage: 1, totalPage: 4 };
    }
  };
  const mockReportViewerTncService: Partial<ReportViewerTncService> = {
    getReportViewerTncPolicy(): Promise<any> {
      return Promise.resolve({
        version: 'sample-version',
        url: 'sample-url',
        showTncPopup: true
      });
    }
  };
  const mockResourceService: Partial<ResourceService> = {};
  const mockRouter: Partial<Router> = {
    navigate(): any {
      return true;
    }
  };
  const mockObservationUtilService: Partial<ObservationUtilService> = {
    getProfileDataList(): Promise<any> {
      return Promise.resolve(profileData);
    }
  };

  beforeAll(() => {
    component = new SolutionListingComponent(
      mockResourceService as ResourceService,
      mockLayoutService as LayoutService,
      mockObservationService as ObservationService,
      mockConfig as ConfigService,
      mockObservationUtilService as ObservationUtilService,
      mockRouter as Router,
      mockPaginationService as PaginationService,
      mockConfigService as ConfigService,
      mockReportViewerTncService as ReportViewerTncService
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngonInit()', () => {
    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
  });


  it('should call ObservationUtilService - getProfileData', () => {
    spyOn(mockPaginationService, 'getPager').and.callThrough();
    component.paginationDetails.currentPage = 1;
    console.log(component.paginationDetails);
    spyOn(mockObservationUtilService, 'getProfileDataList').and.callFake(() => {
      return Promise.resolve(profileData);
    });
    spyOn(mockObservationService, 'post').and.returnValue(of(ObservationData));
    component.getSolutions();
    component.payload = profileData;
    spyOn(component, 'getProfileData').and.callThrough();
    component.getProfileData();
    expect(component.getProfileData).toHaveBeenCalled();
    expect(mockObservationService.post).toHaveBeenCalled();
    expect(component.payload).toBe(profileData);
    expect(mockPaginationService.getPager).toHaveBeenCalledWith(ObservationData.result.count, component.paginationDetails.currentPage, 10);
    expect(component.solutionList.length).toBeGreaterThan(0);
    expect(component.filters.length).toBeGreaterThanOrEqual(0);
  });

  it('ObservationUtilService api failed case', () => {
    spyOn(mockObservationUtilService, 'getProfileDataList').and.callFake(() => {
      return Promise.resolve(profileData);
    });
    spyOn(mockObservationService, 'post').and.returnValue(observableThrowError('error'));
    component.getSolutions();
    component.payload = profileData;
    spyOn(component, 'getProfileData').and.callThrough();
    component.getProfileData();
    expect(component.getProfileData).toHaveBeenCalled();
    expect(component.payload).toBe(profileData);
  });

  it('ObservationUtilService return result is empty', () => {
    spyOn(mockObservationUtilService, 'getProfileDataList').and.callFake(() => {
      return Promise.resolve(profileData);
    });
    spyOn(mockObservationService, 'post').and.returnValue(of(ObservationDataFail));
    component.getSolutions();
    component.payload = profileData;
    spyOn(component, 'getProfileData').and.callThrough();
    component.getProfileData();
    expect(component.getProfileData).toHaveBeenCalled();
    expect(component.payload).toBe(profileData);
  });


  it('should call the getDataByEntity() has data', () => {
    component.pageNo = 1;
    component.solutionList = [];
    spyOn(component, 'getDataByEntity').and.callThrough();
    spyOn(mockObservationUtilService, 'getProfileDataList').and.callFake(() => {
      return Promise.resolve(profileData);
    });
    spyOn(mockObservationService, 'post').and.returnValue(of(ObservationData));
    component.payload = profileData;
    component.getProfileData();
    component.getDataByEntity(EntityClick);
    expect(component.getDataByEntity).toHaveBeenCalled();
    expect(component.solutionList.length).toBeGreaterThanOrEqual(0);
    expect(component.filters.length).toBeGreaterThanOrEqual(0);
  });

  it('getDataByEntity() api fail case', () => {
    component.pageNo = 1;
    component.solutionList = [];
    spyOn(component, 'getDataByEntity').and.callThrough();
    spyOn(mockObservationUtilService, 'getProfileDataList').and.callFake(() => {
      return Promise.resolve(profileData);
    });
    spyOn(mockObservationService, 'post').and.returnValue(observableThrowError('error'));
    component.payload = profileData;
    component.getDataByEntity(EntityClick);
    expect(component.getDataByEntity).toHaveBeenCalled();
    expect(component.solutionList.length).toEqual(0);
  });



  it('should call the goToReports()', () => {
    spyOn(component, 'goToReports').and.callThrough();
    spyOn(mockRouter, 'navigate').and.callThrough();
    component.goToReports(ObservationData.result.data[0]);
    expect(component.goToReports).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalled();
  });

  it('should call the navigateToPage for pagination', () => {
    component.navigateToPage(1);
    spyOn(mockObservationUtilService, 'getProfileDataList').and.callFake(() => {
      return Promise.resolve(profileData);
    });
    spyOn(mockObservationService, 'post').and.returnValue(of(ObservationData));
    component.getSolutions();
    component.payload = profileData;
    component.getProfileData();
    expect(component.solutionList.length).toBeGreaterThanOrEqual(0);
    expect(component.filters.length).toBeGreaterThanOrEqual(0);
  });

  it('should call the modalClose when isRubricDriven is false', () => {
    component.modalClose(ModalEventData);
    spyOn(component, 'modalClose').and.callThrough();
  });

  it('should call the modalClose when isRubricDriven is true', () => {
    ModalEventData.value.solutionDetail.isRubricDriven = true;
    component.modalClose(ModalEventData);
    spyOn(component, 'modalClose').and.callThrough();
  });

  it('should call the goToEntityList to open modal', () => {
    spyOn(component, 'goToEntityList').and.callThrough();
    component.goToEntityList(ObservationData.result[0]);
    expect(component.goToEntityList).toHaveBeenCalled();
  });

  it('should get tnc details', () => {
    component.showTncPopup = true;
    component.getReportViewerTncPolicy();
    expect(component.showTncPopup).toBeTruthy();
  });

});
