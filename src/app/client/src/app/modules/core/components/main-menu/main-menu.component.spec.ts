import { UserService, LearnerService, ContentService, CoreModule } from '@sunbird/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceService, ConfigService, SharedModule, LayoutService, UtilService } from '@sunbird/shared';
import { MainMenuComponent } from './main-menu.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { WebExtensionModule } from '@project-sunbird/web-extensions';
import { ActivatedRoute, Router, RouterEvent } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { configureTestSuite } from '@sunbird/test-util';
import {TelemetryService} from '@sunbird/telemetry';
import {mockData} from '../main-menu/main-menu.component.spec.data';

fdescribe('MainMenuComponent', () => {
  let component: MainMenuComponent;
  let fixture: ComponentFixture<MainMenuComponent>;
  const eventSubject = new ReplaySubject<RouterEvent>(1);
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    url = '/explore-course';
    events = eventSubject.asObservable();
  }
  class FakeActivatedRoute {
  }
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, CoreModule, SharedModule.forRoot()],
      providers: [HttpClient, ResourceService, ConfigService, UserService, LayoutService, TelemetryService,
        LearnerService, ContentService, {provide: ActivatedRoute, useClass: FakeActivatedRoute}, UtilService,
        {provide: Router, useClass: RouterStub}]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainMenuComponent);
    component = fixture.componentInstance;
    component.layoutConfiguration = {};
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getFeatureId method', () => {
    it('should return the feature id', () => {
      const result = component.getFeatureId('user:program:contribute', 'SB-15591');
      expect(result).toEqual([{ id: 'user:program:contribute', type: 'Feature' }, { id: 'SB-15591', type: 'Task' }]);
    });
  });
  it('should create with layout config', () => {
    component.layoutConfiguration = {};
    expect(component).toBeTruthy();
  });

  it('should switch layout and generate telemetry for classic', () => {
    const layoutService = TestBed.get(LayoutService);
    const telemetryService = TestBed.get(TelemetryService);
    component.layoutConfiguration = null;
    spyOn(layoutService, 'initiateSwitchLayout').and.callFake(() => {
    });
    spyOn(telemetryService, 'interact').and.callFake(() => {
    });
    component.switchLayout();
    expect(telemetryService.interact).toHaveBeenCalledWith(mockData.telemetryEventClassic);
  });

  it('should switch layout and generate telemetry for joy', () => {
    const layoutService = TestBed.get(LayoutService);
    const telemetryService = TestBed.get(TelemetryService);
    component.layoutConfiguration = {options: 'option1'};
    spyOn(layoutService, 'initiateSwitchLayout').and.callFake(() => {
    });
    spyOn(telemetryService, 'interact').and.callFake(() => {
    });
    component.switchLayout();
    expect(telemetryService.interact).toHaveBeenCalledWith(mockData.telemetryEventJoy);
  });


});
