import { UserService, LearnerService, ContentService, CoreModule } from '@sunbird/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceService, ConfigService } from '@sunbird/shared';
import { MainMenuComponent } from './main-menu.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { WebExtensionModule } from 'sunbird-web-extension';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';

describe('MainMenuComponent', () => {
  let component: MainMenuComponent;
  let fixture: ComponentFixture<MainMenuComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, WebExtensionModule, TelemetryModule],
      declarations: [MainMenuComponent],
      providers: [HttpClient, ResourceService, ConfigService, UserService,
        LearnerService, ContentService, TelemetryService,
        { provide: Router, useClass: RouterStub }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
