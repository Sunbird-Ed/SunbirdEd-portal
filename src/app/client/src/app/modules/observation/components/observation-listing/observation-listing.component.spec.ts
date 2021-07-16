import { ObservationListingComponent } from './observation-listing.component';
import { BehaviorSubject, throwError, of } from 'rxjs';
import {
  async,
  ComponentFixture,
  TestBed,
  tick,
  fakeAsync,
  flush,
} from '@angular/core/testing';
import {
  ResourceService,
  ToasterService,
  SharedModule,
  UtilService,
} from '@sunbird/shared';
import {
  SearchService,
  OrgDetailsService,
  CoreModule,
  UserService,
  SchemaService,
  KendraService,
} from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SuiModule } from 'ng2-semantic-ui-v9';
import * as _ from 'lodash-es';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Response, EventData } from './observation-listing.component.spec.data';
import { ActivatedRoute, Router } from '@angular/router';
import { TelemetryModule } from '@sunbird/telemetry';
import { configureTestSuite } from '@sunbird/test-util';
import { ObservationUtilService } from '../../service';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

describe('ObservationListingComponent', () => {
  let component: ObservationListingComponent;
  let fixture: ComponentFixture<ObservationListingComponent>;
  let toasterService,
    schemaService,
    observationUtilService,
    kendraService,
    location;
    class RouterStub {
      navigate = jasmine.createSpy('navigate');
      url = jasmine.createSpy('url');
    }
  const mockSearchData: any = Response.successData;
  const mockEventData: any = EventData;
  class FakeActivatedRoute {
    queryParamsMock = new BehaviorSubject<any>({ subject: ['English'] });
    paramsMock = new BehaviorSubject<any>({ pageNumber: '1' });
    get params() {
      return this.paramsMock.asObservable();
    }
    get queryParams() {
      return this.queryParamsMock.asObservable();
    }
    snapshot = {
      params: { key: '' },
      data: {
        telemetry: {
          env: 'observation',
          pageid: 'observation/details',
          type: 'view',
          subtype: 'paginate',
        },
      },
    };
  }
  let showEditUserDetailsPopup: any = true;
  const sendContentResult = true;
  let payload = {};
  let returnData: any;
  const resourceBundle = {
    frmelmnts: {
      lbl: {
        observation: 'Observation',
      },
      alert: {
        updateprofiletitle: 'update Title',
        updateprofilecontent: 'Please update profile'
      },
      btn: {
        update: 'Update'
      }
    },
    languageSelected$: of({}),
  };
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule.forRoot(),
        CoreModule,
        HttpClientTestingModule,
        SuiModule,
        TelemetryModule.forRoot(),
        RouterTestingModule,
      ],
      declarations: [ObservationListingComponent],
      providers: [
        ObservationUtilService,
        { provide: Router, useClass: RouterStub },
        { provide: ResourceService, useValue: resourceBundle },
        { provide: ActivatedRoute, useClass: FakeActivatedRoute },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservationListingComponent);
    component = fixture.componentInstance;
    toasterService = TestBed.get(ToasterService);
    observationUtilService = TestBed.get(ObservationUtilService);
    kendraService = TestBed.get(KendraService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call ngonit when getProfileInfo check is false', fakeAsync(() => {
    showEditUserDetailsPopup;
    spyOn(observationUtilService, 'getProfileInfo').and.returnValue(Promise.resolve(false));
    fixture.whenStable().then(() => {
      component.showEditUserDetailsPopup = false;
      showEditUserDetailsPopup = false;
    });
    spyOn(observationUtilService, 'getAlertMetaData').and.callFake(()=>{
      return Response.metaData;
    })
    spyOn(observationUtilService, 'showPopupAlert').and.returnValue(Promise.resolve(true));
    component.ngOnInit();
    expect(observationUtilService).toBeDefined();
    expect(component.ngOnInit).toBeDefined();
  }));


  it('should redo layout on render', () => {
    component.layoutConfiguration = {};
    component.ngOnInit();
    component.redoLayout();
    component.layoutConfiguration = null;
    component.redoLayout();
  });

  it('should call getProfileCheck', fakeAsync(() => {
    const mySpy = spyOn(observationUtilService, 'getProfileInfo').and.callFake(
      () => Promise.resolve(true)
    );
    spyOn(component, 'getProfileCheck').and.callThrough(); // callThrough()
    component.getProfileCheck();
    expect(component.getProfileCheck).toHaveBeenCalled();
    expect(observationUtilService).toBeDefined();
    expect(mySpy).toBeDefined();
    expect(mySpy).toHaveBeenCalledTimes(1);
  }));

  it('should call the navigateToPage for pagination', () => {
    component.navigateToPage(1);
    component.fetchContentList(1);
    spyOn(component, 'navigateToPage');
  });

  it('should call ObservationUtilService - getProfileDataList', () => {
    const mySpy = spyOn(
      observationUtilService,
      'getProfileDataList'
    ).and.callFake(() => Promise.resolve(Response.profileData));
    payload = Response.profileData;
    component.getDataParam();
    spyOn(component, 'getDataParam').and.callThrough();
    expect(observationUtilService).toBeDefined();
    expect(observationUtilService).toBeTruthy();
    expect(mySpy).toBeDefined();
    expect(mySpy).toHaveBeenCalledTimes(1);
  });

  it('should call KendraService - fetchContentList', () => {
    component.ngOnInit();
    spyOn(component, 'fetchContentList').and.callThrough();
    component.fetchContentList(1);
    const mySpy = spyOn(kendraService, 'post').and.returnValue(
      of({
        result: {
          count: Response.successData.count,
          data: Response.successData.data,
        },
      })
    );
    component.contentList = Response.successData.data;
    expect(KendraService).toBeDefined();
    expect(kendraService).toBeTruthy();
    expect(mySpy).toBeDefined();
  });

  it('should call setFormat', () => {
    component.totalCount = Response.successData.count;
    component.setFormat(Response.successData.data);
  });

  it('Should navigate to  back if profile not updated', () => {
    component.back();
    const location: Location = TestBed.get(Location);
    expect(location.path()).toBe('');
  });

  it('should unsubscribe from all observable subscriptions', () => {
    component.ngOnInit();
    spyOn(component.unsubscribe$, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
  });

  it('should call playcontent for the observation list data ', () => {
    component.playContent(mockEventData);
    spyOn(component, 'playContent');
  });

  it('should call inview for the observation list data ', () => {
    component.inView(mockEventData);
    spyOn(component, 'inView');
  });

  it('should call the ngAfterViewInit', () => {
    component.ngAfterViewInit();
  });
});
