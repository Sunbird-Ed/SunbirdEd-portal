import { PublicPlayerService } from '@sunbird/public';
import { DownloadManagerService } from '@sunbird/offline';
import { serverRes } from './content-download.component.spec.data';
import { of as observableOf, throwError as observableThrowError } from 'rxjs';
import { RouterTestingModule,  } from '@angular/router/testing';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CacheService } from 'ng2-cache-service';
import { HttpClientTestingModule} from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { ResourceService, ConfigService, BrowserCacheTtlService, UtilService,
  ToasterService, NavigationHelperService, SharedModule, OfflineCardService } from '@sunbird/shared';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentDownloadComponent } from './content-download.component';
import { TelemetryModule } from '@sunbird/telemetry';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ContentDownloadComponent', () => {
  let component: ContentDownloadComponent;
  let fixture: ComponentFixture<ContentDownloadComponent>;

  const RouterStub =  {
    navigate: jasmine.createSpy('navigate')
  };

  const fakeActivatedRoute = {
    snapshot: { data: { telemetry: { pageid: 'browse' } } }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentDownloadComponent ],
      imports: [TelemetryModule, HttpClientModule, RouterTestingModule, HttpClientTestingModule],
      providers: [ResourceService, ConfigService, CacheService, BrowserCacheTtlService, UtilService,
        ToasterService, NavigationHelperService,
        { provide: Router, useValue: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute } ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentDownloadComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
