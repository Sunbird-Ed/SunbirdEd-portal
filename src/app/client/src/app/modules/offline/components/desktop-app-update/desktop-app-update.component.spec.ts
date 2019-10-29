import { TelemetryModule } from '@sunbird/telemetry';
import { serverRes } from './desktop-app-update.component.spec.data';
import { of as observableOf, throwError } from 'rxjs';
import { AppUpdateService } from './../../services/app-update/app-update.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '@sunbird/shared';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DesktopAppUpdateComponent } from './desktop-app-update.component';
import { SuiModalModule } from 'ng2-semantic-ui';

describe('DesktopAppUpdateComponent', () => {
  let component: DesktopAppUpdateComponent;
  let fixture: ComponentFixture<DesktopAppUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesktopAppUpdateComponent ],
      imports: [SuiModalModule, HttpClientTestingModule, TelemetryModule],
      providers: [ConfigService, ]
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

  it ('should call isAppUpdated method', () => {
    spyOn(component, 'isAppUpdated');
    component.ngOnInit();
    expect(component.isAppUpdated).toHaveBeenCalled();
  });

  it ('should call appupdate service', () => {
    const appUpdateService = TestBed.get(AppUpdateService);
    spyOn(appUpdateService, 'isAppUpdated').and.returnValue(observableOf(serverRes.app_update));
    component.isAppUpdated();
    expect(component.appUpdateService.isAppUpdated).toHaveBeenCalled();
    expect(component.isUpdated).toBeTruthy();
    expect(component.downloadUrl).toBeDefined();
  });

  it ('should call appupdate service', () => {
    const appUpdateService = TestBed.get(AppUpdateService);
    spyOn(appUpdateService, 'isAppUpdated').and.returnValue(observableOf(serverRes.app_not_update));
    component.isAppUpdated();
    expect(component.appUpdateService.isAppUpdated).toHaveBeenCalled();
    expect(component.isUpdated).toBeFalsy();
    expect(component.downloadUrl).toBeUndefined();
  });

  it('should throw error', () => {
    const appUpdateService = TestBed.get(AppUpdateService);
    spyOn(appUpdateService, 'isAppUpdated').and.returnValue(throwError(serverRes.error));
    component.isAppUpdated();
    expect(component.appUpdateService.isAppUpdated).toHaveBeenCalled();
    expect(component.isUpdated).toBeFalsy();
  });

  it('should call set telemetry method', () => {
    spyOn(component, 'setTelemetry');
    component.ngOnInit();
    expect(component.setTelemetry).toHaveBeenCalled();
  });

});
