import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule, FrameworkService, SearchService } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';
import { SuiModule } from 'ng2-semantic-ui';
import { SlickModule } from 'ngx-slick';
import { of, throwError } from 'rxjs';
import { ActivitySearchComponent } from './activity-search.component';
import { activitySearchMockData } from './activity-search.component.data.spec';

describe('ActivitySearchComponent', () => {
  let component: ActivitySearchComponent;
  let fixture: ComponentFixture<ActivitySearchComponent>;

  const frameWorkServiceStub = {
    initialize() {
      return null;
    },
    channelData$: of({ err: null, channelData: activitySearchMockData.channelData })
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ActivitySearchComponent],
      imports: [SharedModule.forRoot(), CoreModule, HttpClientTestingModule, SuiModule, TelemetryModule.forRoot(), SlickModule],
      providers: [{ provide: FrameworkService, useValue: frameWorkServiceStub }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', () => {
    spyOn(component, 'getFrameworkId');
    spyOn<any>(component, 'fetchContents');
    component.ngOnInit();
    expect(component.getFrameworkId).toHaveBeenCalled();
    expect(component['fetchContents']).toHaveBeenCalled();
  });

  it('should call toggleFilter', () => {
    component.showFilters = false;
    component.toggleFilter();
    expect(component.showFilters).toBe(true);
  });

  it('should call getFrameworkId', () => {
    component.getFrameworkId();
    expect(component['frameworkId']).toBeDefined();
  });

  it('should fetch Contents on success', () => {
    component.showLoader = true;
    component.frameworkId = 'abcd1234cd';
    const searchService = TestBed.get(SearchService);
    spyOn(searchService, 'contentSearch').and.returnValue(of({ result: { content: [] } }));
    component['fetchContents']();
    expect(component.showLoader).toBe(false);
    expect(component.contentList).toEqual([]);
  });

  it('should fetch Contents on error', () => {
    component.showLoader = true;
    const searchService = TestBed.get(SearchService);
    spyOn(searchService, 'contentSearch').and.returnValue(throwError({}));
    component['fetchContents']();
    expect(component.showLoader).toBe(false);
    expect(component.contentList).toEqual([]);
  });
});
