import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { SharedModule, ResourceService, ServerResponse, ConfigService, ToasterService } from '@sunbird/shared';
import { PageSectionService, LearnerService} from '@sunbird/core';
import { ICaraouselData, IAction } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable } from 'rxjs/Observable';
import { SuiModule } from 'ng2-semantic-ui';
import { SlickModule } from 'ngx-slick';
import * as _ from 'lodash';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ResourceComponent } from './resource.component';
import * as mockData from './resource.component.spec.data';
const testData = mockData.mockRes;
import { Ng2IzitoastService } from 'ng2-izitoast';

describe('ResourceComponent', () => {
  let component: ResourceComponent;
  let fixture: ComponentFixture<ResourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SuiModule, SlickModule, SharedModule],
      declarations: [ ResourceComponent ],
      providers: [ResourceService, PageSectionService, ConfigService, LearnerService, ToasterService, Ng2IzitoastService],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

    it('should subscribe to service', () => {
      const pageSectionService = TestBed.get(PageSectionService);
      const learnerService = TestBed.get(LearnerService);
      spyOn(pageSectionService, 'getPageData').and.callFake(() => Observable.of(testData.successData));
      component.populatePageData();
       expect(component.showLoader).toBeFalsy();
       expect(component.caraouselData).toBeDefined();
    });
});
