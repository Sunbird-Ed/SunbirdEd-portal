import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UserRoleAssignComponent } from './user-role-assign.component';
import { configureTestSuite } from '@sunbird/test-util';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { CoreModule, UserService } from '@sunbird/core';
import { TelemetryService } from '@sunbird/telemetry';
import { TranslateModule } from '@ngx-translate/core';
import { ObservationUtilService } from '../../../observation/service';
import { ConfigService, ResourceService, BrowserCacheTtlService, ToasterService } from '@sunbird/shared';

describe('UserRoleAssignComponent', () => {
  configureTestSuite();
  let component: UserRoleAssignComponent;
  let fixture: ComponentFixture<UserRoleAssignComponent>;
  let observationUtilService;
  
  beforeEach(async(() => {
    
    TestBed.configureTestingModule({
      imports: [SuiModule, CoreModule,
        FormsModule, ReactiveFormsModule, HttpClientTestingModule, RouterModule.forRoot([]), TranslateModule.forRoot()],
      declarations: [ UserRoleAssignComponent ],
      providers: [TelemetryService, ObservationUtilService, ConfigService, ResourceService,
        BrowserCacheTtlService,ToasterService, UserService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRoleAssignComponent);
    observationUtilService=TestBed.get(ObservationUtilService)
    component = fixture.componentInstance;
    fixture.detectChanges();
    const userService = TestBed.get(UserService);

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});