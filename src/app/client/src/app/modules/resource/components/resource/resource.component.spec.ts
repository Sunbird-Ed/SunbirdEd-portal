import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { SharedModule, ResourceService, ServerResponse, ConfigService, ToasterService, ICaraouselData, IAction } from '@sunbird/shared';
import { PageApiService, LearnerService } from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable } from 'rxjs/Observable';
import { SuiModule } from 'ng2-semantic-ui';
import { SlickModule } from 'ngx-slick';
import * as _ from 'lodash';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ResourceComponent } from './resource.component';
import {Response} from './resource.component.spec.data';
import { Ng2IzitoastService } from 'ng2-izitoast';
import { ActivatedRoute, Router } from '@angular/router';

describe('ResourceComponent', () => {
  let component: ResourceComponent;
  let fixture: ComponentFixture<ResourceComponent>;
  const resourceBundle = {
    'messages': {
      'stmsg': {
        'm0007': 'Please search something else',
        'm0006': 'NO result found'
      },
    }
  };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  const fakeActivatedRoute = {
    'params': Observable.from([{ pageNumber: '1' }]),
  'queryParams':  Observable.from([{ subject: ['English'] }])
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SuiModule, SlickModule, SharedModule],
      declarations: [ResourceComponent],
      providers: [ResourceService, PageApiService, ConfigService, LearnerService, ToasterService,
         Ng2IzitoastService, { provide: ResourceService, useValue: resourceBundle },
         { provide: Router, useClass: RouterStub },
         { provide: ActivatedRoute, useValue: fakeActivatedRoute }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should subscribe to service', () => {
    const pageSectionService = TestBed.get(PageApiService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(pageSectionService, 'getPageData').and.callFake(() => Observable.of(Response.successData));
    component.populatePageData();
    expect(component).toBeTruthy();
    expect(component.showLoader).toBeFalsy();
    expect(component.caraouselData).toBeDefined();
  });
});
