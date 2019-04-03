import { UserService, LearnerService, ContentService, CoreModule } from '@sunbird/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceService, ConfigService, SharedModule } from '@sunbird/shared';
import { MainMenuComponent } from './main-menu.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { WebExtensionModule } from '@project-sunbird/web-extensions';

describe('MainMenuComponent', () => {
  let component: MainMenuComponent;
  let fixture: ComponentFixture<MainMenuComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, WebExtensionModule.forRoot(), CoreModule.forRoot(), SharedModule.forRoot()],
      providers: [HttpClient, ResourceService, ConfigService, UserService,
        LearnerService, ContentService,
        { provide: Router, useClass: RouterStub }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainMenuComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
