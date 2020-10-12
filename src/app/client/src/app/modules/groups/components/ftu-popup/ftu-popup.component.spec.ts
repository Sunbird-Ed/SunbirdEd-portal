import { RouterTestingModule } from '@angular/router/testing';
import { TelemetryService } from '@sunbird/telemetry';
import { SharedModule, ResourceService } from '@sunbird/shared';
import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from '@sunbird/test-util';
import { FtuPopupComponent } from './ftu-popup.component';
import { SlickModule } from 'ngx-slick';
import { SuiModalModule } from 'ng2-semantic-ui';
import { ActivatedRoute, Router } from '@angular/router';
import { fakeActivatedRoute } from '../../services/groups/groups.service.spec.data';
import { APP_BASE_HREF } from '@angular/common';

describe('FtuPopupComponent', () => {
  let component: FtuPopupComponent;
  let fixture: ComponentFixture<FtuPopupComponent>;
  configureTestSuite();
  const resourceBundle = {
    frmelmnts: {
      lbl: {
        groupWelcomeTitle: 'Welcome to groups',
      },
    }
  };

  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    url: '/my-groups';
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FtuPopupComponent ],
      imports: [HttpClientModule, SlickModule, SuiModalModule, SharedModule.forRoot(), RouterTestingModule],
      providers: [ { provide: ResourceService, useValue: resourceBundle },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: Router, useClass: RouterStub },
        TelemetryService,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FtuPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    spyOn(component.close, 'emit');
    component.closeModal();
    expect(component.close.emit).toHaveBeenCalledWith(true);
  });

  it('should emit close event', () => {
    spyOn(component.close, 'emit');
    component.closeMemberPopup();
    expect(component.close.emit).toHaveBeenCalledWith(true);
  });

  it('should call addTelemetry', () => {
    spyOn(component['groupService'], 'addTelemetry');
    component.addTelemetry('close-ftu');
    expect(component['groupService'].addTelemetry).toHaveBeenCalledWith({id: 'close-ftu'}, fakeActivatedRoute.snapshot, [{id: '123', type: 'group'}]);
  });

});
