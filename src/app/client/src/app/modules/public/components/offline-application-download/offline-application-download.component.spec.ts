import { DeviceDetectorService } from 'ngx-device-detector';
import { CacheService } from 'ng2-cache-service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ResourceService, ConfigService, BrowserCacheTtlService } from '@sunbird/shared';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineApplicationDownloadComponent } from './offline-application-download.component';

describe('OfflineApplicationDownloadComponent', () => {
  let component: OfflineApplicationDownloadComponent;
  let fixture: ComponentFixture<OfflineApplicationDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ OfflineApplicationDownloadComponent ],
      providers: [ResourceService, ConfigService, CacheService, BrowserCacheTtlService, DeviceDetectorService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineApplicationDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
