import { of } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PageSectionComponent } from './page-section.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SuiModule } from 'ng2-semantic-ui';
import { SlickModule } from 'ngx-slick';
import { SharedModule,ResourceService, ConfigService, BrowserCacheTtlService } from '@sunbird/shared';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CacheService } from 'ng2-cache-service';
import { Response } from './page-section.component.spec.data';
import { TelemetryModule } from '@sunbird/telemetry';
import { NgInviewModule } from 'angular-inport';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { configureTestSuite } from '@sunbird/test-util';
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
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SuiModule, SlickModule, SharedModule.forRoot(), NgInviewModule, TelemetryModule.forRoot(), RouterTestingModule],
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
    expect(fixture.nativeElement.querySelector('.sb-pageSection-title').innerText).toEqual('Multiple data1');
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
  it('should reinit slick on changes', () => {
    spyOn(component, 'reInitSlick');
    component.ngOnChanges();
    expect(component.reInitSlick).toHaveBeenCalled();
  });
  it('should call selectedLanguageTranslation', () => {
    spyOn(component, 'updateSlick');
    spyOn(component, 'selectedLanguageTranslation');
    component.cardType = 'batch';
    component.pageid = 'course';
    component.section = {name: 'Section 1', length: 0, contents: []};
    component.ngOnInit();
    expect(component.updateSlick).toHaveBeenCalled();
  });

  it ('should call updateSlick on reInitSlick', () => {
    spyOn(component, 'updateSlick');
    spyOn(component['cdr'], 'detectChanges');
    component.reInitSlick();
    expect(component.updateSlick).toHaveBeenCalled();
    expect(component.contentList.length).toEqual(0);
    expect(component.maxSlide).toEqual(0);
    expect(component.refresh).toBeTruthy();
    expect(component['cdr'].detectChanges).toHaveBeenCalled();
  });

  it ('should emit view all', () => {
    spyOn(component.viewAll, 'emit');
    component.navigateToViewAll({});
    expect(component.viewAll.emit).toHaveBeenCalledWith({});
  });

  it ('should call updateContentViewed()', () => {
    spyOn(component, 'updateContentViewed');
    component.ngOnDestroy();
    expect(component.updateContentViewed).toHaveBeenCalled();
  });

});
