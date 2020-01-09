import { Router, ActivatedRoute } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { CacheService } from 'ng2-cache-service';
import { ResourceService, ConfigService, BrowserCacheTtlService, InterpolatePipe } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OfflineBannerComponent } from './offline-banner.component';
import { TelemetryModule } from '@sunbird/telemetry';

describe('OfflineBannerComponent', () => {
  let component: OfflineBannerComponent;
  let fixture: ComponentFixture<OfflineBannerComponent>;

  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  const fakeActivatedRoute = {
    snapshot: {
      data: {
        telemetry: {
          env: 'explore', pageid: 'download-offline-app', type: 'view'
        }
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TelemetryModule.forRoot()],
      declarations: [OfflineBannerComponent, InterpolatePipe],
      providers: [ResourceService, ConfigService, CacheService, BrowserCacheTtlService, DeviceDetectorService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineBannerComponent);
    component = fixture.componentInstance;
    component.slug = 'tn';
    component.orgList = ['ap', 'tn'];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call showOfflineBanner', () => {
    spyOn(component, 'showOfflineBanner').and.callThrough();
    component.ngOnInit();
    expect(component.showOfflineBanner).toHaveBeenCalled();
    expect(component.instance).toBe(component.resourceService.instance);
  });

  it('should show banner', () => {
    component.showOfflineBanner();
    expect(component.showBanner).toBeTruthy();

  });

  it('it should not show banner', () => {
    component.slug = 'mock_tenant';
    component.showOfflineBanner();
    expect(component.showBanner).toBeFalsy();

  });
});
