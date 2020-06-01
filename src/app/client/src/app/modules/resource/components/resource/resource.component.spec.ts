import { SlickModule } from 'ngx-slick';
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
        telemetry: { env: 'library', pageid: 'library', type: 'view', subtype: 'paginate'}
      }
    };
    public changeQueryParams(queryParams) { this.queryParamsMock.next(queryParams); }
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule.forRoot(), CoreModule, HttpClientTestingModule, SuiModule, TelemetryModule.forRoot(), SlickModule],
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
    expect(component['searchService'].fetchCourses).toHaveBeenCalledWith(option,  ['Course']);
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
    expect(component['searchService'].fetchCourses).toHaveBeenCalledWith(option,  ['Course']);
    expect(component.cardData.length).toEqual(0);

  });

  it('should call telemetry.interact()', () => {
    spyOn(component.telemetryService, 'interact');
    const data = {
      cdata: [ {type: 'card', id: 'course'}],
      edata: {id: 'test'},
      object: {},
    };
    const cardClickInteractData = {
      context: {
        cdata: data.cdata,
        env: 'library',
      },
      edata: {
        id: data.edata.id,
        type: 'click',
        pageid: 'library'
      },
      object: data.object
    };
    component.getInteractEdata(data);
    expect(component.telemetryService.interact).toHaveBeenCalledWith(cardClickInteractData);
  });

  it ('should call getInteractEdata() from navigateToCourses', () => {
    const event  = {data: {title: 'test', contents: [{identifier: '1234'}]}};
    const data = {
      cdata: [ {type: 'library-courses', id: 'test'}],
      edata: {id: 'course-card'},
      object: {},
    };
    spyOn(component, 'getInteractEdata');
    component.navigateToCourses(event);
    expect(component.getInteractEdata).toHaveBeenCalledWith(data);
    expect(component['router'].navigate).toHaveBeenCalledWith(['learn/course', '1234']);
  });

  it ('should call list/curriculum-courses() from navigateToCourses', () => {
    const event  = {data: {title: 'test', contents: [{identifier: '1234'}, {identifier: '23456'}]}};
    component.navigateToCourses(event);
    expect(component['router'].navigate).toHaveBeenCalledWith(['resources/curriculum-courses'], {
      queryParams: {title: 'test'}
    });
    expect(component['searchService'].subjectThemeAndCourse).toEqual(event.data);
  });

});
