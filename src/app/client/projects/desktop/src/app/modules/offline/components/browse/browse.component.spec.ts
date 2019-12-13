import { of as observableOf} from 'rxjs';
import { ConnectionService } from './../../services/connection-service/connection.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ResourceService, SharedModule } from '@sunbird/shared';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowseComponent } from './browse.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';



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
      params: { slug: 'ap' },
      data: {
        telemetry: { env: 'resource', pageid: 'resource-search', type: 'view', subtype: 'paginate' }
      }
    };
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BrowseComponent],
      imports: [HttpClientTestingModule, SharedModule.forRoot()],
      providers: [ConnectionService, ResourceService],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('To check connection status ', () => {
    connectionService = TestBed.get(ConnectionService);
    spyOn(connectionService, 'monitor').and.returnValue(observableOf(true));
    expect(component).toBeTruthy();
    expect(component.isConnected).toBeTruthy();
  });

  it('to make connection status false', () => {
    connectionService = TestBed.get(ConnectionService);
    spyOn(connectionService, 'monitor').and.returnValue(observableOf(false));
    connectionService.monitor().subscribe(connectionMonitor => {
      expect(connectionMonitor).toBe(false);
    });
    component.ngOnInit();
    expect(component.isConnected).toBeFalsy();
  });
});
