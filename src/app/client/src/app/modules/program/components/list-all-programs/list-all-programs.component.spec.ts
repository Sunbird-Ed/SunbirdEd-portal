import { TelemetryModule } from '@sunbird/telemetry';
import { CoreModule, PublicDataService, ProgramsService } from '@sunbird/core';
import { SharedModule, ResourceService, NavigationHelperService } from '@sunbird/shared';
import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';

import { ListAllProgramsComponent } from './list-all-programs.component';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { mockData } from './list-all-programs.spec.data';
import { ActivatedRoute } from '@angular/router';

const activatedRouterStub = {
  snapshot: {
    data: {
      telemetry: { env: 'contribute', pageid: 'programs-list', type: 'view', subtype: 'paginate' }
    }
  }
};

describe('ListAllProgramsComponent', () => {
  let component: ListAllProgramsComponent;
  let fixture: ComponentFixture<ListAllProgramsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule.forRoot(), CoreModule, TelemetryModule.forRoot(), RouterTestingModule],
      declarations: [ListAllProgramsComponent],
      providers: [PublicDataService, ResourceService, ProgramsService,
        { provide: ActivatedRoute, useValue: activatedRouterStub }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAllProgramsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getOrgDetails function', () => {
    it('should return org Details when rootOrgId is passed', () => {
      const publicDataService = TestBed.get(PublicDataService);
      spyOn(publicDataService, 'post').and.returnValue(of(mockData.mockOrgSearchApiResponse));
      component['getOrgDetails']('ORG_001').subscribe(apiResponse => {
        expect(publicDataService['post']).toHaveBeenCalled();
        expect(publicDataService['post']).toHaveBeenCalledWith({
          'url': 'org/v1/search',
          'data': {
            'request': {
              'filters': {
                'id': [
                  'ORG_001'
                ]
              }
            }
          }
        });
        expect(apiResponse).toBe(mockData.mockOrgSearchApiResponse);
      });
    });
  });

  describe('getProgramsList function', (() => {
    it('should return the list of programs', () => {
      const programService = TestBed.get(ProgramsService);
      programService['_programsList$'].next(mockData.mockProgramsList);
      spyOn<any>(component, 'getOrgDetails').and.returnValue(of(mockData.mockOrgSearchApiResponse));
      spyOn<any>(component, 'getRootOrgName').and.callThrough();
      component['getProgramsList']().subscribe(res => {
        expect(component['getRootOrgName']).toHaveBeenCalled();
        expect(component['getRootOrgName']).toHaveBeenCalledTimes(1);
        expect(component['getRootOrgName']).toHaveBeenCalledWith('ORG_002');
        expect(component['getOrgDetails']).toHaveBeenCalled();
        expect(component['getOrgDetails']).toHaveBeenCalledTimes(1);
        expect(component['getOrgDetails']).toHaveBeenCalledWith('ORG_002');
        expect(res.length).toBe(2);
      });
    });
  }));

  describe('getRootOrgName function', () => {

    it('should return rootOrgName', () => {
      spyOn<any>(component, 'getOrgDetails').and.returnValue(of(mockData.mockOrgSearchApiResponse));
      component['getRootOrgName']('ORG_001').subscribe(res => {
        expect(res).toBeDefined();
        expect(res).toBe(mockData.mockOrgSearchApiResponse.result.response.content[0].orgName);
      });
    });

    it('should return empty string as rootOrg name if error occurs', () => {
      spyOn<any>(component, 'getOrgDetails').and.returnValue(throwError(mockData.mockOrgSearchApiResponse));
      component['getRootOrgName']('ORG_001').subscribe(res => {
        expect(res).toBeDefined();
        expect(res).toBe('');
      });
    });
  });

  describe('telemetry', () => {

    it('impression event should be', inject([NavigationHelperService], fakeAsync((navigationHelperService) => {
      spyOn(navigationHelperService, 'getPageLoadTime').and.returnValue(0.23);
      component.ngAfterViewInit();
      tick(100);
      expect(component.telemetryImpression).toBeDefined();
      expect(component.telemetryImpression).toEqual({
        context: { env: 'contribute' },
        edata: { type: 'view', pageid: 'programs-list', uri: '/', subtype: 'paginate', duration: 0.23 }
      });
    })));

    it('getTelemetryInteractEdata function should return telemetry interactEdata ', () => {
      const obj = component.getTelemetryInteractEdata('program-card');
      expect(obj).toBeDefined();
      expect(obj).toEqual({
        id: 'program-card',
        type: 'click',
        pageid: 'programs-list'
      });
    });

    it('getTelemetryInteractObject function should return telemetry interactEdata  object', () => {
      const obj = component.getTelemetryInteractObject('4234234');
      expect(obj).toBeDefined();
      expect(obj).toEqual({
        id: '4234234',
        type: 'Program',
        ver: '1.0'
      });
    });
  });

  describe('getFeatureId method', () => {

    it('should return the feature id', () => {
      const result = component.getFeatureId('user:program:contribute', 'SB-15591');
      expect(result).toEqual([{ id: 'user:program:contribute', type: 'Feature' }, { id: 'SB-15591', type: 'Task' }]);
    });
  });

});
