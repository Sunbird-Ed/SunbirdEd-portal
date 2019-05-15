import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PageSectionComponent } from './page-section.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SuiModule } from 'ng2-semantic-ui';
import { SlickModule } from 'ngx-slick';
import { ResourceService, ConfigService, BrowserCacheTtlService } from '@sunbird/shared';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CacheService } from 'ng2-cache-service';
import { Response } from './page-section.component.spec.data';
import { TelemetryModule } from '@sunbird/telemetry';
import { NgInviewModule } from 'angular-inport';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';

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
      declarations: [PageSectionComponent],
      providers: [ResourceService, ConfigService, CacheService, BrowserCacheTtlService,
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }],
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
    expect(fixture.nativeElement.querySelector('.sb-pageSection-title').innerText).toEqual('Multiple data');
    expect(fixture.nativeElement.querySelector('.sb-pageSection-count').innerText).toEqual('1');
  });
  it('should show TEST INPUT for no contents data', () => {
    component.section = Response.defaultData;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.sb-pageSection-title')).toEqual(null);
    expect(fixture.nativeElement.querySelector('.sb-pageSection-count')).toEqual(null);
  });
  it('should call inviewChange method for visits data', () => {
    component.section = { name: 'courseTest', length: 1 , contents: []};
    spyOn(component, 'handleAfterChange').and.callThrough();
    component.handleAfterChange({});
    expect(component.handleAfterChange).toHaveBeenCalled();
  });
  it('should call playContent', () => {
    spyOn(component, 'playContent').and.callThrough();
    component.section = { name: '', length: 0 };
    component.playContent(Response.playContentData);
    component.playEvent.emit(Response.playContentData);
    expect(component.playContent).toHaveBeenCalled();
  });

});
