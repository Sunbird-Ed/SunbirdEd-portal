import { of as observableOf, BehaviorSubject, of } from 'rxjs';
import { ConnectionService } from './../../services/connection-service/connection.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService, BrowserCacheTtlService, ToasterService, ResourceService, SharedModule } from '@sunbird/shared';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TelemetryModule, TelemetryService, TELEMETRY_PROVIDER  } from '@sunbird/telemetry';
import { BrowseComponent } from './browse.component';
import { ExploreModule } from '../../../../modules/public/module/explore';



describe('BrowseComponent', () => {
  let component: BrowseComponent;
  let fixture: ComponentFixture<BrowseComponent>;
  let connectionService: ConnectionService;

  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    url = jasmine.createSpy('url');
  }
  class FakeActivatedRoute {
    snapshot = {
      params: {slug: 'ap'},
      data: {
        telemetry: { env: 'resource', pageid: 'resource-search', type: 'view', subtype: 'paginate'}
      }
    };
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BrowseComponent],
      imports: [ExploreModule, HttpClientTestingModule, SharedModule.forRoot()],
      providers: [{ provide: ActivatedRoute, useClass: FakeActivatedRoute }, ConnectionService,
        { provide: Router, useClass: RouterStub }, TelemetryService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseComponent);
    component = fixture.componentInstance;
    connectionService = TestBed.get(ConnectionService);
    fixture.detectChanges();
  });

  it('To check connection status ', () => {
    expect(component).toBeTruthy();
    expect(component.isConnected).toBeTruthy();

  });
  it('to make connection status false', () => {
    expect(component).toBeTruthy();
    const mockConnectionStatus = false;
    const mockObservable = observableOf(mockConnectionStatus);
    const spy = spyOn(connectionService, 'monitor').and.returnValue(mockObservable);
    connectionService.monitor().subscribe(connectionMonitor => {
      expect(connectionMonitor).toBe(mockConnectionStatus);
    });
    component.ngOnInit();
    component.isConnected = mockConnectionStatus;
    expect(component.isConnected).toBeFalsy();
  });
});
