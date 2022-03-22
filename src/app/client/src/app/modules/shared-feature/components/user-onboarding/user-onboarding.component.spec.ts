import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UserOnboardingComponent, Stage } from './user-onboarding.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { SharedModule } from '@sunbird/shared';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TelemetryService } from '@sunbird/telemetry';
import { TenantService } from '@sunbird/core';
import { PopupControlService } from '../../../../service/popup-control.service';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from '@sunbird/test-util';
import { CacheService } from 'ng2-cache-service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


describe('UserOnboardingComponent', () => {
  let component: UserOnboardingComponent;
  let fixture: ComponentFixture<UserOnboardingComponent>;

  configureTestSuite();
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UserOnboardingComponent],
      imports: [
        SuiModule,
        SharedModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserAnimationsModule
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
    const tenantService:any = TestBed.inject(TenantService);
    const tenantData = { 'appLogo': '/appLogo.png', 'favicon': '/favicon.ico', 'logo': '/logo.png', 'titleName': 'SUNBIRD' };
    tenantService._tenantData$.next({ err: null, tenantData: tenantData });
    component.ngOnInit();
    expect(component.tenantInfo.titleName).toEqual('SUNBIRD');
    expect(component.tenantInfo.logo).toEqual('/logo.png');
  });

  it('should call ngOnInit for igot instance', () => {
    const tenantService:any = TestBed.inject(TenantService);
    const cacheService = TestBed.inject(CacheService);
    spyOn(cacheService, 'get').and.returnValue({ slug: 'SUNBIRD' });
    const tenantData = { 'appLogo': '/appLogo.png', 'favicon': '/favicon.ico', 'logo': '/logo.png', 'titleName': 'SUNBIRD' };
    tenantService._tenantData$.next({ err: null, tenantData: tenantData as any });
    tenantService.slugForIgot = 'SUNBIRD';
    component.ngOnInit();
    expect(component.tenantInfo.titleName).toEqual('SUNBIRD');
    expect(component.tenantInfo.logo).toEqual('/logo.png');
    expect(component.stage).toEqual('user');
  });

  it('should call userTypeSubmit', () => {
    component.isGuestUser = true;
    spyOn(component.close, 'emit');
    component.userTypeSubmit();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should call locationSubmit', () => {
    const popupControlService = TestBed.inject(PopupControlService);
    spyOn(popupControlService, 'changePopupStatus');
    spyOn(component.close, 'emit');
    component.locationSubmit();
    expect(popupControlService.changePopupStatus).toHaveBeenCalledWith(true);
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
