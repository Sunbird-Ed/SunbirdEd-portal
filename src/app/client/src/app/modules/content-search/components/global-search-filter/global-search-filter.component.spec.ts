import { GlobalSearchFilterComponent } from './global-search-filter.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import * as _ from 'lodash-es';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TelemetryModule } from '@sunbird/telemetry';
import { configureTestSuite } from '@sunbird/test-util';

describe('GlobalSearchFilterComponent', () => {
  let component: GlobalSearchFilterComponent;
  let fixture: ComponentFixture<GlobalSearchFilterComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    url = jasmine.createSpy('url');
  }

  class FakeActivatedRoute {
    snapshot = {
      data: {
        telemetry: { env: 'search', pageid: 'global-search', type: 'view', subtype: 'paginate' }
      }
    };
  }
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule.forRoot(), HttpClientTestingModule, TelemetryModule.forRoot()],
      declarations: [GlobalSearchFilterComponent],
      providers: [{ provide: Router, useClass: RouterStub }, { provide: ActivatedRoute, useClass: FakeActivatedRoute }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalSearchFilterComponent);
    component = fixture.componentInstance;
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
