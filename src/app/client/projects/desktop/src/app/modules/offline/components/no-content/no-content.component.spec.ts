import { TelemetryModule } from '@sunbird/telemetry';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoContentComponent } from './no-content.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ElectronDialogService } from '../../services';

describe('NoContentComponent', () => {
  let component: NoContentComponent;
  let fixture: ComponentFixture<NoContentComponent>;
  const routerStub = {
    navigateByUrl: jasmine.createSpy('navigateByUrl')
  };
  class ActivatedRouteStub {
    snapshot = {
      data: {
        telemetry: {
          env: 'library',
          pageid: 'library'
        }
      }
    };
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule.forRoot(), HttpClientTestingModule, TelemetryModule.forRoot()],
      declarations: [ NoContentComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: Router, useValue: routerStub},
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    spyOn(component.connectionService, 'monitor').and.returnValue(of(true));
    component.ngOnInit();
    expect(component.isConnected).toBeTruthy();
  });

  it('should call showContentImportDialog', () => {
    const electronDialogService = TestBed.get(ElectronDialogService);
    spyOn(electronDialogService, 'showContentImportDialog');
    component.openImportContentDialog();
    expect(electronDialogService.showContentImportDialog).toHaveBeenCalled();
  });

  it('should change ShowModal', () => {
    expect(component.showModal).toBeFalsy();
    component.handleModal();
    expect(component.showModal).toBeTruthy();
  });

  it('should call TelemetryInteract service', () => {
    spyOn(component.telemetryService, 'interact');
    component.addInteractEvent();
    expect(component.telemetryService.interact).toHaveBeenCalled();
  });

});
