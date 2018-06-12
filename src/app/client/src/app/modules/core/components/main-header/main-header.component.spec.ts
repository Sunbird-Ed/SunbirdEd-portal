import { RouterTestingModule } from '@angular/router/testing';
import { mockUserData } from './../../services/user/user.mock.spec.data';
import { Ng2IzitoastService } from 'ng2-izitoast';
import { Observable } from 'rxjs/Observable';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MainHeaderComponent } from './main-header.component';
import { ConfigService, ResourceService, ToasterService, SharedModule } from '@sunbird/shared';
import { UserService, LearnerService, PermissionService, TenantService, CoreModule } from '@sunbird/core';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { WebExtensionModule } from 'sunbird-web-extension';
import { TelemetryModule} from '@sunbird/telemetry';

describe('MainHeaderComponent', () => {
  let component: MainHeaderComponent;
  let fixture: ComponentFixture<MainHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, Ng2IziToastModule, SharedModule.forRoot(), CoreModule.forRoot(),
        TelemetryModule.forRoot(), RouterTestingModule, WebExtensionModule.forRoot()],
      declarations: [],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [ToasterService, TenantService,
        ResourceService, PermissionService,
        UserService, ConfigService,
        LearnerService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainHeaderComponent);
    component = fixture.componentInstance;
  });

  it('should subscribe to user service', () => {
    spyOn(document, 'getElementById').and.returnValue('true');
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(Observable.of(mockUserData.success));
    userService.initialize(true);
    fixture.detectChanges();
    expect(component.userProfile).toBeTruthy();
  });

  it('Should subscribe to tenant service and update logo and tenant name', () => {
    spyOn(document, 'getElementById').and.returnValue('true');
    const service = TestBed.get(TenantService);
    spyOn(service, 'get').and.returnValue(Observable.of(mockUserData.tenantSuccess));
    service.getTenantInfo('Sunbird');
    component.ngOnInit();
    expect(component.logo).toEqual(mockUserData.tenantSuccess.result.logo);
    expect(component.tenantName).toEqual(mockUserData.tenantSuccess.result.titleName);
  });

  it('Should not update logo unless tenant service returns it', () => {
    spyOn(document, 'getElementById').and.returnValue('true');
    component.ngOnInit();
    expect(component.logo).toBeUndefined();
    expect(component.tenantName).toBeUndefined();
  });

  it('Should update the logo on initialization', () => {
    spyOn(document, 'getElementById').and.returnValue('true');
    const service = TestBed.get(TenantService);
    spyOn(service, 'get').and.returnValue(Observable.of(mockUserData.tenantSuccess));
    service.getTenantInfo('Sunbird');
    component.ngOnInit();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('img').src).toEqual(mockUserData.tenantSuccess.result.logo);
  });
});
