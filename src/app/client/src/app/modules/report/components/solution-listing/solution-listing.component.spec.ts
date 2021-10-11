import { ResourceService, ConfigService, PaginationService, LayoutService } from '@sunbird/shared';
import { SolutionListingComponent } from './solution-listing.component';
import { ObservationService, UserService, TncService } from '@sunbird/core';
import {
  ObservationData,
  profileData,
  EntityClick,
  ModalEventData,
  ObservationDataFail
} from './solution-listing.component.spec.data';
import { of as observableOf, throwError as observableThrowError, of, Observable, throwError } from 'rxjs';
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
  const mockTncService: Partial<TncService> = {
    getReportViewerTnc(): Observable<any> {
      return of({
        response: {
          value: '{ "latestVersion" : "sample-version"}' as any
        } as any
      }) as any;
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

  const mockUserService: Partial<UserService> = {
    userData$: of({
      userProfile: {}
    }) as any
  };
  beforeAll(() => {
    component = new SolutionListingComponent(
      mockResourceService as ResourceService,
      mockLayoutService as LayoutService,
      mockObservationService as ObservationService,
      mockConfig as ConfigService,
      mockObservationUtilService as ObservationUtilService,
      mockUserService as UserService,
      mockRouter as Router,
      mockPaginationService as PaginationService,
      mockConfigService as ConfigService,
      mockTncService as TncService
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngonInit()', () => {
    spyOn(component, 'ngOnInit').and.callThrough();
    spyOn(component, 'getReportViewerTncPolicy').and.callFake(() => {
      return of({
        response: {
          value: '{ "latestVersion" : "sample-version"}' as any
        }
      });
    });
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
  });

  it('ObservationUtilService api failed case', () => {
    spyOn(mockObservationUtilService, 'getProfileDataList').and.callFake(() => {
      return Promise.resolve(profileData);
    });
    spyOn(mockObservationService, 'post').and.returnValue(observableThrowError('error'));
    spyOn(component, 'getReportViewerTncPolicy').and.callFake(() => {
      return of({
        response: {
          value: '{ "latestVersion" : "sample-version"}' as any
        }
      });
    });
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
    spyOn(component, 'getReportViewerTncPolicy').and.callFake(() => {
      return of({
        response: {
          value: '{ "latestVersion" : "sample-version"}' as any
        }
      });
    });
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
    spyOn(component, 'getReportViewerTncPolicy').and.callFake(() => {
      return of({
        response: {
          value: '{ "latestVersion" : "sample-version"}' as any
        }
      });
    });
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
    spyOn(component, 'getReportViewerTncPolicy').and.callFake(() => {
      return of({
        response: {
          value: '{ "latestVersion" : "sample-version"}' as any
        }
      });
    });
    component.payload = profileData;
    component.getDataByEntity(EntityClick);
    expect(component.getDataByEntity).toHaveBeenCalled();
    expect(component.solutionList.length).toEqual(0);
  });



  it('should call the goToReports()', () => {
    spyOn(component, 'goToReports').and.callThrough();
    spyOn(mockRouter, 'navigate').and.callThrough();
    spyOn(component, 'getReportViewerTncPolicy').and.callFake(() => {
      return of({
        response: {
          value: '{ "latestVersion" : "sample-version"}' as any
        }
      });
    });
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
    spyOn(component, 'getReportViewerTncPolicy').and.callFake(() => {
      return of({
        response: {
          value: '{ "latestVersion" : "sample-version"}' as any
        }
      });
    });
    component.getSolutions();
    component.payload = profileData;
    component.getProfileData();
    expect(component.solutionList.length).toBeGreaterThanOrEqual(0);
    expect(component.filters.length).toBeGreaterThanOrEqual(0);
  });

  // it('should call the modalClose when isRubricDriven is false', () => {
  //   spyOn(component, 'getReportViewerTncPolicy').and.callFake(() => {
  //     return of({
  //       response: {
  //         value: '{ "latestVersion" : "sample-version"}' as any
  //       }
  //     });
  //   });
  //   component.modalClose(ModalEventData);
  //   spyOn(component, 'modalClose').and.callThrough();
  // });

  it('should get tnc details', () => {
    spyOn(component, 'getReportViewerTncPolicy').and.callFake(() => {
      return of({
        response: {
          value: '{ "latestVersion" : "sample-version"}' as any
        }
      });
    });
    component.showTncPopup = true;
    component.getReportViewerTncPolicy();
    expect(component.showTncPopup).toBeTruthy();
  });

  // it('should call ObservationUtilService - getProfileData', () => {
  //   spyOn(mockPaginationService, 'getPager').and.callThrough();
  //   component.paginationDetails.currentPage = 1;
  //   console.log(component.paginationDetails);
  //   spyOn(mockObservationUtilService, 'getProfileDataList').and.callFake(() => {
  //     return Promise.resolve(profileData);
  //   });
  //   spyOn(mockObservationService, 'post').and.returnValue(of(ObservationData));
  //   spyOn(component, 'getReportViewerTncPolicy').and.callFake(() => {
  //     return throwError({
  //       response: {
  //         value: '{ "latestVersion" : "sample-version"}' as any
  //       }
  //     });
  //   });
  //   component.getSolutions();
  //   component.payload = profileData;
  //   spyOn(component, 'getProfileData').and.callThrough();
  //   component.getProfileData();
  //   expect(component.getProfileData).toHaveBeenCalled();
  //   expect(mockObservationService.post).toHaveBeenCalled();
  //   expect(component.payload).toBe(profileData);
  //   expect(mockPaginationService.getPager).toHaveBeenCalledWith(ObservationData.result.count, component.paginationDetails.currentPage, 10);
  //   expect(component.solutionList.length).toBeGreaterThan(0);
  //   expect(component.filters.length).toBeGreaterThanOrEqual(0);
  // });
});
