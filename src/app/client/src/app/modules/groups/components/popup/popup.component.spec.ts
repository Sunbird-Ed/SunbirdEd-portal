import { FormsModule } from '@angular/forms';
import { fakeActivatedRoute, groupData } from './../../services/groups/groups.service.spec.data';
import { Router, ActivatedRoute } from '@angular/router';
import { TelemetryService } from '@sunbird/telemetry';
import { configureTestSuite } from '@sunbird/test-util';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '@sunbird/shared';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';

import { PopupComponent } from './popup.component';
import { acceptTnc } from '../../interfaces';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('PopupComponent', () => {
  let component: PopupComponent;
  let fixture: ComponentFixture<PopupComponent>;
  let closeModalSpy;
  configureTestSuite();

  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    url: '/';
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PopupComponent],
      imports: [SuiModule, SharedModule.forRoot(), HttpClientTestingModule, FormsModule, BrowserAnimationsModule],
      providers: [
        TelemetryService,
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupComponent);
    component = fixture.componentInstance;
    closeModalSpy = spyOn<any>(component, 'closeDialog');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should "emit event with name: delete " when param is delete', () => {
    component.name = 'delete';
    spyOn(component.handleEvent, 'emit');
    component.emitEvent(true);
    expect(component.handleEvent.emit).toHaveBeenCalledWith({ name: 'delete', action: true });
    expect(closeModalSpy).toHaveBeenCalled();
  });

  it('should "emit event with name: deActivate " when param is delete', () => {
    component.name = 'deActivate';
    spyOn(component.handleEvent, 'emit');
    component.emitEvent(true);
    expect(component.handleEvent.emit).toHaveBeenCalledWith({ name: 'deActivate', action: true });
    expect(closeModalSpy).toHaveBeenCalled();
  });

  it('should "emit event with name: activate " when param is delete', () => {
    component.name = 'activate';
    spyOn(component.handleEvent, 'emit');
    component.emitEvent(true);
    expect(component.handleEvent.emit).toHaveBeenCalledWith({ name: 'activate', action: true });
    expect(closeModalSpy).toHaveBeenCalled();
  });

  it('should "emit empty event "', () => {
    component.name = 'delete';
    spyOn(component.handleEvent, 'emit');
    component.emitEvent(false);
    expect(component.handleEvent.emit).toHaveBeenCalledWith({ name: 'delete', action: false });
    expect(closeModalSpy).toHaveBeenCalled();
  });

  it('should "emit handleGroupTnc event "', () => {
    component.type = acceptTnc.GROUP;
    spyOn(component.handleGroupTnc, 'emit');
    component.acceptGroupTnc();
    expect(component.handleGroupTnc.emit).toHaveBeenCalledWith({ type: acceptTnc.GROUP });
    expect(closeModalSpy).toHaveBeenCalled();
  });

  it('should "emit handleGroupTnc event  and close Modal"', () => {
    spyOn(component.handleGroupTnc, 'emit');
    component.closeModal();
    expect(component.handleGroupTnc.emit).toHaveBeenCalledWith();
    expect(closeModalSpy).toHaveBeenCalled();
  });

});
