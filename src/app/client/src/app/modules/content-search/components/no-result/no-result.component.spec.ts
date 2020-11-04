import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoResultComponent } from './no-result.component';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedModule, ResourceService, ConfigService, BrowserCacheTtlService, } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SuiModule } from 'ng2-semantic-ui';
import { FormsModule } from '@angular/forms';
import { TelemetryModule } from '@sunbird/telemetry';
import { PlayerHelperModule } from '@sunbird/player-helper';
import { CacheService } from 'ng2-cache-service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { configureTestSuite } from '@sunbird/test-util';
import { FormService, UserService } from '@sunbird/core';
import { of } from 'rxjs';

describe('NoResultComponent', () => {
  let component: NoResultComponent;
  let fixture: ComponentFixture<NoResultComponent>;
  let formService;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  const fakeActivatedRoute = {
    snapshot: {
      root: { firstChild: { params: { slug: 'sunbird' } } }
    }
  };

  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule, SharedModule.forRoot(), SuiModule, TelemetryModule.forRoot(), PlayerHelperModule],
      declarations: [NoResultComponent],
      providers: [ResourceService, UserService, ConfigService, CacheService, BrowserCacheTtlService, DeviceDetectorService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should emit event on click of explore', () => {
  //   spyOn(component.exploreMoreContent, 'emit');
  //   component.handleEvent();
  //   expect(component.exploreMoreContent.emit).toHaveBeenCalled();
  // });
  it('should formData', () => {
    fixture.detectChanges();
    const response = [
      { 'index': 0, 'contentType': 'all', 'title': 'ACTIVITY_COURSE_TITLE', 'desc': 'ACTIVITY_COURSE_DESC', 'activityType': 'Content', 'isEnabled': true, 'filters': { 'contentType': ['course'] } },
      { 'index': 1, 'contentType': 'textbook', 'title': 'ACTIVITY_TEXTBOOK_TITLE', 'desc': 'ACTIVITY_TEXTBOOK_DESC', 'activityType': 'Content', 'isEnabled': false, 'filters': { 'contentType': ['TextBook'] } }
    ];
    formService = TestBed.get(FormService);
    spyOn(formService, 'getFormConfig').and.returnValue(of(response));
    component['formData']();
  });
   it('should call the handleEvent method for non-loggedin user', () => {
    const userService = TestBed.get(UserService);
    spyOnProperty(userService, 'loggedIn', 'get').and.returnValue(false);
    component.currentPage = {'anonumousUserRoute': {'route': '/explore/1', 'queryParam': 'all'}, 'loggedInUserRoute': {'route': '/search/Library/1', 'queryParam': 'all'}};
    component.handleEvent();
    expect(component.url).toEqual('/explore/1');
  });
  it('should call the handleEvent method for loggedin user', () => {
    const userService = TestBed.get(UserService);
    spyOnProperty(userService, 'loggedIn', 'get').and.returnValue(true);
    component.currentPage = {'anonumousUserRoute': {'route': '/explore/1', 'queryParam': 'all'}, 'loggedInUserRoute': {'route': '/search/Library/1', 'queryParam': 'all'}};
    component.handleEvent();
    expect(component.url).toEqual('/search/Library/1');
  });
});
