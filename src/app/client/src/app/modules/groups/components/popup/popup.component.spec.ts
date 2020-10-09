import { fakeActivatedRoute } from './../../services/groups/groups.service.spec.data';
import { Router, ActivatedRoute } from '@angular/router';
import { TelemetryService } from '@sunbird/telemetry';
import { configureTestSuite } from '@sunbird/test-util';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '@sunbird/shared';
import { SuiModule } from 'ng2-semantic-ui';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';

import { PopupComponent } from './popup.component';

describe('PopupComponent', () => {
  let component: PopupComponent;
  let fixture: ComponentFixture<PopupComponent>;
  configureTestSuite();

  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    url: '/';
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupComponent ],
      imports: [ SuiModule, SharedModule.forRoot(), HttpClientTestingModule ],
      providers: [
        TelemetryService,
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: Router, useClass: RouterStub},
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it ('should "emit event with name: delete " when param is delete', () => {
    component.modalName = 'delete';
    spyOn(component.handleEvent, 'emit');
    spyOn(component.modal, 'close');
    component.emitEvent(true);
    expect(component.handleEvent.emit).toHaveBeenCalledWith({name: 'delete', action: true});
    expect(component.modal.close).toHaveBeenCalled();
  });

  it ('should "emit event with name: deActivate " when param is delete', () => {
    component.modalName = 'deActivate';
    spyOn(component.handleEvent, 'emit');
    spyOn(component.modal, 'close');
    component.emitEvent(true);
    expect(component.handleEvent.emit).toHaveBeenCalledWith({name: 'deActivate', action: true});
    expect(component.modal.close).toHaveBeenCalled();
  });

  it ('should "emit event with name: activate " when param is delete', () => {
    component.modalName = 'activate';
    spyOn(component.handleEvent, 'emit');
    spyOn(component.modal, 'close');
    component.emitEvent(true);
    expect(component.handleEvent.emit).toHaveBeenCalledWith({name: 'activate', action: true});
    expect(component.modal.close).toHaveBeenCalled();
  });

  it ('should "emit empty event "', () => {
    component.modalName = 'delete';
    spyOn(component.handleEvent, 'emit');
    spyOn(component.modal, 'close');
    component.emitEvent(false);
    expect(component.handleEvent.emit).toHaveBeenCalledWith({name: 'delete', action: false});
    expect(component.modal.close).toHaveBeenCalled();
  });

});
