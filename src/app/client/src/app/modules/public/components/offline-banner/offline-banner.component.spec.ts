import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { CacheService } from 'ng2-cache-service';
import { ResourceService, ConfigService, BrowserCacheTtlService } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineBannerComponent } from './offline-banner.component';

describe('OfflineBannerComponent', () => {
  let component: OfflineBannerComponent;
  let fixture: ComponentFixture<OfflineBannerComponent>;

  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ OfflineBannerComponent ],
      providers: [ResourceService, ConfigService, CacheService, BrowserCacheTtlService, DeviceDetectorService,
        { provide: Router, useClass: RouterStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
