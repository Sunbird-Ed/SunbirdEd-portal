import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { SharedModule, ResourceService } from '@sunbird/shared';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionStatusComponent } from './connection-status.component';
import { TelemetryModule } from 'src/app/modules/telemetry';
import { ConnectionService } from '../../services';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ConnectionStatusComponent', () => {
  let component: ConnectionStatusComponent;
  let fixture: ComponentFixture<ConnectionStatusComponent>;
  const resourceBundle = {
    frmelmnts: {
      lbl: {
        offline: 'You are offline',
        import: 'Import Books to access while offline',
        online: 'You are online',
        downloadBooks: 'Download books to access while offline',
      },
      btn: {
        loadContent: 'Load Content',
        browse: 'Browse Online'
      }
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectionStatusComponent ],
      imports: [TelemetryModule.forRoot(), RouterModule.forRoot([]), HttpClientModule, SharedModule.forRoot()],
      providers: [{ provide: ResourceService, useValue: resourceBundle }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    const connectionService = TestBed.get(ConnectionService);
    spyOn(connectionService, 'monitor').and.returnValue(of(true));
    component.ngOnInit();
    expect(connectionService.monitor).toHaveBeenCalled();
    expect(component.isConnected).toBeTruthy();
  });

  it('Call handleImportContentDialog when click on load content', () => {
    component.handleImportContentDialog();
    expect(component.showLoadContentModal).toBeTruthy();
});

it('Call closeLoadContentModal when modal closes', () => {
    component.showLoadContentModal = true;
    component.handleImportContentDialog();
    expect(component.showLoadContentModal).toBeFalsy();
});

  it('should test online text', () => {
    const connectionService = TestBed.get(ConnectionService);
    spyOn(connectionService, 'monitor').and.callFake(() => (of(true)));
    component.ngOnInit();
    const onlineText = fixture.debugElement.query(By.css('.fs-1.status-container__title')).nativeElement.innerText;
    const msg = fixture.debugElement.query(By.css('.mt-8.text-center.status-container__para')).nativeElement.innerText;
    const button = fixture.debugElement.query(By.css('.sb-btn-outline-secondary')).nativeElement.innerText;
    expect(onlineText).toEqual(resourceBundle.frmelmnts.lbl.online);
    expect(msg).toEqual(resourceBundle.frmelmnts.lbl.downloadBooks);
    expect(button).toEqual(resourceBundle.frmelmnts.btn.browse);
  });

});
