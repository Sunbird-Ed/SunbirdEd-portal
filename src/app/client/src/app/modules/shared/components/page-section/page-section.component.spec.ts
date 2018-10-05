import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {ICaraouselData} from '../../interfaces/caraouselData';
import { PageSectionComponent } from './page-section.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SuiModule } from 'ng2-semantic-ui';
import { SlickModule } from 'ngx-slick';
import { ResourceService, ConfigService  } from '@sunbird/shared';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {Response} from './page-section.component.spec.data';
import { TelemetryModule } from '@sunbird/telemetry';
import { NgInviewModule } from 'angular-inport';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';

const fakeActivatedRoute = {
  snapshot: {
    data: {
      telemetry: {
        env: 'course', pageid: 'course-search', type: 'view', subtype: 'paginate'
      }
    }
  }
};
describe('PageSectionComponent', () => {
  let component: PageSectionComponent;
  let fixture: ComponentFixture<PageSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SuiModule, SlickModule, NgInviewModule, TelemetryModule.forRoot(), RouterTestingModule],
      declarations: [ PageSectionComponent ],
      providers: [ ResourceService, ConfigService, { provide: ActivatedRoute, useValue: fakeActivatedRoute } ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageSectionComponent);
    component = fixture.componentInstance;
  });

  it('should show TEST INPUT for success data', () => {
    component.section = Response.successData;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('div .sectionHeading').innerText).toEqual('Multiple Data 1');
    expect(fixture.nativeElement.querySelector('div span.circular').innerText).toEqual('1');
  });
  it('should show TEST INPUT for no contents data', () => {
    component.section = Response.defaultData;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('div .sectionHeading')).toEqual(null);
   expect(fixture.nativeElement.querySelector('div span.circular')).toEqual(null);
  });
  it('should call inview method for visits data', () => {
    component.section = {name: 'courseTest', length: 1};
    spyOn(component, 'inview').and.callThrough();
    component.inview(Response.event);
    expect(component.inview).toHaveBeenCalled();
    expect(component.inviewLogs).toBeDefined();
  });
  it('should call inview method for visits data for courseId', () => {
    component.section = {name: 'courseTest', length: 1};
    spyOn(component, 'inview').and.callThrough();
    component.inview(Response.event1);
    expect(component.inview).toHaveBeenCalled();
    expect(component.inviewLogs).toBeDefined();
  });
  it('should call inviewChange method for visits data', () => {
    component.section = {name: 'courseTest', length: 1};
    spyOn(component, 'inviewChange').and.callThrough();
    component.inviewChange(Response.slideContentList, Response.slideEventData);
    expect(component.inviewChange).toHaveBeenCalled();
    expect(component.inviewLogs).toBeDefined();
  });
  it('should call checkSlide method for interact data', () => {
    component.section = {name: 'courseTest', length: 1};
    spyOn(component, 'checkSlide').and.callThrough();
    component.checkSlide(Response.slide2EventData);
    console.log('checkslide 2: ', component.checkSlide(Response.slide2EventData));
    expect(component.checkSlide).toHaveBeenCalled();
  });
  it('should call playContent', () => {
    spyOn(component, 'playContent').and.callThrough();
   component.playContent(Response.playContentData) ;
   component.playEvent.emit(Response.playContentData);
   expect(component.playContent).toHaveBeenCalled();
  });

});
