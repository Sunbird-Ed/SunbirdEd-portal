import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceService, SharedModule } from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';
import { SuiModalModule } from 'ng2-semantic-ui';
import { of } from 'rxjs';
import { AppUpdateService } from '../../../../../core/services/app-update/app-update.service';
import { AboutUsComponent } from './about-us.component';
import { appInfoResponse } from './about-us.component.spec.data';

describe('AboutUsComponent', () => {
  let component: AboutUsComponent;
  let fixture: ComponentFixture<AboutUsComponent>;
  class ActivatedRouteStub {
    snapshot = {
      data: {
        telemetry: {
          env: 'about-us',
          pageid: 'about-us'
        }
      }
    };
  }
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AboutUsComponent],
      imports: [SharedModule.forRoot(), TelemetryModule.forRoot(), HttpClientTestingModule, SuiModalModule],
      providers: [DatePipe,
        { provide: ResourceService, useValue: appInfoResponse.resourceBundle },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: Router, useClass: RouterStub },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    const appUpdateService = TestBed.get(AppUpdateService);
    spyOn(appUpdateService, 'getAppInfo').and.returnValue(of(appInfoResponse.appInfo));
    component.ngOnInit();
    expect(appUpdateService.getAppInfo).toHaveBeenCalled();
    expect(component.appInfo).toEqual(appInfoResponse.appInfo.result);
  });

  it('should have the text', () => {
    component.appInfo = appInfoResponse.appInfo.result;
    fixture.detectChanges();
    const about_us_title = fixture.debugElement.query(By.css('.font-weight-bold.pt-16.px-16.pb-8.fmedium')).nativeElement.innerText;
    const updatedVersion = fixture.debugElement.query(By.css('.mt-8.text-right.update-link')).nativeElement.innerText;
    expect(about_us_title).toEqual('TENANT Lite Desktop App');
    expect(updatedVersion).toEqual('Update available for version' + ' ' + appInfoResponse.appInfo.result.updateInfo.version);
  });

  it('should call update App', () => {
    spyOn(component, 'updateApp');
    component.appInfo = appInfoResponse.appInfo.result;
    fixture.detectChanges();
    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    fixture.whenStable().then(() => {
      expect(component.updateApp).toHaveBeenCalledWith(appInfoResponse.appInfo.result.updateInfo.url);
    });
  });

  it('should call telemetry Data', () => {
    spyOn(component, 'setTelemetryData');
    const appUpdateService = TestBed.get(AppUpdateService);
    spyOn(appUpdateService, 'getAppInfo').and.returnValue(of(appInfoResponse.appInfo));
    component.getAppInfo();
    expect(component.setTelemetryData).toHaveBeenCalled();
  });

  it('should display Date', () => {
    const datePipe = new DatePipe('en-US');
    component.appInfo = appInfoResponse.appInfo.result;
    fixture.detectChanges();
    const date = Date.now();
    const element = fixture.debugElement.query(By.css('#date')).nativeElement;
    expect(element.innerText).toEqual(datePipe.transform(date, 'dd/MM/yyyy'));
  });
});
