import { of as observableOf } from 'rxjs';
import { RouterTestingModule,  } from '@angular/router/testing';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CacheService } from 'ng2-cache-service';
import { HttpClientTestingModule} from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { ResourceService, ConfigService, BrowserCacheTtlService, UtilService,
  ToasterService, NavigationHelperService, SharedModule } from '@sunbird/shared';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentDownloadComponent } from './content-download.component';
import { TelemetryModule } from '@sunbird/telemetry';

describe('ContentDownloadComponent', () => {
  let component: ContentDownloadComponent;
  let fixture: ComponentFixture<ContentDownloadComponent>;

  const RouterStub =  {
    navigate: jasmine.createSpy('navigate')
  };

  const fakeActivatedRoute = {
    'params': observableOf({ contentId: 'd0_33567325' }),
    'queryParams': observableOf({ language: ['en'] }, {dialCode: '61U24C'}),
    snapshot: {
      data: {
        telemetry: {
          env: 'get', pageid: 'get', type: 'edit', subtype: 'paginate'
        }
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentDownloadComponent ],
      imports: [TelemetryModule, HttpClientModule, RouterTestingModule, HttpClientTestingModule],
      providers: [ResourceService, ConfigService, CacheService, BrowserCacheTtlService, UtilService,
        ToasterService, NavigationHelperService,
        { provide: Router, useValue: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute } ]
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
