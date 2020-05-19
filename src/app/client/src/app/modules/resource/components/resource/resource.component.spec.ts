import { BehaviorSubject, of} from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceService, SharedModule
} from '@sunbird/shared';
import { CoreModule} from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SuiModule } from 'ng2-semantic-ui';
import * as _ from 'lodash-es';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TelemetryModule } from '@sunbird/telemetry';
import { ResourceComponent } from './resource.component';

describe('ResourceComponent', () => {
  let component: ResourceComponent;
  let fixture: ComponentFixture<ResourceComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    url = jasmine.createSpy('url');
  }
  const resourceBundle = {
    'messages': {
      'fmsg': {
        'm0027': 'Something went wrong',
        'm0090': 'Could not download. Try again later',
        'm0091': 'Could not copy content. Try again later'
      },
      'stmsg': {
        'm0009': 'error',
        'm0140': 'DOWNLOADING',
        'm0138': 'FAILED',
        'm0139': 'DOWNLOADED',
      },
      'emsg': {},
    },
    frmelmnts: {
      lbl: {
        fetchingContentFailed: 'Fetching content failed. Please try again later.'
      },
    },
    languageSelected$: of({})
  };
  class FakeActivatedRoute {
    queryParamsMock = new BehaviorSubject<any>({ subject: ['English'] });
    params = of({});
    get queryParams() { return this.queryParamsMock.asObservable(); }
    snapshot = {
      params: {slug: 'ap'},
      data: {
        telemetry: { env: 'resource', pageid: 'resource-search', type: 'view', subtype: 'paginate'}
      }
    };
    public changeQueryParams(queryParams) { this.queryParamsMock.next(queryParams); }
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule.forRoot(), CoreModule, HttpClientTestingModule, SuiModule, TelemetryModule.forRoot()],
      declarations: [ResourceComponent],
      providers: [{ provide: ResourceService, useValue: resourceBundle },
      { provide: Router, useClass: RouterStub },
      { provide: ActivatedRoute, useClass: FakeActivatedRoute }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should return  data from search', () => {
    component.channelId = '123',
    component['contentSearchService']._frameworkId = '123456';
    const option = {filters: {},
    isCustodianOrg: true,
    channelId: '123',
    frameworkId: '123456'
    };
    spyOn(component['searchService'], 'fetchCourses').and.returnValue(of ([{title: 'English', count: 2}, { title: 'Social', count: 1}]
    ));
    component['fetchCourses']();
    expect(component['searchService'].fetchCourses).toHaveBeenCalledWith(option,  true);
    expect(component.cardData.length).toEqual(2);

  });


  it('should return empty data from search', () => {
    component.channelId = '123',
    component['contentSearchService']._frameworkId = '123456';
    const option = {filters: {},
    isCustodianOrg: true,
    channelId: '123',
    frameworkId: '123456'
    };
    spyOn(component['searchService'], 'fetchCourses').and.returnValue(of ([]
    ));
    component['fetchCourses']();
    expect(component['searchService'].fetchCourses).toHaveBeenCalledWith(option,  true);
    expect(component.cardData.length).toEqual(0);

  });
});
