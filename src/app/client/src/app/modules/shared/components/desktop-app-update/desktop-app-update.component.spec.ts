import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserCacheTtlService, ConfigService, ResourceService } from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';
import { CacheService } from 'ng2-cache-service';
import { SuiModalModule } from 'ng2-semantic-ui';
import { of as observableOf, throwError } from 'rxjs';
import { AppUpdateService } from '../../../core/services/app-update/app-update.service';
import { DesktopAppUpdateComponent } from './desktop-app-update.component';
import { serverRes } from './desktop-app-update.component.spec.data';
describe('DesktopAppUpdateComponent', () => {
  let component: DesktopAppUpdateComponent;
  let fixture: ComponentFixture<DesktopAppUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DesktopAppUpdateComponent],
      imports: [SuiModalModule, HttpClientTestingModule, TelemetryModule],
      providers: [ConfigService, CacheService, BrowserCacheTtlService, { provide: ResourceService, useValue: { instance: 'SUNBIRD' } }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopAppUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call checkForAppUpdate method', () => {
    spyOn(component, 'checkForAppUpdate');
    component.ngOnInit();
    expect(component.checkForAppUpdate).toHaveBeenCalled();
  });

  it('should call app update service', () => {
    const appUpdateService = TestBed.get(AppUpdateService);
    spyOn(appUpdateService, 'checkForAppUpdate').and.returnValue(observableOf(serverRes.app_update));
    spyOn(component, 'setTelemetry');
    component.checkForAppUpdate();
    expect(component.appUpdateService.checkForAppUpdate).toHaveBeenCalled();
    expect(component.isUpdateAvailable).toBeTruthy();
    expect(component.downloadUrl).toBeDefined();
    expect(component.setTelemetry).toHaveBeenCalled();
  });

  it('should throw error', () => {
    const appUpdateService = TestBed.get(AppUpdateService);
    spyOn(appUpdateService, 'checkForAppUpdate').and.returnValue(throwError(serverRes.error));
    component.checkForAppUpdate();
    expect(component.isUpdateAvailable).toBeFalsy();
  });

  it('should call app update service', () => {
    const appUpdateService = TestBed.get(AppUpdateService);
    spyOn(appUpdateService, 'checkForAppUpdate').and.returnValue(observableOf(serverRes.app_not_update));
    component.checkForAppUpdate();
    expect(component.appUpdateService.checkForAppUpdate).toHaveBeenCalled();
    expect(component.isUpdateAvailable).toBeFalsy();
    expect(component.downloadUrl).toBeUndefined();
  });


});
