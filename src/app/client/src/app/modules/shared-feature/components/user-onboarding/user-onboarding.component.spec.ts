import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UserOnboardingComponent, Stage } from './user-onboarding.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SuiModule } from 'ng2-semantic-ui';
import { SharedModule } from '@sunbird/shared';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TelemetryService } from '@sunbird/telemetry';
import { TenantService } from '@sunbird/core';
import { PopupControlService } from '../../../../service/popup-control.service';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from '@sunbird/test-util';
import { CacheService } from 'ng2-cache-service';

describe('UserOnboardingComponent', () => {
  let component: UserOnboardingComponent;
  let fixture: ComponentFixture<UserOnboardingComponent>;

  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserOnboardingComponent],
      imports: [
        SuiModule,
        SharedModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [TelemetryService, TenantService, PopupControlService, { provide: APP_BASE_HREF, useValue: 'test' }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', () => {
    const tenantService = TestBed.get(TenantService);
    const tenantData = { 'appLogo': '/appLogo.png', 'favicon': '/favicon.ico', 'logo': '/logo.png', 'titleName': 'SUNBIRD' };
    tenantService._tenantData$.next({ err: null, tenantData: tenantData });
    component.ngOnInit();
    expect(component.tenantInfo.titleName).toEqual('SUNBIRD');
    expect(component.tenantInfo.logo).toEqual('/logo.png');
  });

  it('should call ngOnInit for igot instance', () => {
    const tenantService = TestBed.get(TenantService);
    const cacheService = TestBed.get(CacheService);
    spyOn(cacheService, 'get').and.returnValue({ slug: 'SUNBIRD' });
    const tenantData = { 'appLogo': '/appLogo.png', 'favicon': '/favicon.ico', 'logo': '/logo.png', 'titleName': 'SUNBIRD' };
    tenantService._tenantData$.next({ err: null, tenantData: tenantData });
    tenantService.slugForIgot = 'SUNBIRD';
    component.ngOnInit();
    expect(component.tenantInfo.titleName).toEqual('SUNBIRD');
    expect(component.tenantInfo.logo).toEqual('/logo.png');
    expect(component.stage).toEqual('user');
  });

  it('should call userTypeSubmit', () => {
    component.userTypeSubmit();
    expect(component.stage).toBe(Stage.LOCATION_SELECTION);
  });

  it('should call locationSubmit', () => {
    const popupControlService = TestBed.get(PopupControlService);
    component.onboardingModal = {
      deny: () => { }
    };
    spyOn(popupControlService, 'changePopupStatus');
    spyOn(component.onboardingModal, 'deny');
    spyOn(component.close, 'emit');
    component.locationSubmit();
    expect(popupControlService.changePopupStatus).toHaveBeenCalledWith(true);
    expect(component.onboardingModal.deny).toHaveBeenCalled();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should unsubscribe subject', () => {
    spyOn(component['unsubscribe$'], 'next');
    spyOn(component['unsubscribe$'], 'complete');
    component.ngOnDestroy();
    expect(component['unsubscribe$'].next).toHaveBeenCalled();
    expect(component['unsubscribe$'].complete).toHaveBeenCalled();
  });
});
