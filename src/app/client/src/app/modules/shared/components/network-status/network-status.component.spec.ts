import { SharedModule } from '@sunbird/shared';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ResourceService, ConnectionService } from '@sunbird/shared';
import { configureTestSuite } from '@sunbird/test-util';
import { NetworkStatusComponent } from './network-status.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';

describe('NetworkStatusComponent', () => {
  let component: NetworkStatusComponent;
  let fixture: ComponentFixture<NetworkStatusComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  configureTestSuite();
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot()],
      providers: [ResourceService, ConnectionService, { provide: Router, useClass: RouterStub }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change is connected', () => {
    const connectionService = TestBed.inject(ConnectionService);
    spyOn(connectionService, 'monitor').and.returnValue(of(false));
    component.ngOnInit();
    expect(component.isConnected).toBeFalsy();
  });



});
