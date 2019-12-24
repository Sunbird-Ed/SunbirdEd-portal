import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMoreComponent } from './view-more.component';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { TelemetryModule } from '@sunbird/telemetry';
import { SharedModule, ResourceService, UtilService } from '@sunbird/shared';
import { CoreModule, OrgDetailsService, SearchService } from '@sunbird/core';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { ConnectionService } from '../../services';
import { visitsEvent, contentList } from './view-more.component.data.spec';

const resourceBundle = {
  messages: {
    fmsg: {
      m0004: 'Fetching data failed, please try again later...',
      m0090: 'Could not download. Try again later',
      m0091: 'Enter a valid phone number'
    },
    smsg: {
      m0059: 'Content successfully copied'
    },
    stmsg: {
      m0138: 'FAILED'
    }
  }
};

class MockActivatedRoute {
  snapshot = {
    data: {
      softConstraints: { badgeAssertions: 98, board: 99, channel: 100 },
      telemetry: { env: 'search', pageid: 'view-more', type: 'view', subtype: 'paginate' }
    },
    params: { slug: 'ntp' },
    queryParams: { channel: '12345' }
  };
  queryParams = of({
    'key': 'test',
    'apiQuery': `{"filters":{"channel":"505c7c48ac6dc1edc9b08f21db5a571d",
    "contentType":["Collection","TextBook","LessonPlan","Resource"]},"mode":"soft",
    "params":{"orgdetails":"orgName,email","framework":"TEST"},"query":"test","facets":["board","medium",
    "gradeLevel","subject","contentType"],"softConstraints":{"badgeAssertions":98,"board":99,"channel":100}}`
  });
}

describe('ViewMoreComponent', () => {
  let component: ViewMoreComponent;
  let fixture: ComponentFixture<ViewMoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewMoreComponent],
      imports: [RouterModule.forRoot([]), CommonConsumptionModule, TelemetryModule.forRoot(), SharedModule.forRoot(), CoreModule],
      providers: [OrgDetailsService, SearchService, UtilService, ConnectionService,
        { provide: ResourceService, useValue: resourceBundle },
        { provide: ActivatedRoute, useClass: MockActivatedRoute }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create visits for view-more page', () => {
    component.telemetryImpression = {
      context: {
        env: 'search'
      },
      edata: {
        visits: [],
        subtype: 'paginate',
        type: 'view',
        pageid: 'search',
        uri: '/search?key=test',
        duration: 0.0065
      }
    };
    component.visits = [];
    component.contentList = contentList;
    fixture.detectChanges();
    component.prepareVisits(visitsEvent);
    expect(component.visits).toEqual(visitsEvent.visits);
    expect(component.telemetryImpression.edata.visits).toEqual(visitsEvent.visits);
    expect(component.telemetryImpression.edata.subtype).toEqual('pageexit');
  });

  it('should call call ngOnInit', () => {
    const orgDetailsService = TestBed.get(OrgDetailsService);
    spyOn(orgDetailsService, 'getOrgDetails').and.returnValue(of({ hashTagId: '505c7c48ac6dc1edc9b08f21db5a571d' }));
    spyOn(component, 'setTelemetryData');
    const element = document.createElement('INPUT');
    element.setAttribute('type', 'hidden');
    element.setAttribute('id', 'defaultTenant');
    element.setAttribute('value', 'ntp');
    document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(element);
    component.ngOnInit();
    expect(orgDetailsService.getOrgDetails).toHaveBeenCalled();
    expect(component.setTelemetryData).toHaveBeenCalled();
    expect(component.hashTagId).toBe('505c7c48ac6dc1edc9b08f21db5a571d');
    expect(component.initFilters).toBe(true);
  });
});
